"""
API Endpoints for Civic Tickets, Deduplication, and Municipal Works.
"""

from typing import List, Optional
from datetime import datetime, timezone
import random
import re
from fastapi import APIRouter, HTTPException, Query, status

from backend.app.schemas.tickets import (
    TicketCreate,
    TicketResponse,
    TicketStageUpdate,
    AssignOfficerRequest,
    PhotoAuditRequest,
    SpatialDedupCheckRequest,
    SpatialDedupCheckResponse,
)
from backend.app.services.mock_db import db_store
from backend.app.services.spatial_dedup import SpatialDedupService
from backend.app.services.ward_router import WardRouterService

router = APIRouter(prefix="/tickets", tags=["Tickets & Civic Governance"])


@router.get("", response_model=List[TicketResponse])
async def list_tickets(
    category: Optional[str] = Query(None, description="Filter by category"),
    stage: Optional[str] = Query(None, description="Filter by stage"),
    ward: Optional[str] = Query(None, description="Filter by municipal ward"),
    search: Optional[str] = Query(None, description="Search keyword in title or location"),
    user_id: Optional[str] = Query(None, description="Filter strictly by citizen User ID"),
    citizen_phone: Optional[str] = Query(None, description="Filter strictly by citizen Phone"),
    sort_by: Optional[str] = Query("newest", description="Sort order: newest, merged_count, severity"),
):
    """List civic work order tickets with multi-field filtering, user isolation, and priority sorting."""
    tickets = list(db_store.tickets)

    # Scoped user data isolation
    if user_id:
        tickets = [t for t in tickets if t.get("userId") == user_id]
    elif citizen_phone:
        clean_q = re.sub(r"\D", "", citizen_phone)[-10:]
        if clean_q:
            tickets = [
                t for t in tickets
                if re.sub(r"\D", "", t.get("citizenPhone", ""))[-10:] == clean_q
            ]

    if category and category != "All":
        tickets = [t for t in tickets if t["category"] == category]

    if stage and stage != "All":
        tickets = [t for t in tickets if t["currentStage"] == stage]

    if ward and ward != "All":
        tickets = [t for t in tickets if ward.lower() in t["location"].lower()]

    if search:
        q = search.lower()
        tickets = [
            t
            for t in tickets
            if q in t["title"].lower()
            or q in t["id"].lower()
            or q in t["location"].lower()
        ]

    if sort_by == "merged_count":
        tickets.sort(key=lambda t: t.get("mergedCount", 1), reverse=True)
    elif sort_by == "severity":
        severity_order = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
        tickets.sort(key=lambda t: severity_order.get(t.get("severity", "Low"), 1), reverse=True)

    return tickets


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: str,
    user_id: Optional[str] = Query(None, description="User ID for isolation check"),
    citizen_phone: Optional[str] = Query(None, description="Citizen phone for isolation check"),
):
    """Retrieve details of a single work order with strict user-scoping protection."""
    ticket = next((t for t in db_store.tickets if t["id"] == ticket_id), None)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket {ticket_id} not found"
        )

    # Ensure user only accesses their own ticket
    if user_id and ticket.get("userId") and ticket.get("userId") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: Not your ticket"
        )
    if citizen_phone and ticket.get("citizenPhone"):
        clean_q = re.sub(r"\D", "", citizen_phone)[-10:]
        clean_t = re.sub(r"\D", "", ticket.get("citizenPhone", ""))[-10:]
        if clean_q and clean_t and clean_q != clean_t:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: Not your ticket"
            )

    return ticket


@router.post("/check-dedup", response_model=SpatialDedupCheckResponse)
async def check_spatial_dedup(payload: SpatialDedupCheckRequest):
    """
    Pre-flight 50-meter spatial deduplication check.
    Returns whether complaint matches an active defect cluster.
    """
    is_dup, match, dist = SpatialDedupService.check_deduplication(
        payload.category,
        payload.coordinates.latitude,
        payload.coordinates.longitude,
        db_store.tickets,
    )

    if is_dup and match:
        return SpatialDedupCheckResponse(
            isDuplicate=True,
            existingTicketId=match["id"],
            distanceMeters=dist,
            existingMergedCount=match.get("mergedCount", 1),
            message=f"Duplicate detected: {dist}m from active cluster {match['id']}.",
        )

    return SpatialDedupCheckResponse(
        isDuplicate=False,
        message="No existing active defect within 50m radius. New master ticket will be created.",
    )


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(payload: TicketCreate):
    """
    Submit a citizen defect report.
    Real Execution: Every freshly submitted ticket starts at 'submitted' with NO officer assigned.
    """
    is_dup, match, dist = SpatialDedupService.check_deduplication(
        payload.category,
        payload.coordinates.latitude,
        payload.coordinates.longitude,
        db_store.tickets,
    )

    cluster_parent_id = None
    merged_count = 1

    if is_dup and match:
        # Cluster into existing master ticket
        match["mergedCount"] = match.get("mergedCount", 1) + 1
        cluster_parent_id = match["id"]
        merged_count = match["mergedCount"]

        # If anonymous submission (e.g. legacy tests without userId), return match
        if not payload.userId:
            return match

    # Create new master work order - strictly starting at 'submitted' and assignedCrew: None
    new_id = f"TKT-{random.randint(8910, 9999)}"
    new_ticket = {
        "id": new_id,
        "category": payload.category,
        "title": payload.title,
        "location": payload.location,
        "coordinates": payload.coordinates.dict(),
        "reportedAt": "Just now",
        "currentStage": "submitted",
        "citizenName": payload.citizenName,
        "citizenPhone": payload.citizenPhone,
        "userId": payload.userId,
        "citizenAadhaar": payload.citizenAadhaar,
        "clusterParentId": cluster_parent_id,
        "mergedCount": merged_count,
        "severity": payload.severity,
        "assignedCrew": None,
        "beforeImageUrl": payload.beforeImageUrl,
        "afterImageUrl": None,
    }

    db_store.tickets.insert(0, new_ticket)
    return new_ticket


@router.patch("/{ticket_id}/stage", response_model=TicketResponse)
async def update_ticket_stage(ticket_id: str, payload: TicketStageUpdate):
    """Update current stage of a work order."""
    ticket = next((t for t in db_store.tickets if t["id"] == ticket_id), None)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket {ticket_id} not found"
        )

    ticket["currentStage"] = payload.stage
    return ticket


@router.post("/{ticket_id}/assign-officer", response_model=TicketResponse)
async def assign_officer(ticket_id: str, payload: AssignOfficerRequest):
    """Assign municipal engineer to a work order and update workload."""
    ticket = next((t for t in db_store.tickets if t["id"] == ticket_id), None)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket {ticket_id} not found"
        )

    officer = next((o for o in db_store.municipal_officers if o["id"] == payload.officerId), None)
    if not officer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Officer {payload.officerId} not found"
        )

    ticket["currentStage"] = "assigned"
    ticket["assignedCrew"] = {
        "workerName": officer["name"],
        "unitId": officer["id"],
        "phone": officer["phone"],
        "checkedInTime": "Assigned Just Now",
    }
    officer["activeWorkloadCount"] += 1

    return ticket


@router.post("/{ticket_id}/audit", response_model=TicketResponse)
async def audit_photo_proof(ticket_id: str, payload: PhotoAuditRequest):
    """Quality audit inspection of before/after photos by GVMC admin."""
    ticket = next((t for t in db_store.tickets if t["id"] == ticket_id), None)
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket {ticket_id} not found"
        )

    if payload.decision.upper() == "APPROVE":
        ticket["currentStage"] = "resolved"
    else:
        ticket["currentStage"] = "in_progress"

    return ticket
