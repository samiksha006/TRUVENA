import sys
from pathlib import Path

import torch
from PIL import Image
from safetensors.torch import load_file

sys.path.insert(0, str(Path(__file__).parent / "ai_detector_model"))

from data.dct import DCT_base_Rec_Module
from models import AIDE as build_aide_model
from ai_detector_model.inference import predict_pil_images


MODEL_DIR = Path("ai_detector_model")
IMAGE_PATH = Path(r"C:\Users\samik\Downloads\ChatGPT Image Aug 29, 2026, 10_02_10 AM.png")


device = "cuda" if torch.cuda.is_available() else "cpu"

print("Device:", device)
print("Loading AIDE model...")

# Build architecture without external pretrained weights.
model = build_aide_model(
    resnet_path=None,
    convnext_path=None
)

print("Loading trained checkpoint...")

state_dict = load_file(
    str(MODEL_DIR / "model.safetensors"),
    device="cpu"
)

missing, unexpected = model.load_state_dict(
    state_dict,
    strict=False
)

print("Missing keys:", len(missing))
print("Unexpected keys:", len(unexpected))

if missing:
    print("First missing keys:")
    print(missing[:10])

model.to(device)
model.eval()

print("Model loaded.")
print("Running prediction...")

image = Image.open(IMAGE_PATH).convert("RGB")

result = predict_pil_images(
    model,
    [image],
    device=device
)[0]

print("\n========== AIDE RESULT ==========")
print("Label:", result["label"])
print("Real probability:", result["real_probability"])
print("Fake probability:", result["fake_probability"])
print("=================================")