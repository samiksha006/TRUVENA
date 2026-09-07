import io
import uuid
import time

from datetime import datetime
from typing import Dict, Any, Optional

from PIL import Image

from core.media_dna import (
    extract_media_dna_signals,
    check_provenance_and_watermarks
)

from core.generator_registry import (
    get_known_generators,
    calculate_dna_match_score
)

from core.sample_data import get_sample_by_id
from core.ai_detector import detect_ai_image


# =========================================================
# IN-MEMORY STORAGE
# =========================================================

ANALYSIS_STORE: Dict[str, Dict[str, Any]] = {}

UNKNOWN_CLUSTERS: Dict[str, Dict[str, Any]] = {}

EMERGING_WATCHLIST: Dict[str, Dict[str, Any]] = {}

UNKNOWN_CLUSTER_THRESHOLD = 92.0


# =========================================================
# UNKNOWN CLUSTER ENGINE
# =========================================================

def find_or_create_unknown_cluster(
    dna_vector: Dict[str, float]
):
    """
    Compare a Media DNA fingerprint against previously
    observed unknown patterns.

    If similarity >= UNKNOWN_CLUSTER_THRESHOLD,
    the specimen joins the existing cluster.

    Otherwise, a new U-XXX cluster is created.
    """

    best_cluster_id = None
    best_score = 0.0

    # -----------------------------------------------------
    # Compare against existing unknown clusters
    # -----------------------------------------------------

    for cluster_id, cluster in UNKNOWN_CLUSTERS.items():

        score = calculate_dna_match_score(
            dna_vector,
            cluster["representative_dna"]
        )

        if score > best_score:

            best_score = score
            best_cluster_id = cluster_id

    # -----------------------------------------------------
    # Existing unknown pattern
    # -----------------------------------------------------

    if (
        best_cluster_id
        and best_score >= UNKNOWN_CLUSTER_THRESHOLD
    ):

        cluster = UNKNOWN_CLUSTERS[best_cluster_id]

        cluster["samples"] += 1

        previous_consistency = (
            cluster["pattern_consistency"]
        )

        cluster["pattern_consistency"] = round(
            (
                previous_consistency
                + best_score
            ) / 2,
            1
        )

        cluster["last_updated"] = (
            datetime.utcnow().strftime(
                "%Y-%m-%d %H:%M:%S UTC"
            )
        )

        # -------------------------------------------------
        # Dynamic cluster status
        # -------------------------------------------------

        if cluster["samples"] >= 3:

            cluster["status"] = (
                "EMERGING_GENERATOR"
            )

        elif cluster["samples"] >= 2:

            cluster["status"] = (
                "RECURRING_UNKNOWN_PATTERN"
            )

        else:

            cluster["status"] = (
                "NEW_UNKNOWN_PATTERN"
            )

        return (
            best_cluster_id,
            cluster["samples"],
            cluster["pattern_consistency"],
            False
        )

    # -----------------------------------------------------
    # Create a new unknown pattern
    # -----------------------------------------------------

    cluster_number = (
        len(UNKNOWN_CLUSTERS) + 1
    )

    cluster_id = (
        f"U-{cluster_number:03d}"
    )

    current_time = (
        datetime.utcnow().strftime(
            "%Y-%m-%d %H:%M:%S UTC"
        )
    )

    UNKNOWN_CLUSTERS[cluster_id] = {

        "representative_dna":
            dna_vector.copy(),

        "samples":
            1,

        "pattern_consistency":
            100.0,

        "status":
            "NEW_UNKNOWN_PATTERN",

        "created_at":
            current_time,

        "last_updated":
            current_time
    }

    return (
        cluster_id,
        1,
        100.0,
        True
    )


# =========================================================
# EMERGING GENERATOR WATCHLIST
# =========================================================

def update_emerging_watchlist(
    cluster_id: str,
    samples: int,
    consistency: float,
    dna_vector: Dict[str, float]
):
    """
    Add a recurring unknown pattern to the emerging
    generator watchlist once it reaches:

        samples >= 3
        consistency >= 90
    """

    if (
        samples < 3
        or consistency < 90
    ):
        return None

    if cluster_id not in EMERGING_WATCHLIST:

        EMERGING_WATCHLIST[cluster_id] = {

            "cluster_id":
                cluster_id,

            "samples_observed":
                samples,

            "pattern_consistency":
                consistency,

            "status":
                "EMERGING_GENERATOR",

            "representative_dna":
                dna_vector.copy()
        }

    else:

        watchlist_entry = (
            EMERGING_WATCHLIST[cluster_id]
        )

        watchlist_entry[
            "samples_observed"
        ] = samples

        watchlist_entry[
            "pattern_consistency"
        ] = consistency

        watchlist_entry[
            "status"
        ] = "EMERGING_GENERATOR"

    return (
        EMERGING_WATCHLIST[cluster_id]
    )


# =========================================================
# MAIN ANALYSIS ENGINE
# =========================================================

def analyze_media(
    image_bytes: bytes,
    filename: str = "uploaded_media.png",
    sample_id: Optional[str] = None
) -> Dict[str, Any]:

    # =====================================================
    # ANALYSIS ID
    # =====================================================

    analysis_id = (
        f"TRV-{int(time.time()) % 1000000:06d}-"
        f"{uuid.uuid4().hex[:4].upper()}"
    )

    timestamp = (
        datetime.utcnow()
        .strftime("%Y-%m-%d %H:%M:%S UTC")
    )

    # =====================================================
    # DEFAULT CLUSTER VALUES
    # =====================================================

    cluster_id = None

    cluster_samples = 0

    pattern_consistency = None

    emerging_entry = None

    # =====================================================
    # 1. LOAD IMAGE
    # =====================================================

    try:

        pil_img = Image.open(
            io.BytesIO(image_bytes)
        )

        pil_img.load()

    except Exception as exc:

        raise ValueError(
            f"Invalid or unsupported image file: {exc}"
        )

    # =====================================================
    # 2. EXTRACT FORENSIC SIGNALS
    # =====================================================

    dna_signals = extract_media_dna_signals(
        pil_img,
        image_bytes
    )

    provenance = (
        check_provenance_and_watermarks(
            image_bytes,
            pil_img
        )
    )

    # =====================================================
    # 3. LOAD CURATED DEMO SAMPLE
    # =====================================================

    sample_case = (
        get_sample_by_id(sample_id)
        if sample_id
        else None
    )

    # =====================================================
    # 4. CURATED DEMO SAMPLE
    # =====================================================

    if sample_case:

        # -------------------------------------------------
        # Base curated report
        # -------------------------------------------------

        classification = sample_case.get(
            "classification",
            "Uncertain"
        )

        ai_probability = float(
            sample_case.get(
                "ai_probability",
                50
            )
        )

        real_probability = float(
            sample_case.get(
                "real_probability",
                max(
                    0,
                    100 - ai_probability
                )
            )
        )

        classifier_ai_probability = float(
            sample_case.get(
                "classifier_ai_probability",
                ai_probability
            )
        )

        forensic_score = float(
            sample_case.get(
                "forensic_score",
                0
            )
        )

        evidence_level = sample_case.get(
            "evidence_level",
            "MEDIUM"
        )

        report = {

            "analysis_id":
                analysis_id,

            "timestamp":
                timestamp,

            "filename":
                sample_case.get(
                    "filename",
                    sample_case.get(
                        "name",
                        "Unknown Sample"
                    )
                ),

            "title":
                sample_case.get(
                    "title",
                    sample_case.get(
                        "name",
                        "TRUVENA Forensic Analysis"
                    )
                ),

            "classification":
                classification,

            "ai_probability":
                ai_probability,

            "real_probability":
                real_probability,

            "classifier_ai_probability":
                classifier_ai_probability,

            "forensic_score":
                forensic_score,

            "evidence_level":
                evidence_level,

            "likely_generator":
                sample_case.get(
                    "likely_generator",
                    "UNKNOWN"
                ),

            "generator_confidence":
                sample_case.get(
                    "generator_confidence",
                    0
                ),

            "c2pa_provenance":
                sample_case.get(
                    "c2pa_provenance",
                    "Not Found"
                ),

            "watermark":
                sample_case.get(
                    "watermark",
                    "Not Detected"
                ),

            "media_dna_match":
                sample_case.get(
                    "media_dna_match",
                    0
                ),

            "risk_level":
                sample_case.get(
                    "risk_level",
                    "MEDIUM"
                ),

            "trust_score":
                sample_case.get(
                    "trust_score",
                    50
                ),

            "dna_hash":
                sample_case.get(
                    "dna_hash",
                    f"DNA-{analysis_id[:8]}"
                ),

            "dna_vector":
                sample_case.get(
                    "dna_vector",
                    {}
                ),

            "evidence":
                sample_case.get(
                    "evidence",
                    []
                ),

            "explanation":
                sample_case.get(
                    "explanation",
                    "TRUVENA completed the forensic analysis."
                ),

            "details":
                sample_case.get(
                    "details",
                    {}
                ),

            "visualizations":
                dna_signals["visualizations"],

            "signal_metrics":
                dna_signals["signal_metrics"],

            "dimensions":
                dna_signals["dimensions"],

            "sha256":
                dna_signals["sha256"]
        }

        # =================================================
        # UNKNOWN GENERATOR CURATED CASE
        # =================================================

        if (
            sample_case.get(
                "likely_generator"
            ) == "UNKNOWN"
        ):

            # ---------------------------------------------
            # Registry information
            # ---------------------------------------------

            known_generator_match = int(
                sample_case.get(
                    "known_generator_match",
                    0
                )
            )

            media_dna_novelty = int(
                sample_case.get(
                    "media_dna_novelty",
                    max(
                        0,
                        100 - known_generator_match
                    )
                )
            )

            # ---------------------------------------------
            # Dynamic unknown Media DNA
            # ---------------------------------------------

            unknown_dna = (
                sample_case.get(
                    "dna_vector",
                    {}
                ).copy()
            )

            # ---------------------------------------------
            # Find / create cluster
            # ---------------------------------------------

            (
                cluster_id,
                cluster_samples,
                pattern_consistency,
                is_new_cluster
            ) = find_or_create_unknown_cluster(
                unknown_dna
            )

            # ---------------------------------------------
            # Emerging watchlist
            # ---------------------------------------------

            emerging_entry = (
                update_emerging_watchlist(
                    cluster_id,
                    cluster_samples,
                    pattern_consistency,
                    unknown_dna
                )
            )

            # ---------------------------------------------
            # Dynamic report values
            # ---------------------------------------------

            report["likely_generator"] = "UNKNOWN"

            report["generator_confidence"] = 0

            report["known_generator_match"] = (
                known_generator_match
            )

            report["media_dna_novelty"] = (
                media_dna_novelty
            )

            report["cluster"] = cluster_id

            report["samples_in_cluster"] = (
                cluster_samples
            )

            report["pattern_consistency"] = (
                pattern_consistency
            )

            # ---------------------------------------------
            # Dynamic status
            # ---------------------------------------------

            if emerging_entry:

                report["status"] = (
                    "EMERGING GENERATOR"
                )

            elif cluster_samples >= 2:

                report["status"] = (
                    "RECURRING UNKNOWN PATTERN"
                )

            else:

                report["status"] = (
                    "UNREGISTERED FORENSIC PATTERN"
                )

            # ---------------------------------------------
            # Dynamic evidence
            # ---------------------------------------------

            report["evidence"] = [

                "Strong synthetic-media signal "
                "identified in the curated benchmark",

                (
                    f"Known-generator registry similarity: "
                    f"{known_generator_match}%"
                ),

                (
                    f"Media DNA novelty: "
                    f"{media_dna_novelty}%"
                ),

                (
                    f"Unknown pattern cluster: "
                    f"{cluster_id}"
                ),

                (
                    f"Cluster samples observed: "
                    f"{cluster_samples}"
                ),

                (
                    f"Pattern consistency: "
                    f"{pattern_consistency:.1f}%"
                )
            ]

            # ---------------------------------------------
            # Dynamic explanation
            # ---------------------------------------------

            if emerging_entry:

                report["explanation"] = (

                    f"TRUVENA identified a recurring "
                    f"unregistered Media DNA pattern "
                    f"within cluster {cluster_id}. "

                    f"The cluster now contains "
                    f"{cluster_samples} observations "
                    f"with {pattern_consistency:.1f}% "
                    f"pattern consistency. "

                    f"The repeated pattern has reached "
                    f"the emerging-generator watchlist."
                )

            elif cluster_samples >= 2:

                report["explanation"] = (

                    f"TRUVENA identified an unregistered "
                    f"Media DNA pattern in cluster "
                    f"{cluster_id}. "

                    f"The pattern has now been observed "
                    f"{cluster_samples} times with "
                    f"{pattern_consistency:.1f}% "
                    f"consistency. "

                    f"Additional matching observations "
                    f"are being monitored for emerging "
                    f"generator behavior."
                )

            else:

                report["explanation"] = (

                    f"TRUVENA identified a synthetic-media "
                    f"specimen that does not sufficiently "
                    f"match the current known-generator "
                    f"registry. "

                    f"The specimen created a new unknown "
                    f"Media DNA cluster, {cluster_id}. "

                    f"Further matching observations are "
                    f"required before the pattern can be "
                    f"treated as recurring or emerging."
                )

        # =================================================
        # FINAL VERDICT — CURATED SAMPLE
        # =================================================

        if classification == "AI Generated":

            final_verdict = "AI GENERATED"

            final_confidence = int(
                round(
                    classifier_ai_probability
                    if classifier_ai_probability is not None
                    else ai_probability
                )
            )

            verdict_basis = (
                "Strong classifier and forensic evidence "
                "support AI-generated media."
            )

        elif classification == "Uncertain":

            final_verdict = (
                "UNCERTAIN / POTENTIAL SYNTHETIC"
            )

            final_confidence = int(
                round(
                    classifier_ai_probability
                    if classifier_ai_probability is not None
                    else ai_probability
                )
            )

            verdict_basis = (
                "Synthetic-media indicators were detected, "
                "but the evidence is insufficient for a "
                "definitive AI-generated verdict."
            )

        elif classification in [
            "Authentic / Real Media",
            "Authentic / Likely Real",
            "Likely Real",
            "Authentic",
            "Real"
        ]:

            final_verdict = (
                "REAL / LIKELY REAL"
            )

            final_confidence = int(
                round(
                    real_probability
                )
            )

            verdict_basis = (
                "Available classifier, forensic, and "
                "registry signals support a real / "
                "likely real assessment."
            )

        else:

            final_verdict = (
                "UNCERTAIN / POTENTIAL SYNTHETIC"
            )

            final_confidence = int(
                round(
                    classifier_ai_probability
                )
            )

            verdict_basis = (
                "The evidence does not support a "
                "definitive binary verdict."
            )

        # =================================================
        # FINAL RISK / TRUST
        # =================================================

        if final_verdict == "AI GENERATED":

            report["risk_level"] = "HIGH"

            report["trust_score"] = max(
                5,
                100 - final_confidence
            )

        elif (
            final_verdict
            == "UNCERTAIN / POTENTIAL SYNTHETIC"
        ):

            report["risk_level"] = "MEDIUM"

            report["trust_score"] = max(
                25,
                100 - final_confidence
            )

        else:

            report["risk_level"] = "LOW"

            report["trust_score"] = max(
                50,
                final_confidence
            )

        report["final_verdict"] = final_verdict

        report["final_confidence"] = (
            final_confidence
        )

        report["verdict_basis"] = (
            verdict_basis
        )

        # -------------------------------------------------
        # Store curated result
        # -------------------------------------------------

        ANALYSIS_STORE[
            analysis_id
        ] = report

        return report

    # =====================================================
    # 5. CUSTOM UPLOAD
    # =====================================================

    metrics = (
        dna_signals["signal_metrics"]
    )

    high_freq = float(
        metrics.get(
            "high_freq_ratio",
            0
        )
    )

    noise_var = float(
        metrics.get(
            "noise_variance",
            0
        )
    )

    texture_disp = float(
        metrics.get(
            "texture_dispersion",
            0
        )
    )

    # =====================================================
    # 6. AI DETECTOR
    # =====================================================

    detector_result = detect_ai_image(
        pil_img
    )

    ai_prob = int(
        detector_result.get(
            "ai_probability",
            0
        )
    )

    real_prob = int(
        detector_result.get(
            "real_probability",
            max(
                0,
                100 - ai_prob
            )
        )
    )

    classification = detector_result.get(
        "classification",
        "Uncertain"
    )

    detector_model = detector_result.get(
        "model",
        "Unknown"
    )

    classifier_ai_probability = float(
        detector_result.get(
            "classifier_ai_probability",
            ai_prob
        )
    )

    forensic_score = float(
        detector_result.get(
            "forensic_score",
            0
        )
    )

    evidence_level = detector_result.get(
        "evidence_level",
        "MEDIUM"
    )

    detector_evidence = detector_result.get(
        "evidence",
        []
    )

    forensic_signals = detector_result.get(
        "forensic_signals",
        {}
    )

    # =====================================================
    # 7. BUILD MEDIA DNA
    # =====================================================

    frequency_score = max(
        1,
        min(
            98,
            int(
                high_freq * 100
            )
        )
    )

    noise_score = max(
        1,
        min(
            98,
            int(
                noise_var * 100
            )
        )
    )

    texture_score = max(
        1,
        min(
            98,
            int(
                texture_disp * 100
            )
        )
    )

    compression_score = max(
        1,
        min(
            98,
            int(
                (
                    high_freq
                    + noise_var
                ) * 50
            )
        )
    )

    semantic_score = max(
        1,
        min(
            98,
            int(
                texture_disp * 100
            )
        )
    )

    artifact_score = max(
        1,
        min(
            98,
            int(
                high_freq * 100
            )
        )
    )

    # -----------------------------------------------------
    # Generator fingerprint is NOT fabricated.
    # -----------------------------------------------------

    generator_fingerprint = 0

    query_dna = {

        "frequency_pattern":
            frequency_score,

        "noise_residual":
            noise_score,

        "texture_signature":
            texture_score,

        "compression_signature":
            compression_score,

        "semantic_feature":
            semantic_score,

        "generator_fingerprint":
            generator_fingerprint,

        "artifact_distribution":
            artifact_score
    }

    # =====================================================
    # DEFAULT REPORT VALUES
    # =====================================================

    likely_generator = "UNKNOWN"

    gen_confidence = 0

    dna_match = 0

    dna_hash = (
        f"DNA-{analysis_id[-6:]}"
    )

    dna_vec = query_dna.copy()

    risk = "MEDIUM"

    trust = 50

    evidence = []

    explanation = ""

    # =====================================================
    # 8. AUTHENTIC / LIKELY REAL
    # =====================================================

    if classification in [
        "Authentic / Likely Real",
        "Authentic / Real Media",
        "Likely Real",
        "Authentic",
        "Real"
    ]:

        likely_generator = (
            "None (Likely Physical Media)"
        )

        gen_confidence = 0

        dna_match = 0

        risk = "LOW"

        trust = real_prob

        dna_hash = (
            f"DNA-REAL-{analysis_id[-6:]}"
        )

        evidence = [

            (
                f"AI classifier signal: "
                f"{classifier_ai_probability:.1f}%"
            ),

            (
                f"Forensic signal score: "
                f"{forensic_score:.1f}%"
            ),

            (
                f"Evidence level: "
                f"{evidence_level}"
            ),

            (
                f"AI-generated probability: "
                f"{ai_prob}%"
            ),

            "No strong synthetic-media "
            "classification detected",

            "Forensic Media DNA signals "
            "extracted from the uploaded image"
        ]

        explanation = (

            f"The uploaded image is classified "
            f"as likely real with "
            f"{real_prob}% confidence. "

            f"No strong evidence of AI generation "
            f"was detected by the image classifier."
        )

    # =====================================================
    # 9. UNCERTAIN + STRONG AI SIGNAL
    # =====================================================

    elif (
        classification == "Uncertain"
        and classifier_ai_probability >= 80
    ):

        risk = "MEDIUM"

        trust = max(
            10,
            int(
                100 - ai_prob
            )
        )

        dna_hash = (
            f"DNA-INV-{analysis_id[-6:]}"
        )

        # -------------------------------------------------
        # Compare against known generators
        # -------------------------------------------------

        known_gens = (
            get_known_generators()
        )

        best_match_gen = None

        best_match_score = 0.0

        for generator in known_gens:

            score = (
                calculate_dna_match_score(
                    query_dna,
                    generator[
                        "dna_fingerprint"
                    ]
                )
            )

            if score > best_match_score:

                best_match_score = score

                best_match_gen = generator

        dna_match = int(
            round(
                best_match_score
            )
        )

        dna_vec = query_dna.copy()

        # -------------------------------------------------
        # Strong known-generator match
        # -------------------------------------------------

        if (
            best_match_gen
            and best_match_score >= 88
        ):

            likely_generator = (
                best_match_gen["name"]
            )

            gen_confidence = min(
                99,
                int(
                    best_match_gen[
                        "baseline_confidence"
                    ]
                    +
                    (
                        best_match_score
                        - 88
                    ) * 0.4
                )
            )

            evidence = [

                (
                    f"TRUVENA fused "
                    f"synthetic-media score: "
                    f"{ai_prob}%"
                ),

                (
                    f"AI classifier signal: "
                    f"{classifier_ai_probability:.1f}%"
                ),

                (
                    f"Forensic signal score: "
                    f"{forensic_score:.1f}%"
                ),

                (
                    f"Evidence level: "
                    f"{evidence_level}"
                ),

                (
                    f"Media DNA registry similarity: "
                    f"{best_match_score:.1f}%"
                ),

                (
                    f"Candidate generator: "
                    f"{best_match_gen['name']}"
                ),

                (
                    "Forensic artifact pattern is "
                    "consistent with a registered "
                    "generator signature"
                )
            ]

            explanation = (

                f"The image produced a strong AI "
                f"classifier signal of "
                f"{classifier_ai_probability:.1f}%, "
                f"but the combined forensic score "
                f"remains below the definitive "
                f"AI threshold. "

                f"TRUVENA therefore escalated "
                f"the specimen for forensic "
                f"investigation. "

                f"Its Media DNA shows "
                f"{best_match_score:.1f}% similarity "
                f"to {best_match_gen['name']}. "

                f"This is an evidence-based "
                f"candidate attribution, not "
                f"definitive proof."
            )

        # -------------------------------------------------
        # No strong known-generator match
        # -------------------------------------------------

        else:

            likely_generator = "UNKNOWN"

            gen_confidence = 0

            novelty = max(
                0,
                min(
                    100,
                    100 - dna_match
                )
            )

            # ---------------------------------------------
            # UNKNOWN CLUSTERING
            # ---------------------------------------------

            (
                cluster_id,
                cluster_samples,
                pattern_consistency,
                is_new_cluster
            ) = find_or_create_unknown_cluster(
                dna_vec
            )

            # ---------------------------------------------
            # EMERGING WATCHLIST
            # ---------------------------------------------

            emerging_entry = (
                update_emerging_watchlist(
                    cluster_id,
                    cluster_samples,
                    pattern_consistency,
                    dna_vec
                )
            )

            evidence = [

                (
                    f"TRUVENA fused "
                    f"synthetic-media score: "
                    f"{ai_prob}%"
                ),

                (
                    f"AI classifier signal: "
                    f"{classifier_ai_probability:.1f}%"
                ),

                (
                    f"Forensic signal score: "
                    f"{forensic_score:.1f}%"
                ),

                (
                    f"Evidence level: "
                    f"{evidence_level}"
                ),

                (
                    f"Maximum known-generator "
                    f"similarity: "
                    f"{best_match_score:.1f}%"
                ),

                (
                    f"Media DNA novelty score: "
                    f"{novelty}%"
                ),

                (
                    f"Unknown pattern cluster: "
                    f"{cluster_id}"
                ),

                (
                    f"Cluster samples: "
                    f"{cluster_samples}"
                ),

                (
                    f"Pattern consistency: "
                    f"{pattern_consistency:.1f}%"
                ),

                (
                    "No sufficiently strong match "
                    "was found in the current "
                    "generator registry"
                ),

                (
                    "Forensic pattern classified "
                    "as UNREGISTERED"
                )
            ]

            explanation = (

                f"The image produced a strong AI "
                f"classifier signal of "
                f"{classifier_ai_probability:.1f}%, "
                f"but its forensic fingerprint "
                f"does not strongly match any "
                f"currently registered generator. "

                f"TRUVENA assigned the specimen "
                f"to unknown pattern cluster "
                f"{cluster_id}. "

                f"The cluster currently contains "
                f"{cluster_samples} sample(s) "
                f"with {pattern_consistency:.1f}% "
                f"pattern consistency."
            )

    # =====================================================
    # 10. NORMAL UNCERTAIN
    # =====================================================

    elif classification == "Uncertain":

        likely_generator = "UNKNOWN"

        gen_confidence = 0

        dna_match = 0

        risk = "MEDIUM"

        trust = 50

        dna_hash = (
            f"DNA-UNC-{analysis_id[-6:]}"
        )

        dna_vec = query_dna.copy()

        evidence = [

            (
                f"TRUVENA fused "
                f"synthetic-media score: "
                f"{ai_prob}%"
            ),

            (
                f"AI classifier signal: "
                f"{classifier_ai_probability:.1f}%"
            ),

            (
                f"Forensic signal score: "
                f"{forensic_score:.1f}%"
            ),

            (
                f"Evidence level: "
                f"{evidence_level}"
            ),

            (
                "Classifier and forensic evidence "
                "did not reach the escalation "
                "threshold"
            ),

            (
                "No definitive AI-generated or "
                "authentic classification established"
            ),

            (
                "Media DNA extracted but attribution "
                "was not performed"
            )
        ]

        explanation = (

            f"The image remains uncertain. "

            f"The AI classifier produced an "
            f"AI signal of "
            f"{classifier_ai_probability:.1f}%, "

            f"while the fused synthetic-media "
            f"score was {ai_prob}%. "

            f"These signals did not provide "
            f"sufficient evidence for definitive "
            f"classification or generator attribution."
        )

    # =====================================================
    # 11. AI GENERATED
    # =====================================================

    else:

        risk = "HIGH"

        trust = max(
            5,
            100 - ai_prob
        )

        dna_hash = (
            f"DNA-{analysis_id[-6:]}"
        )

        # -------------------------------------------------
        # Compare Media DNA against known generators
        # -------------------------------------------------

        known_gens = (
            get_known_generators()
        )

        best_match_gen = None

        best_match_score = 0.0

        for generator in known_gens:

            score = (
                calculate_dna_match_score(
                    query_dna,
                    generator[
                        "dna_fingerprint"
                    ]
                )
            )

            if score > best_match_score:

                best_match_score = score

                best_match_gen = generator

        dna_match = int(
            round(
                best_match_score
            )
        )

        dna_vec = query_dna.copy()

        # -------------------------------------------------
        # Strong registry similarity
        # -------------------------------------------------

        if (
            best_match_gen
            and best_match_score >= 88
        ):

            likely_generator = (
                best_match_gen["name"]
            )

            gen_confidence = min(
                99,
                int(
                    best_match_gen[
                        "baseline_confidence"
                    ]
                    +
                    (
                        best_match_score
                        - 88
                    ) * 0.4
                )
            )

            evidence = [

                (
                    f"TRUVENA fused "
                    f"synthetic-media score: "
                    f"{ai_prob}%"
                ),

                (
                    f"AI classifier signal: "
                    f"{classifier_ai_probability:.1f}%"
                ),

                (
                    f"Forensic signal score: "
                    f"{forensic_score:.1f}%"
                ),

                (
                    f"Evidence level: "
                    f"{evidence_level}"
                ),

                (
                    f"Media DNA registry similarity: "
                    f"{best_match_score:.1f}%"
                ),

                (
                    f"Candidate generator: "
                    f"{best_match_gen['name']}"
                ),

                (
                    "Forensic artifact pattern is "
                    "consistent with a registered "
                    "generator signature"
                )
            ]

            explanation = (

                f"The image is classified as "
                f"AI-generated with "
                f"{ai_prob}% confidence. "

                f"Its Media DNA shows "
                f"{best_match_score:.1f}% similarity "
                f"to {best_match_gen['name']}. "

                f"This is an evidence-based "
                f"candidate attribution, not "
                f"definitive proof of the exact generator."
            )

        # -------------------------------------------------
        # AI detected but unknown generator
        # -------------------------------------------------

        else:

            likely_generator = "UNKNOWN"

            gen_confidence = 0

            novelty = max(
                0,
                min(
                    100,
                    100 - dna_match
                )
            )

            # ---------------------------------------------
            # UNKNOWN CLUSTERING
            # ---------------------------------------------

            (
                cluster_id,
                cluster_samples,
                pattern_consistency,
                is_new_cluster
            ) = find_or_create_unknown_cluster(
                dna_vec
            )

            # ---------------------------------------------
            # EMERGING WATCHLIST
            # ---------------------------------------------

            emerging_entry = (
                update_emerging_watchlist(
                    cluster_id,
                    cluster_samples,
                    pattern_consistency,
                    dna_vec
                )
            )

            evidence = [

                (
                    f"TRUVENA fused "
                    f"synthetic-media score: "
                    f"{ai_prob}%"
                ),

                (
                    f"AI classifier signal: "
                    f"{classifier_ai_probability:.1f}%"
                ),

                (
                    f"Forensic signal score: "
                    f"{forensic_score:.1f}%"
                ),

                (
                    f"Evidence level: "
                    f"{evidence_level}"
                ),

                (
                    f"Maximum known-generator "
                    f"similarity: "
                    f"{best_match_score:.1f}%"
                ),

                (
                    f"Media DNA novelty score: "
                    f"{novelty}%"
                ),

                (
                    f"Unknown pattern cluster: "
                    f"{cluster_id}"
                ),

                (
                    f"Cluster samples: "
                    f"{cluster_samples}"
                ),

                (
                    f"Pattern consistency: "
                    f"{pattern_consistency:.1f}%"
                ),

                (
                    "No sufficiently strong match "
                    "was found in the current "
                    "generator registry"
                ),

                (
                    "Forensic pattern classified "
                    "as UNREGISTERED"
                )
            ]

            explanation = (

                f"The image is classified as "
                f"AI-generated with "
                f"{ai_prob}% confidence, but "
                f"its forensic fingerprint does "
                f"not strongly match any currently "
                f"registered generator. "

                f"TRUVENA assigned the specimen "
                f"to unknown pattern cluster "
                f"{cluster_id}, which currently "
                f"contains {cluster_samples} "
                f"sample(s) with "
                f"{pattern_consistency:.1f}% "
                f"pattern consistency. "

                f"Repeated observations are required "
                f"before the pattern can be treated "
                f"as evidence of an emerging generator."
            )

    # =====================================================
    # 12. BUILD FINAL CUSTOM REPORT
    # =====================================================

    report = {

        "analysis_id":
            analysis_id,

        "timestamp":
            timestamp,

        "filename":
            filename,

        "title":
            f"Forensic Dossier: {filename}",

        "classification":
            classification,

        "ai_probability":
            ai_prob,

        "real_probability":
            real_prob,

        "detector_model":
            detector_model,

        "classifier_ai_probability":
            classifier_ai_probability,

        "forensic_score":
            forensic_score,

        "evidence_level":
            evidence_level,

        "forensic_signals":
            forensic_signals,

        "detector_evidence":
            detector_evidence,

        "likely_generator":
            likely_generator,

        "generator_confidence":
            gen_confidence,

        "c2pa_provenance":
            provenance.get(
                "c2pa_status",
                "Not Found"
            ),

        "watermark":
            provenance.get(
                "watermark_status",
                "Not Detected"
            ),

        "media_dna_match":
            dna_match,

        "risk_level":
            risk,

        "trust_score":
            trust,

        "dna_hash":
            dna_hash,

        "dna_vector":
            dna_vec,

        "evidence":
            evidence,

        "explanation":
            explanation,

        "details": {

            "resolution":
                (
                    f"{dna_signals['dimensions']['width']} "
                    f"x "
                    f"{dna_signals['dimensions']['height']}"
                ),

            "file_size":
                (
                    f"{len(image_bytes) / 1024:.1f} KB"
                ),

            "mime_type":
                (
                    "image/"
                    f"{dna_signals['dimensions']['format'].lower()}"
                ),

            "camera_metadata":
                provenance.get(
                    "camera_metadata"
                ),

            "software_signature":
                provenance.get(
                    "software_signature"
                )
        },

        "visualizations":
            dna_signals["visualizations"],

        "signal_metrics":
            dna_signals["signal_metrics"],

        "dimensions":
            dna_signals["dimensions"],

        "sha256":
            dna_signals["sha256"]
    }

    # =====================================================
    # 13. UNKNOWN GENERATOR INFORMATION
    # =====================================================

    if (
        likely_generator == "UNKNOWN"
        and cluster_id is not None
    ):

        report["known_generator_match"] = (
            dna_match
        )

        report["media_dna_novelty"] = max(
            0,
            min(
                100,
                100 - dna_match
            )
        )

        report["cluster"] = cluster_id

        report["samples_in_cluster"] = (
            cluster_samples
        )

        report["pattern_consistency"] = (
            pattern_consistency
        )

        # -------------------------------------------------
        # Emerging
        # -------------------------------------------------

        if emerging_entry:

            report["status"] = (
                "EMERGING GENERATOR"
            )

        # -------------------------------------------------
        # Recurring
        # -------------------------------------------------

        elif cluster_samples >= 2:

            report["status"] = (
                "RECURRING UNKNOWN PATTERN"
            )

        # -------------------------------------------------
        # First observation
        # -------------------------------------------------

        else:

            report["status"] = (
                "UNREGISTERED FORENSIC PATTERN"
            )

    # =====================================================
    # 14. NORMAL UNCERTAIN STATUS
    # =====================================================

    elif (
        classification == "Uncertain"
        and cluster_id is None
    ):

        report["status"] = (
            "UNCERTAIN - NOT ESCALATED"
        )

    # =====================================================
    # 15. FINAL TRUVENA VERDICT
    # =====================================================

    if classification == "AI Generated":

        final_verdict = "AI GENERATED"

        final_confidence = int(
            round(
                classifier_ai_probability
            )
        )

        verdict_basis = (
            "Strong classifier and forensic evidence "
            "support AI-generated media."
        )

    elif classification == "Uncertain":

        # -------------------------------------------------
        # IMPORTANT:
        # Uncertain must NOT become REAL merely because
        # it failed the AI threshold.
        # -------------------------------------------------

        final_verdict = (
            "UNCERTAIN / POTENTIAL SYNTHETIC"
        )

        final_confidence = int(
            round(
                classifier_ai_probability
            )
        )

        verdict_basis = (
            "Synthetic-media indicators were detected, "
            "but the available evidence is insufficient "
            "for a definitive AI-generated verdict."
        )

    elif classification in [
        "Authentic / Real Media",
        "Authentic / Likely Real",
        "Likely Real",
        "Authentic",
        "Real"
    ]:

        final_verdict = (
            "REAL / LIKELY REAL"
        )

        final_confidence = int(
            round(
                real_prob
            )
        )

        verdict_basis = (
            "Available classifier, forensic, and "
            "registry signals support a real / "
            "likely real assessment."
        )

    else:

        final_verdict = (
            "UNCERTAIN / POTENTIAL SYNTHETIC"
        )

        final_confidence = int(
            round(
                classifier_ai_probability
            )
        )

        verdict_basis = (
            "The available evidence does not support "
            "a definitive binary verdict."
        )

    # =====================================================
    # STORE FINAL VERDICT
    # =====================================================

    report["final_verdict"] = (
        final_verdict
    )

    report["final_confidence"] = (
        final_confidence
    )

    report["verdict_basis"] = (
        verdict_basis
    )

    # =====================================================
    # 16. FINAL DISPLAY RISK / TRUST
    # =====================================================

    if (
        final_verdict
        == "AI GENERATED"
    ):

        report["risk_level"] = "HIGH"

        report["trust_score"] = max(
            5,
            100 - final_confidence
        )

    elif (
        final_verdict
        == "UNCERTAIN / POTENTIAL SYNTHETIC"
    ):

        report["risk_level"] = "MEDIUM"

        report["trust_score"] = max(
            25,
            min(
                60,
                100 - final_confidence
            )
        )

    else:

        report["risk_level"] = "LOW"

        report["trust_score"] = max(
            50,
            final_confidence
        )

    # =====================================================
    # 17. STORE RESULT
    # =====================================================

    ANALYSIS_STORE[
        analysis_id
    ] = report

    return report


# =========================================================
# GET ANALYSIS BY ID
# =========================================================

def get_analysis_by_id(
    analysis_id: str
) -> Optional[Dict[str, Any]]:

    return ANALYSIS_STORE.get(
        analysis_id
    )