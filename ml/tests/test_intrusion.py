import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.detector import YOLODetector, select_device
from src.intrusion import VirtualFence
from src.tracker import ObjectTracker


parser = argparse.ArgumentParser()
parser.add_argument("--image", required=True)
parser.add_argument("--zone", required=True, help="JSON polygon, e.g. [[0,0],[500,0],[500,500],[0,500]]")
args = parser.parse_args()
if not Path(args.image).is_file():
	raise FileNotFoundError(args.image)
tracks = ObjectTracker(YOLODetector("yolo11n.pt", device=select_device())).track(args.image)
print(VirtualFence({"restricted": json.loads(args.zone)}).evaluate(tracks))