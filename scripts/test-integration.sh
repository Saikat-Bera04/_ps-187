#!/usr/bin/env bash
# End-to-end integration smoke test for IBVAP pipeline:
# ML simulate -> Backend -> PostgreSQL -> (WebSocket -> Frontend)
set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:4000}"
ML_URL="${ML_URL:-http://localhost:8000}"
AI_API_KEY="${AI_API_KEY:-ibvap-ai-dev-key-change-in-production}"

echo "=== 1. Backend health ==="
curl -sf "$BACKEND_URL/api/system/health" -H "Authorization: Bearer ${IBVAP_TOKEN:-}" || echo "(requires auth token for /system/health)"

echo ""
echo "=== 2. Direct AI event ingestion ==="
curl -sf -X POST "$BACKEND_URL/api/ai/events" \
  -H "Content-Type: application/json" \
  -H "X-AI-API-Key: $AI_API_KEY" \
  -d '{
    "cameraId": "BOP12-CAM04",
    "bopId": "BOP-12",
    "eventType": "INTRUSION",
    "objectType": "PERSON",
    "trackId": 72,
    "confidence": 0.96,
    "bbox": [421, 183, 523, 462],
    "zone": "NORTH_FENCE"
  }' | python3 -m json.tool

echo ""
echo "=== 3. ML simulate/intrusion (forwards to backend) ==="
curl -sf -X POST "$ML_URL/simulate/intrusion" \
  -H "Content-Type: application/json" \
  -d '{
    "camera_id": "BOP12-CAM04",
    "bop_id": "BOP-12",
    "event_type": "INTRUSION",
    "confidence": 0.94,
    "zone": "NORTH_FENCE"
  }' | python3 -m json.tool

echo ""
echo "Done. Check dashboard for new alerts (WebSocket + refresh)."
