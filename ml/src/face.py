"""Optional OpenCV face detector; recognition remains UNKNOWN without a gallery."""

from pathlib import Path
from typing import Any

import cv2


class FaceDetector:
	def __init__(self, cascade_path: str | None = None, min_size: tuple[int, int] = (30, 30)) -> None:
		path = cascade_path or cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
		if not Path(path).exists():
			raise FileNotFoundError(f"Face detector cascade not found: {path}")
		self._cascade = cv2.CascadeClassifier(path)
		self.min_size = min_size

	def detect(self, frame: Any) -> list[dict[str, Any]]:
		gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
		faces = self._cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=self.min_size)
		return [{"bbox": [float(x), float(y), float(x + width), float(y + height)],
				 "confidence": None, "identity": "UNKNOWN"}
				for x, y, width, height in faces]

	def draw(self, frame: Any, faces: list[dict[str, Any]]) -> Any:
		output = frame.copy()
		for face in faces:
			x1, y1, x2, y2 = [int(value) for value in face["bbox"]]
			cv2.rectangle(output, (x1, y1), (x2, y2), (255, 180, 0), 2)
		return output