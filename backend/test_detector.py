from transformers import pipeline

IMAGE_PATH = r"C:\Users\samik\Downloads\ChatGPT Image Aug 29, 2026, 10_02_10 AM.png"

print("Loading detector...")

detector = pipeline(
    "image-classification",
    model="Smogy/SMOGY-Ai-images-detector",
    device=-1
)

print("Detector loaded.")
print("Analyzing image...")

results = detector(IMAGE_PATH)

print("\n========== TRUVENA DETECTOR TEST ==========")

for result in results:
    print(
        f"{result['label']}: "
        f"{result['score'] * 100:.2f}%"
    )

print("===========================================")