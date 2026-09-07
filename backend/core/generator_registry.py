from typing import Dict, List, Optional
import numpy as np

KNOWN_GENERATORS = [
    {
        "id": "flux-1",
        "name": "FLUX.1",
        "vendor": "Black Forest Labs",
        "architecture": "Flow Matching Latent Diffusion (12B Params)",
        "release_year": 2024,
        "baseline_confidence": 82,
        "media_dna_match": 87,
        "analyzed_samples": 42180,
        "last_detected": "12 mins ago",
        "status": "ACTIVE_TRACKING",
        "dna_fingerprint": {
            "frequency_pattern": 88,
            "noise_residual": 85,
            "texture_signature": 84,
            "compression_signature": 76,
            "semantic_feature": 80,
            "generator_fingerprint": 87,
            "artifact_distribution": 91
        },
        "distinctive_artifacts": [
            "High-frequency latent flow residual anomaly at 92nd percentile",
            "Characteristic spectral roll-off at 38-44kHz equivalent band",
            "Latent grid boundary smoothing in micro-textures",
            "Synthetic artifact spatial concentration on hair and edge transitions"
        ],
        "sample_image_hint": "Photorealistic portrait with hyper-smooth skin flow gradients"
    },
    {
        "id": "midjourney-v6",
        "name": "Midjourney v6.1",
        "vendor": "Midjourney Inc.",
        "architecture": "Aesthetic Diffusion Upscaler Pipeline",
        "release_year": 2024,
        "baseline_confidence": 88,
        "media_dna_match": 91,
        "analyzed_samples": 58940,
        "last_detected": "4 mins ago",
        "status": "ACTIVE_TRACKING",
        "dna_fingerprint": {
            "frequency_pattern": 91,
            "noise_residual": 82,
            "texture_signature": 93,
            "compression_signature": 79,
            "semantic_feature": 85,
            "generator_fingerprint": 91,
            "artifact_distribution": 88
        },
        "distinctive_artifacts": [
            "Diffusion upscaler micro-noise dispersion",
            "Signature cinematic color gradient saturation profile",
            "Co-occurrence matrix contrast peaks at fine texture edges",
            "Sub-perceptual directional brushstroke residual patterns"
        ],
        "sample_image_hint": "Cinematic atmospheric scene with hyper-detailed surfaces"
    },
    {
        "id": "sdxl-1",
        "name": "Stable Diffusion XL",
        "vendor": "Stability AI",
        "architecture": "Latent Diffusion Model with Ensemble VAE",
        "release_year": 2023,
        "baseline_confidence": 79,
        "media_dna_match": 85,
        "analyzed_samples": 34510,
        "last_detected": "28 mins ago",
        "status": "ACTIVE_TRACKING",
        "dna_fingerprint": {
            "frequency_pattern": 86,
            "noise_residual": 83,
            "texture_signature": 80,
            "compression_signature": 74,
            "semantic_feature": 77,
            "generator_fingerprint": 85,
            "artifact_distribution": 82
        },
        "distinctive_artifacts": [
            "Discrete 8x8 latent VAE tiling boundary lines",
            "High-contrast Fourier cross harmonics at diagonal frequencies",
            "Uncanny boundary blending along fine geometric edges",
            "Gaussian denoising step residue in low-contrast shadow regions"
        ],
        "sample_image_hint": "Stylized digital art with discrete latent patch textures"
    },
    {
        "id": "dalle-3",
        "name": "DALL-E 3",
        "vendor": "OpenAI",
        "architecture": "Autoregressive Captioner with Diffusion Decoder",
        "release_year": 2023,
        "baseline_confidence": 84,
        "media_dna_match": 89,
        "analyzed_samples": 29800,
        "last_detected": "1 hour ago",
        "status": "ACTIVE_TRACKING",
        "dna_fingerprint": {
            "frequency_pattern": 82,
            "noise_residual": 80,
            "texture_signature": 78,
            "compression_signature": 88,
            "semantic_feature": 83,
            "generator_fingerprint": 84,
            "artifact_distribution": 79
        },
        "distinctive_artifacts": [
            "Characteristic glazed finish in high-frequency detail bands",
            "High ELA compression variance between foreground subjects and backdrop",
            "Synthesized boundary contrast sharpening along outlines",
            "Consistent semantic coherence with subtle physical lighting deviations"
        ],
        "sample_image_hint": "Surrealistic concept art with smooth cartoon-realism blend"
    },
    {
        "id": "stylegan-3",
        "name": "StyleGAN3 / GAN Family",
        "vendor": "NVIDIA Research",
        "architecture": "Alias-Free Generative Adversarial Network",
        "release_year": 2021,
        "baseline_confidence": 92,
        "media_dna_match": 94,
        "analyzed_samples": 18450,
        "last_detected": "3 hours ago",
        "status": "ACTIVE_TRACKING",
        "dna_fingerprint": {
            "frequency_pattern": 95,
            "noise_residual": 78,
            "texture_signature": 89,
            "compression_signature": 71,
            "semantic_feature": 74,
            "generator_fingerprint": 92,
            "artifact_distribution": 86
        },
        "distinctive_artifacts": [
            "Prominent rotational harmonic rings in 2D Fourier power spectrum",
            "Symmetric pupil and iris synthesis anomalies under high magnification",
            "Background texture aliasing artifacts with characteristic GAN grid noise",
            "Color channel phase correlation deviations in RGB chromatic channels"
        ],
        "sample_image_hint": "Synthesized facial portrait with rotational Fourier rings"
    }
]

def get_known_generators() -> List[Dict]:
    return KNOWN_GENERATORS

def get_generator_by_id(gen_id: str) -> Optional[Dict]:
    for g in KNOWN_GENERATORS:
        if g["id"] == gen_id:
            return g
    return None

def add_promoted_generator(data: Dict):
    KNOWN_GENERATORS.insert(0, data)

def calculate_dna_match_score(query_dna: Dict, reference_dna: Dict) -> float:
    keys = ["frequency_pattern", "noise_residual", "texture_signature", "compression_signature", "semantic_feature", "generator_fingerprint", "artifact_distribution"]
    q_vec = np.array([query_dna.get(k, 50) for k in keys], dtype=np.float32)
    r_vec = np.array([reference_dna.get(k, 50) for k in keys], dtype=np.float32)
    dot = np.dot(q_vec, r_vec)
    norm_q = np.linalg.norm(q_vec) + 1e-8
    norm_r = np.linalg.norm(r_vec) + 1e-8
    sim = dot / (norm_q * norm_r)
    return float(np.clip(sim * 100.0, 0.0, 100.0))