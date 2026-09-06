"""Optional plate detection and OCR pipeline."""

from typing import Any


class ANPRPipeline:
	def __init__(self, plate_detector: Any = None, ocr: Any = None, ocr_threshold: float = 0.5) -> None:
		self.plate_detector = plate_detector
		self.ocr = ocr
		self.ocr_threshold = ocr_threshold

	def read(self, image: Any) -> list[dict[str, Any]]:
		if self.plate_detector is None or self.ocr is None:
			return []
		results = []
		for crop in self.plate_detector.predict(image):
			ocr_result = self.ocr.ocr(crop["image"], cls=True)
			for line in ocr_result or []:
				for box, (text, confidence) in line or []:
					if float(confidence) >= self.ocr_threshold:
						results.append({"text": str(text), "confidence": float(confidence),
										"bbox": crop.get("bbox")})
		return results
