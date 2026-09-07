from typing import Dict, List, Optional, Any

from core.forensic_engine import UNKNOWN_CLUSTERS
from core.generator_registry import add_promoted_generator


# ============================================================
# UNKNOWN CLUSTER ENGINE
# ============================================================
#
# This module acts as the bridge between:
#
#     forensic_engine.py
#              ↓
#       UNKNOWN_CLUSTERS
#              ↓
#     cluster_engine.py
#              ↓
#        Frontend Watchlist
#
# IMPORTANT:
# - No fake hard-coded clusters
# - No fake sample counts
# - No fake growth percentages
# - Data comes from the live in-memory forensic engine
#
# ============================================================


def _format_cluster(cluster_id: str, cluster: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert the internal forensic-engine cluster format
    into the format expected by the frontend.
    """

    samples = int(cluster.get("samples", 0))

    consistency = float(
        cluster.get("pattern_consistency", 0)
    )

    promoted = bool(
        cluster.get("promoted", False)
    )

    # --------------------------------------------------------
    # Determine status
    # --------------------------------------------------------

    if promoted:
        status = "PROMOTED"

        status_badge = {
            "label": "PROMOTED",
            "class": "promoted"
        }

    elif samples >= 3 and consistency >= 90:
        status = "EMERGING"

        status_badge = {
            "label": "EMERGING",
            "class": "emerging"
        }

    elif samples >= 2:
        status = "RECURRING"

        status_badge = {
            "label": "RECURRING",
            "class": "recurring"
        }

    else:
        status = "NEW"

        status_badge = {
            "label": "NEW",
            "class": "new"
        }

    # --------------------------------------------------------
    # Novelty
    # --------------------------------------------------------
    #
    # Higher consistency means the pattern is becoming
    # more stable/repeatable.
    #
    # This is NOT a scientific probability.
    # It is a UI indicator derived from the cluster state.
    # --------------------------------------------------------

    novelty = max(
        0,
        min(
            100,
            round(100 - consistency, 1)
        )
    )

    # --------------------------------------------------------
    # Risk level
    # --------------------------------------------------------

    if status == "EMERGING":
        risk_level = "HIGH"

    elif status == "RECURRING":
        risk_level = "MEDIUM"

    else:
        risk_level = "MEDIUM"

    # --------------------------------------------------------
    # Human-readable explanation
    # --------------------------------------------------------

    if status == "PROMOTED":

        explanation = (
            "This previously unknown Media DNA pattern has been "
            "promoted into the TRUVENA adaptive generator registry."
        )

    elif status == "EMERGING":

        explanation = (
            "This Media DNA pattern has appeared repeatedly with "
            "high pattern consistency and is being tracked as a "
            "potential emerging synthetic-media generator."
        )

    elif status == "RECURRING":

        explanation = (
            "This Media DNA pattern has appeared in multiple "
            "analyzed samples and is being monitored as a recurring "
            "unknown pattern."
        )

    else:

        explanation = (
            "A new Media DNA pattern has been detected that does "
            "not currently match a registered generator."
        )

    # --------------------------------------------------------
    # Return frontend-compatible object
    # --------------------------------------------------------

    return {
        "id": cluster_id,

        "cluster_code": cluster_id,

        "title": "Unregistered Media DNA Pattern",

        "sample_count": samples,

        "samples_in_cluster": samples,

        "pattern_consistency": round(consistency, 1),

        "growth_rate": None,

        "status": status,

        "status_badge": status_badge,

        "risk_level": risk_level,

        "novelty_score": novelty,

        "media_dna_novelty": novelty,

        "known_match_score": 0,

        "known_generator_match": 0,

        "representative_dna": cluster.get(
            "representative_dna",
            {}
        ),

        "explanation": explanation,

        "characteristics": [],

        "promoted": promoted
    }


# ============================================================
# GET ALL UNKNOWN CLUSTERS
# ============================================================

def get_unknown_clusters() -> List[Dict[str, Any]]:
    """
    Return all currently discovered unknown clusters.

    The data comes directly from forensic_engine.UNKNOWN_CLUSTERS.
    """

    clusters = []

    for cluster_id, cluster in UNKNOWN_CLUSTERS.items():

        clusters.append(
            _format_cluster(
                cluster_id,
                cluster
            )
        )

    # --------------------------------------------------------
    # Sort newest/highest sample clusters first
    # --------------------------------------------------------

    clusters.sort(
        key=lambda item: (
            item.get("sample_count", 0),
            item.get("pattern_consistency", 0)
        ),
        reverse=True
    )

    return clusters


# ============================================================
# GET ONE CLUSTER
# ============================================================

def get_cluster_by_id(
    cluster_id: str
) -> Optional[Dict[str, Any]]:
    """
    Return a single unknown cluster.
    """

    if not cluster_id:
        return None

    cluster = UNKNOWN_CLUSTERS.get(cluster_id)

    if cluster is None:
        return None

    return _format_cluster(
        cluster_id,
        cluster
    )


# ============================================================
# PROMOTE UNKNOWN CLUSTER TO KNOWN REGISTRY
# ============================================================

def promote_cluster_to_known(
    cluster_id: str,
    custom_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Promote an unknown cluster into the TRUVENA generator registry.

    This allows the system to demonstrate the adaptive-registry
    workflow:

        Unknown Pattern
              ↓
        Repeated Detection
              ↓
        Human Validation
              ↓
        Registry Promotion
              ↓
        Known Generator Tracking
    """

    cluster = UNKNOWN_CLUSTERS.get(cluster_id)

    if cluster is None:

        raise ValueError(
            f"Unknown cluster '{cluster_id}' was not found."
        )

    # --------------------------------------------------------
    # Existing promotion check
    # --------------------------------------------------------

    if cluster.get("promoted", False):

        return {
            "success": True,
            "message": (
                f"Cluster {cluster_id} has already been "
                "promoted to the registry."
            ),
            "cluster_id": cluster_id,
            "already_promoted": True
        }

    # --------------------------------------------------------
    # Extract cluster information
    # --------------------------------------------------------

    representative_dna = cluster.get(
        "representative_dna",
        {}
    )

    samples = int(
        cluster.get("samples", 0)
    )

    consistency = float(
        cluster.get("pattern_consistency", 0)
    )

    # --------------------------------------------------------
    # Generate registry ID
    # --------------------------------------------------------

    registry_id = (
        f"TRUVENA-{cluster_id.upper()}"
    )

    # --------------------------------------------------------
    # Generator name
    # --------------------------------------------------------

    if custom_name and custom_name.strip():

        generator_name = custom_name.strip()

    else:

        generator_name = (
            f"Discovered Generator Pattern "
            f"{cluster_id}"
        )

    # --------------------------------------------------------
    # Confidence
    # --------------------------------------------------------

    baseline_confidence = max(
        70,
        min(
            95,
            int(consistency)
        )
    )

    # --------------------------------------------------------
    # Create adaptive registry entry
    # --------------------------------------------------------

    new_generator = {

        "id": registry_id,

        "name": generator_name,

        "vendor": "TRUVENA Adaptive Registry",

        "architecture": (
            "Discovered Synthetic Media Pattern"
        ),

        "release_year": 2026,

        "baseline_confidence": baseline_confidence,

        "media_dna_match": int(
            consistency
        ),

        "analyzed_samples": samples,

        "last_detected": "Just now",

        "status": "ACTIVE_TRACKING",

        "dna_fingerprint": representative_dna,

        "distinctive_artifacts": [],

        "sample_image_hint": (
            "Cluster representative"
        )
    }

    # --------------------------------------------------------
    # Add to generator registry
    # --------------------------------------------------------

    add_promoted_generator(
        new_generator
    )

    # --------------------------------------------------------
    # Update cluster state
    # --------------------------------------------------------

    cluster["promoted"] = True

    cluster["status"] = (
        "PROMOTED_TO_REGISTRY"
    )

    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {

        "success": True,

        "message": (
            f"Cluster {cluster_id} successfully "
            "promoted to the TRUVENA generator registry."
        ),

        "cluster_id": cluster_id,

        "registry_id": registry_id,

        "generator": new_generator,

        "cluster": _format_cluster(
            cluster_id,
            cluster
        )
    }