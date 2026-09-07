import argparse
import sys
from pathlib import Path

import cv2

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.anpr import ANPRPipeline


parser = argparse.ArgumentParser()
parser.add_argument("--image", required=True)
args = parser.parse_args()
if not Path(args.image).is_file():
	raise FileNotFoundError(args.image)
image = cv2.imread(args.image)
print(ANPRPipeline().read(image))