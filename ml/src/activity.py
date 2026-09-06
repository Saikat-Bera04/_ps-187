"""Configurable, rule-based activity events."""

from collections import defaultdict
from datetime import datetime, time
from math import hypot
from typing import Any


class ActivityMonitor:
	def __init__(self, loitering_seconds: float = 60, night_hours: tuple[int, int] = (22, 6),
				 movement_pixels: float = 5) -> None:
		self.loitering_seconds = loitering_seconds
		self.night_hours = night_hours
		self.movement_pixels = movement_pixels
		self._first_seen: dict[int, float] = {}
		self._last_center: dict[int, tuple[float, float]] = {}

	def evaluate(self, tracks: list[dict[str, Any]], timestamp: datetime | None = None) -> list[dict[str, Any]]:
		now = timestamp or datetime.now()
		events = []
		for track in tracks:
			track_id = int(track["track_id"])
			bbox = track["bbox"]
			center = ((bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2)
			first_seen = self._first_seen.setdefault(track_id, now.timestamp())
			elapsed = now.timestamp() - first_seen
			movement = hypot(center[0] - self._last_center.get(track_id, center)[0],
							 center[1] - self._last_center.get(track_id, center)[1])
			if elapsed >= self.loitering_seconds and movement <= self.movement_pixels:
				events.append(self._event("LOITERING", "MEDIUM", track, {"duration_seconds": elapsed}))
			if self._is_night(now.time()) and movement > self.movement_pixels:
				events.append(self._event("NIGHT_MOVEMENT", "MEDIUM", track, {}))
			self._last_center[track_id] = center
		return events

	def _is_night(self, value: time) -> bool:
		start, end = self.night_hours
		return value.hour >= start or value.hour < end if start > end else start <= value.hour < end

	@staticmethod
	def _event(event_type: str, severity: str, track: dict[str, Any], metadata: dict[str, Any]) -> dict[str, Any]:
		return {"event_type": event_type, "severity": severity, "track_id": int(track["track_id"]),
				"object_type": track["class_name"], "confidence": track["confidence"],
				"bbox": track["bbox"], "metadata": metadata}
