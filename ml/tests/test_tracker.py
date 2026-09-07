import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.detector import YOLODetector, select_device
from src.tracker import ObjectTracker


parser = argparse.ArgumentParser()
parser.add_argument("--image", required=True)
args = parser.parse_args()
image_path = Path(args.image)
if not image_path.is_file():
	raise FileNotFoundError(image_path)
print(ObjectTracker(YOLODetector("yolo11n.pt", device=select_device())).track(str(image_path)))