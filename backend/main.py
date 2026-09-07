from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from core.config import PROJECT_NAME, VERSION, TAGLINE, UPLOADS_DIR
from api.routes_analysis import router as analysis_router
from api.routes_intelligence import router as intelligence_router
from api.routes_dashboard import router as dashboard_router

app = FastAPI(
    title=f"{PROJECT_NAME} Synthetic Media Forensics API",
    version=VERSION,
    description="AI-Powered Synthetic Media Forensics & Trust Intelligence Platform"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(dashboard_router)
app.include_router(analysis_router)
app.include_router(intelligence_router)

# Mount uploads static directory for sample assets
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

@app.get("/")
async def root():
    return {
        "platform": PROJECT_NAME,
        "version": VERSION,
        "tagline": TAGLINE,
        "status": "OPERATIONAL",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "forensic_engine": "ACTIVE",
        "cluster_engine": "SYNCED"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)