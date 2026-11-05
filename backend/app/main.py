"""
JanRakshak — Main FastAPI Application Server.
Dual-Mode Civic & Disaster Management Platform.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import settings
from backend.app.api.v1.tickets import router as tickets_router
from backend.app.api.v1.sos import router as sos_router
from backend.app.api.v1.volunteers import router as volunteers_router
from backend.app.api.v1.shelters import router as shelters_router
from backend.app.api.v1.hazards import router as hazards_router
from backend.app.api.v1.officers import router as officers_router
from backend.app.api.v1.system import router as system_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend REST API for JanRakshak Dual-Mode Civic & Disaster Management Platform.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
API_V1_PREFIX = "/api/v1"
app.include_router(tickets_router, prefix=API_V1_PREFIX)
app.include_router(sos_router, prefix=API_V1_PREFIX)
app.include_router(volunteers_router, prefix=API_V1_PREFIX)
app.include_router(shelters_router, prefix=API_V1_PREFIX)
app.include_router(hazards_router, prefix=API_V1_PREFIX)
app.include_router(officers_router, prefix=API_V1_PREFIX)
app.include_router(system_router, prefix=API_V1_PREFIX)


@app.get("/health", tags=["Health & System"])
async def health_check():
    """System health check and availability ping."""
    return {
        "status": "healthy",
        "service": "JanRakshak Backend API",
        "version": settings.APP_VERSION,
        "operatingMode": settings.OPERATING_MODE,
    }


@app.get("/", tags=["Health & System"])
async def root():
    """Welcome endpoint with direct link to interactive OpenAPI documentation."""
    return {
        "message": "Welcome to JanRakshak Dual-Mode Civic & Disaster Management API",
        "documentation": "/docs",
        "health": "/health",
        "version": settings.APP_VERSION,
    }
