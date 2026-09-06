"""Geometry-based virtual-fence events."""

from typing import Any


def point_in_polygon(point: tuple[float, float], polygon: list[list[float]]) -> bool:
	x, y = point
	inside = False
	for index, (x1, y1) in enumerate(polygon):
		x2, y2 = polygon[index - 1]
		if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
			inside = not inside
	return inside


class VirtualFence:
	def __init__(self, zones: dict[str, list[list[float]]], severity: str = "HIGH") -> None:
		self.zones = zones
		self.severity = severity
		self._inside: set[tuple[str, int]] = set()

	def evaluate(self, tracks: list[dict[str, Any]]) -> list[dict[str, Any]]:
		events = []
		for track in tracks:
			bbox = track["bbox"]
			center = ((bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2)
			for zone_name, polygon in self.zones.items():
				key = (zone_name, int(track["track_id"]))
				current = point_in_polygon(center, polygon)
				if current and key not in self._inside:
					events.append({"event_type": "INTRUSION", "severity": self.severity,
								   "track_id": int(track["track_id"]), "object_type": track["class_name"],
								   "confidence": track["confidence"], "bbox": track["bbox"],
								   "metadata": {"zone": zone_name}})
				if current:
					self._inside.add(key)
				else:
					self._inside.discard(key)
		return events
