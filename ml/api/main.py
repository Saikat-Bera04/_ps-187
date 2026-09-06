"""FastAPI entry point for frame analysis."""

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import yaml
from fastapi import FastAPI, File, HTTPException, UploadFile

from ml.src.activity import ActivityMonitor
from ml.src.detector import YOLODetector, select_device
from ml.src.intrusion import VirtualFence
from ml.src.tracker import ObjectTracker


ROOT = Path(__file__).resolve().parents[1]
with (ROOT / "config.yaml").open(encoding="utf-8") as config_file:
	CONFIG = yaml.safe_load(config_file) or {}

device = select_device(CONFIG.get("device"))
detector = YOLODetector(CONFIG["model_path"], CONFIG["confidence_threshold"], device,
						CONFIG.get("classes"))
tracker = ObjectTracker(detector, CONFIG.get("tracker", "bytetrack.yaml"))
fence = VirtualFence(CONFIG.get("restricted_zones", {}))
activity = ActivityMonitor(CONFIG["loitering_seconds"], tuple(CONFIG["night_hours"]))
app = FastAPI(title="IBVAP ML API", version="1.0.0")


@app.get("/health")
def health() -> dict[str, Any]:
	return {"status": "ok", "device": device, "model_loaded": detector.model_loaded,
			"enabled_modules": CONFIG.get("enabled_modules", {})}


@app.post("/analyze/frame")
async def analyze_frame(file: UploadFile = File(...), camera_id: str = "CAM_001") -> dict[str, Any]:
	if not file.content_type or not file.content_type.startswith("image/"):
		raise HTTPException(status_code=415, detail="Upload an image frame")
	contents = await file.read()
	image = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
	if image is None:
		raise HTTPException(status_code=400, detail="Could not decode image")
	try:
		detections = detector.predict(image)
		tracks = tracker.track(image) if CONFIG["enabled_modules"].get("tracking", True) else []
	except (RuntimeError, FileNotFoundError) as exc:
		raise HTTPException(status_code=503, detail=str(exc)) from exc
	events = fence.evaluate(tracks) + activity.evaluate(tracks)
	timestamp = datetime.now(timezone.utc).isoformat()
	for event in events:
		event.update({"camera_id": camera_id, "timestamp": timestamp})
	return {"camera_id": camera_id, "timestamp": timestamp, "detections": detections,
			"tracks": tracks, "events": events}
