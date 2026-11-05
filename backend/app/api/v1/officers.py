"""
API Endpoints for Municipal Officers and Section Engineers.
"""

from typing import List
from fastapi import APIRouter

from backend.app.schemas.officers import MunicipalOfficerResponse
from backend.app.services.mock_db import db_store

router = APIRouter(prefix="/officers", tags=["Municipal Officers & Roster"])


@router.get("", response_model=List[MunicipalOfficerResponse])
async def list_municipal_officers():
    """Retrieve GVMC Zone 2 engineering roster and active workload counts."""
    return db_store.municipal_officers
