"""Forward ML detections to the Node.js IBVAP backend."""

from __future__ import annotations

import logging
import os
from typing import Any

import httpx

logger = logging.getLogger(__name__)

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:4000")
AI_API_KEY = os.getenv("AI_API_KEY", "ibvap-ai-dev-key-change-in-production")


def _normalize_event(raw: dict[str, Any], camera_id: str, bop_id: str | None, timestamp: str) -> dict[str, Any]:
	"""Map ML event format to the IBVAP backend contract."""
	bbox = raw.get("bounding_box") or raw.get("bbox")
	zone = (
		raw.get("zone")
		or raw.get("zone_id")
		or (raw.get("metadata") or {}).get("zone")
		or "UNKNOWN"
	)
	payload: dict[str, Any] = {
		"cameraId": camera_id,
		"timestamp": timestamp,
		"eventType": str(raw.get("event_type", "PERSON_DETECTED")).upper(),
		"objectType": str(raw.get("object_type", "PERSON")).upper(),
		"confidence": float(raw.get("confidence") or 0.5),
		"zone": str(zone),
	}
	if bop_id:
		payload["bopId"] = bop_id
	if raw.get("track_id") is not None:
		payload["trackId"] = int(raw["track_id"])
	if bbox and len(bbox) == 4:
		payload["bbox"] = [float(v) for v in bbox]
	if raw.get("metadata"):
		payload["metadata"] = raw["metadata"]
	return payload


def forward_events(
	events: list[dict[str, Any]],
	camera_id: str,
	bop_id: str | None = None,
	timestamp: str | None = None,
) -> list[dict[str, Any]]:
	"""POST each detection event to POST /api/ai/events."""
	if not events:
		return []

	ts = timestamp or events[0].get("timestamp") or ""
	results: list[dict[str, Any]] = []
	headers = {"Content-Type": "application/json", "X-AI-API-Key": AI_API_KEY}

	with httpx.Client(timeout=10.0) as client:
		for raw in events:
			payload = _normalize_event(raw, camera_id, bop_id, ts or raw.get("timestamp", ""))
			try:
				response = client.post(f"{BACKEND_URL.rstrip('/')}/api/ai/events", json=payload, headers=headers)
				response.raise_for_status()
				body = response.json()
				results.append(body.get("data", body))
				logger.info("Forwarded %s -> event %s", payload["eventType"], body.get("data", {}).get("event", {}).get("eventId"))
			except httpx.HTTPError as exc:
				logger.error("Failed to forward event to backend: %s", exc)
				results.append({"error": str(exc), "payload": payload})
	return results
