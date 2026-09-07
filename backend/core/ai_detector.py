import threading
from typing import Dict, Any

import numpy as np
from PIL import Image, ImageFilter
from transformers import pipeline


MODEL_ID = "capcheck/ai-image-detection"

_detector = None
_detector_lock = threading.Lock()


def get_detector():
    global _detector

    if _detector is None:
        with _detector_lock:
            if _detector is None:
                print("Loading AI image detector...")

                _detector = pipeline(
                    "image-classification",
                    model=MODEL_ID,
                    device=-1
                )

                print("AI image detector loaded.")

    return _detector


def _normalise_label(label: str) -> str:
    label = label.lower().strip()

    if any(word in label for word in [
        "fake",
        "ai",
        "artificial",
        "generated",
        "synthetic"
    ]):
        return "AI_GENERATED"

    if any(word in label for word in [
        "real",
        "human",
        "authentic"
    ]):
        return "REAL"

    return "UNKNOWN"


# ---------------------------------------------------------
# FORENSIC SIGNALS
# ---------------------------------------------------------

def _calculate_forensic_signals(image: Image.Image) -> Dict[str, float]:

    gray_image = image.convert("L").resize((512, 512))
    arr = np.asarray(gray_image, dtype=np.float32)

    # -----------------------------------------------------
    # 1. FFT FREQUENCY ANALYSIS
    # -----------------------------------------------------

    fft = np.fft.fft2(arr)
    fft_shift = np.fft.fftshift(fft)

    magnitude = np.abs(fft_shift)

    h, w = magnitude.shape
    cy, cx = h // 2, w // 2

    y, x = np.ogrid[:h, :w]
    radius = np.sqrt(
        (y - cy) ** 2 +
        (x - cx) ** 2
    )

    total_energy = magnitude.sum() + 1e-8

    # Ignore central low-frequency region
    high_frequency_energy = magnitude[
        radius > min(h, w) * 0.18
    ].sum()

    high_freq_ratio = (
        high_frequency_energy /
        total_energy
    )

    # -----------------------------------------------------
    # 2. EDGE / RESIDUAL ANALYSIS
    # -----------------------------------------------------

    edge_image = gray_image.filter(
        ImageFilter.FIND_EDGES
    )

    edge_arr = np.asarray(
        edge_image,
        dtype=np.float32
    )

    edge_variance = float(
        np.var(edge_arr)
    )

    edge_density = float(
        np.mean(edge_arr > 50)
    )

    # -----------------------------------------------------
    # 3. TEXTURE / CONTRAST
    # -----------------------------------------------------

    texture_std = float(
        np.std(arr)
    )

    # -----------------------------------------------------
    # 4. IMAGE ENTROPY
    # -----------------------------------------------------

    histogram, _ = np.histogram(
        arr,
        bins=256,
        range=(0, 255),
        density=True
    )

    histogram = histogram[
        histogram > 0
    ]

    entropy = float(
        -np.sum(
            histogram *
            np.log2(histogram)
        )
    )

    # -----------------------------------------------------
    # NORMALISED FORENSIC SCORES
    # -----------------------------------------------------

    frequency_score = np.clip(
        (high_freq_ratio - 0.45) / 0.30 * 100,
        0,
        100
    )

    residual_score = np.clip(
        (edge_variance - 1500) / 3500 * 100,
        0,
        100
    )

    texture_score = np.clip(
        (texture_std - 35) / 60 * 100,
        0,
        100
    )

    entropy_score = np.clip(
        (entropy - 5.5) / 2.0 * 100,
        0,
        100
    )

    edge_score = np.clip(
        (edge_density - 0.04) / 0.12 * 100,
        0,
        100
    )

    # -----------------------------------------------------
    # FORENSIC SUSPICION SCORE
    # -----------------------------------------------------

    forensic_score = (
        frequency_score * 0.30 +
        residual_score * 0.20 +
        texture_score * 0.15 +
        entropy_score * 0.15 +
        edge_score * 0.20
    )

    return {
        "high_freq_ratio": round(
            float(high_freq_ratio), 4
        ),

        "edge_variance": round(
            edge_variance, 2
        ),

        "edge_density": round(
            edge_density, 4
        ),

        "texture_std": round(
            texture_std, 2
        ),

        "entropy": round(
            entropy, 4
        ),

        "frequency_score": round(
            float(frequency_score), 2
        ),

        "residual_score": round(
            float(residual_score), 2
        ),

        "texture_score": round(
            float(texture_score), 2
        ),

        "entropy_score": round(
            float(entropy_score), 2
        ),

        "edge_score": round(
            float(edge_score), 2
        ),

        "forensic_score": round(
            float(forensic_score), 2
        )
    }


# ---------------------------------------------------------
# MAIN DETECTOR
# ---------------------------------------------------------

def detect_ai_image(
    image: Image.Image
) -> Dict[str, Any]:

    detector = get_detector()

    rgb_image = image.convert("RGB")

    predictions = detector(
        rgb_image,
        top_k=5
    )

    ai_probability = 0.0
    real_probability = 0.0

    for prediction in predictions:

        label = _normalise_label(
            prediction["label"]
        )

        score = float(
            prediction["score"]
        )

        if label == "AI_GENERATED":
            ai_probability = max(
                ai_probability,
                score
            )

        elif label == "REAL":
            real_probability = max(
                real_probability,
                score
            )

    # -----------------------------------------------------
    # FALLBACK
    # -----------------------------------------------------

    if ai_probability == 0.0 and real_probability == 0.0:

        ai_probability = 0.5
        real_probability = 0.5

    elif ai_probability == 0.0:

        ai_probability = 1.0 - real_probability

    elif real_probability == 0.0:

        real_probability = 1.0 - ai_probability

    # -----------------------------------------------------
    # FORENSIC ANALYSIS
    # -----------------------------------------------------

    forensic = _calculate_forensic_signals(
        rgb_image
    )

    forensic_score = forensic[
        "forensic_score"
    ]

    classifier_ai = ai_probability * 100

    # -----------------------------------------------------
    # EVIDENCE FUSION
    # -----------------------------------------------------

    # Classifier gets 45%
    # Forensic signals get 55%

    fused_score = (
        classifier_ai * 0.45 +
        forensic_score * 0.55
    )

    fused_score = float(
        np.clip(fused_score, 0, 100)
    )

    # -----------------------------------------------------
    # IMPORTANT:
    # Do not claim exact authorship.
    # -----------------------------------------------------

    if fused_score >= 65:

        classification = "AI Generated"

        evidence_level = "HIGH"

    elif fused_score >= 45:

        classification = "Uncertain"

        evidence_level = "MEDIUM"

    else:

        classification = "Authentic / Likely Real"

        evidence_level = "LOW"

    # -----------------------------------------------------
    # EVIDENCE
    # -----------------------------------------------------

    evidence = []

    evidence.append(
        f"Classifier AI signal: {classifier_ai:.1f}%"
    )

    evidence.append(
        f"Forensic signal score: {forensic_score:.1f}%"
    )

    evidence.append(
        f"Fused synthetic-media score: {fused_score:.1f}%"
    )

    if forensic["high_freq_ratio"] > 0.60:

        evidence.append(
            "Elevated high-frequency spectral activity detected"
        )

    if forensic["edge_density"] > 0.08:

        evidence.append(
            "High localized edge/residual density detected"
        )

    if forensic["entropy"] > 6.5:

        evidence.append(
            "High image information entropy observed"
        )

    if forensic_score >= 65:

        evidence.append(
            "Multiple independent forensic signals support synthetic-media suspicion"
        )

    elif forensic_score >= 45:

        evidence.append(
            "Forensic signals are mixed and require additional evidence"
        )

    else:

        evidence.append(
            "Forensic signals do not strongly indicate synthetic media"
        )

    # -----------------------------------------------------
    # RETURN
    # -----------------------------------------------------

    return {

        # Final TRUVENA score
        "ai_probability": round(
            fused_score
        ),

        "real_probability": round(
            100 - fused_score
        ),

        "classification": classification,

        "evidence_level": evidence_level,

        "model": MODEL_ID,

        "classifier_ai_probability": round(
            classifier_ai * 100
        ) / 100,

        "forensic_score": round(
            forensic_score,
            2
        ),

        "forensic_signals": forensic,

        "evidence": evidence,

        "raw_predictions": predictions
    }