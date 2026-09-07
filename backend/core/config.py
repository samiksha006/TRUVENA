from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

PROJECT_NAME = "TRUVENA"
VERSION = "1.0.0"
TAGLINE = "Detect the unknown. Discover the source. Protect the truth."

AI_PROBABILITY_THRESHOLD_HIGH = 0.75
AI_PROBABILITY_THRESHOLD_LOW = 0.30
DNA_NOVELTY_THRESHOLD_UNKNOWN = 0.78
KNOWN_MATCH_THRESHOLD = 0.70
