"""Reusable Ultralytics YOLO detector with lazy, configurable loading."""

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Iterable


@dataclass
class Detection:
	class_id: int
	class_name: str
	confidence: float
	bbox: list[float]

	def to_dict(self) -> dict[str, Any]:
		return asdict(self)


class YOLODetector:
	def __init__(self, model_name: str = "yolo11n.pt", confidence_threshold: float = 0.35,
				 device: str | None = None, class_filter: Iterable[str] | None = None) -> None:
		self.model_name = model_name
		self.confidence_threshold = confidence_threshold
		self.device = device
		self.class_filter = set(class_filter) if class_filter else None
		self._model: Any = None

	def load(self) -> Any:
		if self._model is None:
			try:
				from ultralytics import YOLO
			except ImportError as exc:
				raise RuntimeError("Install ultralytics before loading a YOLO model") from exc
			self._model = YOLO(self.model_name)
		return self._model

	def predict(self, frame: Any) -> list[dict[str, Any]]:
		model = self.load()
		kwargs: dict[str, Any] = {"conf": self.confidence_threshold, "verbose": False}
		if self.device:
			kwargs["device"] = self.device
		results = model.predict(frame, **kwargs)
		return self._parse_result(results[0]) if results else []

	def _parse_result(self, result: Any) -> list[dict[str, Any]]:
		names = result.names
		detections: list[dict[str, Any]] = []
		boxes = result.boxes
		for index in range(len(boxes)):
			class_id = int(boxes.cls[index].item())
			class_name = str(names[class_id])
			if self.class_filter and class_name not in self.class_filter:
				continue
			detection = Detection(
				class_id=class_id,
				class_name=class_name,
				confidence=float(boxes.conf[index].item()),
				bbox=[float(value) for value in boxes.xyxy[index].tolist()],
			)
			detections.append(detection.to_dict())
		return detections

	@property
	def model_loaded(self) -> bool:
		return self._model is not None


def select_device(preferred: str | None = None) -> str:
	if preferred:
		return preferred
	try:
		import torch
		return "cuda" if torch.cuda.is_available() else "cpu"
	except ImportError:
		return "cpu"
