from fastapi import APIRouter
from core.generator_registry import get_known_generators
from core.cluster_engine import get_unknown_clusters

router = APIRouter(prefix="/api", tags=["Dashboard"])

@router.get("/dashboard-stats")
async def get_dashboard_stats():
    """Retrieve aggregate telemetry and live threat intelligence metrics."""
    known_gens = get_known_generators()
    unknown_clusters = get_unknown_clusters()
    
    # Live feed of recent forensic investigations
    recent_activity = [
        {
            "id": "TRV-98412-A109",
            "timestamp": "2 mins ago",
            "filename": "portrait_editorial_092.png",
            "classification": "AI Generated",
            "likely_generator": "FLUX.1",
            "confidence": 82,
            "dna_hash": "DNA-FLX-94A8",
            "risk_level": "HIGH",
            "trust_score": 18,
            "status": "Attributed"
        },
        {
            "id": "TRV-98409-C470",
            "timestamp": "8 mins ago",
            "filename": "wire_syndication_specimen_47.jpg",
            "classification": "AI Generated",
            "likely_generator": "UNKNOWN (Cluster #47)",
            "confidence": 0,
            "dna_hash": "DNA-UNK-47A1",
            "risk_level": "HIGH",
            "trust_score": 12,
            "status": "Potential Emerging Generator"
        },
        {
            "id": "TRV-98394-F220",
            "timestamp": "19 mins ago",
            "filename": "dsc_0491_summilux.jpg",
            "classification": "Authentic Media",
            "likely_generator": "None (Leica M11 Sensor)",
            "confidence": 99,
            "dna_hash": "DNA-LEI-04C9",
            "risk_level": "LOW",
            "trust_score": 98,
            "status": "C2PA Verified"
        },
        {
            "id": "TRV-98380-M618",
            "timestamp": "34 mins ago",
            "filename": "cinematic_metropolis_v6.png",
            "classification": "AI Generated",
            "likely_generator": "Midjourney v6.1",
            "confidence": 88,
            "dna_hash": "DNA-MJ6-88F2",
            "risk_level": "HIGH",
            "trust_score": 15,
            "status": "Attributed"
        },
        {
            "id": "TRV-98365-S104",
            "timestamp": "52 mins ago",
            "filename": "concept_cyberpunk_sketch.png",
            "classification": "AI Generated",
            "likely_generator": "Stable Diffusion XL",
            "confidence": 79,
            "dna_hash": "DNA-SDX-79B4",
            "risk_level": "HIGH",
            "trust_score": 22,
            "status": "Attributed"
        },
        {
            "id": "TRV-98350-D391",
            "timestamp": "1 hour ago",
            "filename": "surreal_glass_sculpture.png",
            "classification": "AI Generated",
            "likely_generator": "DALL?E 3",
            "confidence": 84,
            "dna_hash": "DNA-DAL-82C3",
            "risk_level": "HIGH",
            "trust_score": 19,
            "status": "Attributed"
        },
        {
            "id": "TRV-98322-N520",
            "timestamp": "2 hours ago",
            "filename": "synthetic_id_card_photo.jpg",
            "classification": "AI Generated",
            "likely_generator": "UNKNOWN (Cluster #52)",
            "confidence": 0,
            "dna_hash": "DNA-UNK-52B8",
            "risk_level": "MEDIUM",
            "trust_score": 35,
            "status": "Under Investigation"
        }
    ]
    
    return {
        "stats": {
            "total_media_analyzed": 128490,
            "ai_generated_detected": 104210,
            "known_generators_tracked": len(known_gens),
            "unknown_patterns_active": len([c for c in unknown_clusters if not c.get("promoted")]),
            "emerging_generators": 1,
            "average_trust_score": 64.2,
            "c2pa_verified_rate": "12.8%",
            "novel_cluster_growth": "+28%"
        },
        "emerging_alert": {
            "cluster_code": "UNKNOWN CLUSTER #47",
            "sample_count": 1824,
            "consistency": 95,
            "weekly_growth": "+28%",
            "status": "POTENTIAL EMERGING GENERATOR",
            "summary": "Rapid proliferation of unregistered latent flow architecture detected across wild media streams."
        },
        "recent_analyses": recent_activity
    }