"""Face detection interface with verified-identity safeguards."""

from typing import Any


class FaceRecognizer:
	def __init__(self, detector: Any = None, embedder: Any = None) -> None:
		self.detector = detector
		self.embedder = embedder

	def analyze(self, frame: Any) -> list[dict[str, Any]]:
		if self.detector is None:
			return []
		faces = self.detector.predict(frame)
		return [{"bbox": face["bbox"], "confidence": face["confidence"],
				 "identity": "UNKNOWN"} for face in faces]
