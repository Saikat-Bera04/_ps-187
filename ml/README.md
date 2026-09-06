# IBVAP ML Platform

This directory contains the ML services for the Intelligent Border Video Analytics Platform. The design uses pretrained models where appropriate and keeps measurable rule-based events separate from future action-recognition models.

## Architecture

- `src/detector.py`: lazy-loaded Ultralytics YOLO detection and CPU/CUDA selection.
- `src/tracker.py`: YOLO tracking with ByteTrack or BoT-SORT; no tracker training.
- `src/anpr.py`: optional plate-detector plus PaddleOCR adapter. OCR confidence remains probabilistic.
- `src/face_recognition.py`: optional face detector interface; identity is `UNKNOWN` until verified by a configured embedding matcher.
- `src/intrusion.py`: polygon fence geometry and `INTRUSION` events.
- `src/activity.py`: configurable loitering, night movement, and movement rules. These are not a trained suspicious-activity model.
- `api/main.py`: FastAPI service.
- `config.yaml`: model paths, thresholds, zones, and module switches.

## Setup

From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r ml/requirements.txt
```

The first YOLO inference downloads the configured pretrained weight if it is not already present. No dataset, weight, or metric is included in this repository.

## Dataset and training

Use a real YOLO dataset with `images/{train,val,test}`, `labels/{train,val,test}`, and `data.yaml`. Confirm that `data.yaml` contains the class names; do not assume the suggested `person`, `car`, `truck`, `bus`, and `motorcycle` classes exist.

Open the existing `notebooks/01_yolo_training.ipynb`, set `DATASET_YAML`, `MODEL_NAME`, `EPOCHS`, `IMAGE_SIZE`, `BATCH_SIZE`, and `CONFIDENCE_THRESHOLD`, then run the explicit training cell. Training is never started automatically. Validation and metrics are only real after that cell is executed on a real dataset.

## API

```powershell
python -m uvicorn ml.api.main:app --reload
```

`GET /health` reports service state and selected device. Send an image to `POST /analyze/frame`:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/analyze/frame?camera_id=CAM_001" -F "file=@frame.jpg"
```

The response contains JSON-serializable `detections`, `tracks`, and `events`. Events use `camera_id`, ISO-8601 `timestamp`, `event_type`, `severity`, `track_id`, `object_type`, `confidence`, `bbox`, and `metadata` fields. The backend can consume this response directly or forward events to its event bus.

## Video and notebook testing

The notebook provides guarded cells for image/video inference, tracking, fence testing, loitering, night movement, ANPR, face, activity, full-pipeline testing, and event serialization. Cells that need a path or model weight skip cleanly until configured. It does not fabricate data or results.
