"""JSON-compatible event normalization for backend consumers."""

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4


class EventManager:
	def __init__(self, camera_id: str = "CAM_001") -> None:
		self.camera_id = camera_id
		self.events: list[dict[str, Any]] = []

	def add(self, event_type: str, severity: str = "MEDIUM", message: str | None = None,
			track: dict[str, Any] | None = None, metadata: dict[str, Any] | None = None,
			confidence: float | None = None, timestamp: str | None = None) -> dict[str, Any]:
		event = {
			"event_id": str(uuid4()), "event_type": event_type,
			"timestamp": timestamp or datetime.now(timezone.utc).isoformat(),
			"camera_id": self.camera_id, "track_id": track.get("track_id") if track else None,
			"object_type": track.get("class_name") if track else None,
			"confidence": confidence if confidence is not None else (track.get("confidence") if track else None),
			"bounding_box": track.get("bbox") if track else None, "severity": severity,
			"message": message or event_type.replace("_", " ").title(), "metadata": metadata or {},
		}
		self.events.append(event)
		return event

	def normalize(self, raw_events: list[dict[str, Any]], timestamp: str | None = None) -> list[dict[str, Any]]:
		return [self.add(event["event_type"], event.get("severity", "MEDIUM"),
						track={"track_id": event.get("track_id"), "class_name": event.get("object_type"),
								"confidence": event.get("confidence"), "bbox": event.get("bbox")},
						metadata=event.get("metadata"), timestamp=timestamp)
				for event in raw_events]