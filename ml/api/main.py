"""FastAPI entry point for frame analysis."""

import logging
import os
from datetime import datetime, timezone
from pathlib import Path
import tempfile
from typing import Any

import cv2
import numpy as np
import yaml
from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

try:
	from ml.api.backend_client import forward_events
	from ml.src.activity import ActivityMonitor
	from ml.src.anpr import ANPRPipeline
	from ml.src.detector import YOLODetector, select_device
	from ml.src.events import EventManager
	from ml.src.face import FaceDetector
	from ml.src.intrusion import VirtualFence
	from ml.src.pipeline import VideoPipeline
	from ml.src.tracker import ObjectTracker
except ModuleNotFoundError:
	from api.backend_client import forward_events
	from src.activity import ActivityMonitor
	from src.anpr import ANPRPipeline
	from src.detector import YOLODetector, select_device
	from src.events import EventManager
	from src.face import FaceDetector
	from src.intrusion import VirtualFence
	from src.pipeline import VideoPipeline
	from src.tracker import ObjectTracker


ROOT = Path(__file__).resolve().parents[1]
with (ROOT / "config.yaml").open(encoding="utf-8") as config_file:
	CONFIG = yaml.safe_load(config_file) or {}

device = select_device(CONFIG.get("device"))
model_path = Path(CONFIG["model_path"])
if not model_path.is_absolute():
	model_path = ROOT / model_path
detector = YOLODetector(str(model_path), CONFIG["confidence_threshold"], device,
						CONFIG.get("classes"))
tracker = ObjectTracker(detector, CONFIG.get("tracker", "bytetrack.yaml"))
fence = VirtualFence(CONFIG.get("restricted_zones", {}))
activity = ActivityMonitor(CONFIG["loitering_seconds"], tuple(CONFIG["night_hours"]))
event_manager = EventManager(CONFIG.get("camera_id", "CAM_001"))
face_detector = None
if CONFIG.get("enabled_modules", {}).get("face", False):
	try:
		face_detector = FaceDetector(CONFIG.get("face_cascade_path"))
	except (FileNotFoundError, cv2.error):
		face_detector = None
pipeline = VideoPipeline(detector, tracker, fence, activity, face_detector,
						 CONFIG.get("camera_id", "CAM_001"), CONFIG.get("process_every_n_frames", 1),
						 ANPRPipeline() if CONFIG.get("enabled_modules", {}).get("anpr", False) else None)
app = FastAPI(title="IBVAP ML API", version="1.0.0")
logger = logging.getLogger(__name__)

DEFAULT_CAMERA_ID = CONFIG.get("camera_id", "BOP12-CAM04")
DEFAULT_BOP_ID = CONFIG.get("bop_id", "BOP-12")
FORWARD_TO_BACKEND = os.getenv("FORWARD_TO_BACKEND", "true").lower() in {"1", "true", "yes"}


class SimulateIntrusionRequest(BaseModel):
	camera_id: str = Field(default=DEFAULT_CAMERA_ID)
	bop_id: str = Field(default=DEFAULT_BOP_ID)
	event_type: str = Field(default="INTRUSION")
	object_type: str = Field(default="PERSON")
	confidence: float = Field(default=0.96, ge=0, le=1)
	track_id: int = Field(default=72)
	zone: str = Field(default="NORTH_FENCE")
	bbox: list[float] = Field(default=[421, 183, 523, 462])


@app.get("/")
def root() -> dict[str, str]:
	return {"service": "IBVAP ML API", "health": "/health", "docs": "/docs"}


@app.get("/health")
def health() -> dict[str, Any]:
	return {"status": "ok", "device": device, "model_loaded": detector.model_loaded,
			"model_path": str(model_path), "face_available": face_detector is not None,
			"enabled_modules": CONFIG.get("enabled_modules", {})}


async def _decode_image(file: UploadFile) -> np.ndarray:
	if not file.content_type or not file.content_type.startswith("image/"):
		raise HTTPException(status_code=415, detail="Upload an image frame")
	contents = await file.read()
	image = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
	if image is None:
		raise HTTPException(status_code=400, detail="Could not decode image")
	return image


async def _analyze_image(file: UploadFile, camera_id: str, bop_id: str | None = None) -> dict[str, Any]:
	image = await _decode_image(file)
	try:
		result = pipeline.process_frame(image, timestamp=datetime.now(timezone.utc).isoformat())
	except (RuntimeError, FileNotFoundError) as exc:
		raise HTTPException(status_code=503, detail=str(exc)) from exc
	if camera_id != pipeline.camera_id:
		for event in result["events"]:
			event["camera_id"] = camera_id
	event_manager.events.extend(result["events"])
	result["anpr_status"] = "disabled" if not CONFIG.get("enabled_modules", {}).get("anpr", False) else "unavailable"
	result["face_status"] = "available" if face_detector is not None else "disabled"

	if FORWARD_TO_BACKEND and result["events"]:
		result["backend"] = forward_events(
			result["events"],
			camera_id=camera_id,
			bop_id=bop_id or DEFAULT_BOP_ID,
			timestamp=result["timestamp"],
		)
	return result


@app.post("/analyze/frame")
async def analyze_frame(
	file: UploadFile = File(...),
	camera_id: str = DEFAULT_CAMERA_ID,
	bop_id: str | None = None,
) -> dict[str, Any]:
	return await _analyze_image(file, camera_id, bop_id)


@app.post("/analyze/image")
async def analyze_image(
	file: UploadFile = File(...),
	camera_id: str = DEFAULT_CAMERA_ID,
	bop_id: str | None = None,
) -> dict[str, Any]:
	return await _analyze_image(file, camera_id, bop_id)


@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...), camera_id: str = "CAM_001") -> dict[str, Any]:
	if not file.filename:
		raise HTTPException(status_code=400, detail="A video filename is required")
	suffix = Path(file.filename).suffix or ".mp4"
	with tempfile.TemporaryDirectory() as temporary_directory:
		input_path = Path(temporary_directory) / f"input{suffix}"
		output_path = Path(temporary_directory) / "annotated.mp4"
		input_path.write_bytes(await file.read())
		try:
			result = pipeline.process_video(input_path, output_path)
		except (FileNotFoundError, RuntimeError, cv2.error) as exc:
			raise HTTPException(status_code=503, detail=str(exc)) from exc
		result.update({"camera_id": camera_id, "events": [], "message": "Annotated output was created during processing but is not persisted by this API."})
		return result


@app.get("/events")
def events() -> dict[str, Any]:
	return {"camera_id": event_manager.camera_id, "events": event_manager.events}


@app.post("/simulate/intrusion")
def simulate_intrusion(body: SimulateIntrusionRequest) -> dict[str, Any]:
	"""Demo endpoint: inject a synthetic INTRUSION into the Node.js backend."""
	timestamp = datetime.now(timezone.utc).isoformat()
	raw_event = {
		"event_type": body.event_type,
		"object_type": body.object_type,
		"track_id": body.track_id,
		"confidence": body.confidence,
		"bbox": body.bbox,
		"metadata": {"zone": body.zone},
		"timestamp": timestamp,
	}
	backend = forward_events(
		[raw_event],
		camera_id=body.camera_id,
		bop_id=body.bop_id,
		timestamp=timestamp,
	)
	return {"simulated": raw_event, "backend": backend}
