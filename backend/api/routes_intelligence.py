from fastapi import APIRouter, HTTPException, Body
from typing import Optional, Dict, Any

from core.generator_registry import get_known_generators
from core.cluster_engine import get_unknown_clusters, promote_cluster_to_known, get_cluster_by_id

router = APIRouter(prefix="/api", tags=["Intelligence"])

@router.get("/generators")
async def list_generators():
    """Retrieve all known synthetic generator registry entries."""
    generators = get_known_generators()
    return {
        "count": len(generators),
        "generators": generators
    }

@router.get("/unknown-clusters")
async def list_unknown_clusters():
    """Retrieve recurring unknown generator clusters being tracked."""
    clusters = get_unknown_clusters()
    return {
        "count": len(clusters),
        "clusters": clusters
    }

@router.post("/clusters/{cluster_id}/promote")
async def promote_cluster(cluster_id: str, payload: Optional[Dict[str, Any]] = Body(None)):
    """
    Demonstrate Adaptive Learning: Promote an unknown cluster to the Known Generator Registry.
    Synthesizes DNA fingerprint and adds to active attribution models.
    """
    custom_name = payload.get("custom_name") if payload else None
    try:
        result = promote_cluster_to_known(cluster_id, custom_name=custom_name)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))