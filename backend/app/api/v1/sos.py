"""
API Endpoints for Emergency SOS and Vulnerable Citizen Assistance.
"""

from typing import List
from datetime import datetime, timezone
import random
from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.sos import (
    SOSTriggerRequest,
    SOSResponse,
    ElderProfileSchema,
    ProximityVolunteer,
    EmergencyBroadcastRequest,
    EmergencyBroadcastResponse,
    SOSIncidentSchema,
)

from backend.app.services.mock_db import db_store

router = APIRouter(prefix="/sos", tags=["Emergency Life-Safety & SOS"])


@router.get("/elder-profile", response_model=ElderProfileSchema)
async def get_elder_profile():
    """Retrieve pre-registered senior citizen vulnerability profile."""
    return db_store.elder_profile


@router.put("/elder-profile", response_model=ElderProfileSchema)
async def update_elder_profile(payload: ElderProfileSchema):
    """Update vulnerability registry details and critical medical needs."""
    db_store.elder_profile = payload.dict()
    return db_store.elder_profile


@router.post("/trigger", response_model=SOSResponse, status_code=status.HTTP_201_CREATED)
async def trigger_emergency_sos(payload: SOSTriggerRequest):
    """
    Trigger emergency SOS signal for vulnerable elder citizen.
    Dispatches nearest community volunteers (<500m) and NDRF boat squads.
    Alerts all nearby citizens, volunteers, and the NDRF War Room.
    """
    sos_id = f"ELD-{random.randint(4100, 4999)}"
    elder = db_store.elder_profile

    # Set nearest volunteer en-route
    if db_store.active_volunteers:
        first_vol = db_store.active_volunteers[0]
        first_vol["status"] = "En Route"
        first_vol["assignedIncidentId"] = sos_id

    # Record active SOS incident for NDRF War Room
    now_str = datetime.now(timezone.utc).strftime("%I:%M %p Today")
    incident = {
        "id": sos_id,
        "priority": "SEV-1 RED",
        "elderName": elder["fullName"],
        "location": elder["address"],
        "details": f"Urgent Evacuation ({payload.triggerType}). Oxygen / mobility support needed.",
        "assignedUnit": "NDRF 10th Bn IRB Boat #04",
        "status": "DISPATCHED",
        "timestamp": now_str,
    }
    db_store.sos_incidents.insert(0, incident)

    # Disseminate live emergency broadcast across network
    sos_broadcast = {
        "id": f"BC-{random.randint(5000, 5999)}",
        "title": f"🚨 RESCUE ALERT: Elder SOS Dispatched ({elder['fullName']})",
        "message": f"Senior citizen stranded at {elder['address']}. NDRF Boat Unit #04 & 7 nearby volunteers deployed.",
        "severity": "CRITICAL",
        "targetZone": elder.get("ward", "Ward 14 (Coastal Belt)"),
        "senderName": "State EOC / NDRF Emergency Mesh",
        "timestamp": now_str,
        "channel": "CELL_BROADCAST_4370_AND_APP",
        "dispatchedToCitizens": True,
        "dispatchedToFieldResponders": True,
        "activeUserAlertCount": len(db_store.active_volunteers) + 120,
    }
    db_store.broadcasts.insert(0, sos_broadcast)

    log_msg = f"[SOS-TRIGGER] Alert dispatched for {elder['fullName']} at {elder['address']} (Incident: {sos_id})"
    print(log_msg, flush=True)

    return SOSResponse(
        sosEventId=sos_id,
        status="DISPATCHED",
        elderName=elder["fullName"],
        location=elder["address"],
        proximityVolunteerCount=len(db_store.active_volunteers),
        assignedUnit="NDRF 10th Bn IRB Boat #04",
        destinationShelter="Andhra University Indoor Sports Complex Hub",
        timestamp="Just now",
    )


@router.post("/broadcast", response_model=EmergencyBroadcastResponse, status_code=status.HTTP_201_CREATED)
async def send_emergency_broadcast(payload: EmergencyBroadcastRequest):
    """
    Publish an official emergency broadcast from NDRF Command or GVMC Magistracy.
    Immediately alerts all nearby citizens, volunteers, and tactical units.
    """
    now_str = datetime.now(timezone.utc).strftime("%I:%M %p Today")
    bc_id = f"BC-{random.randint(6000, 6999)}"

    broadcast_record = {
        "id": bc_id,
        "title": payload.title.strip(),
        "message": payload.message.strip(),
        "severity": payload.severity.strip().upper(),
        "targetZone": payload.targetZone.strip() if payload.targetZone else "Ward 14 (Coastal Belt & Beach Road)",
        "senderName": payload.senderName.strip() if payload.senderName else "NDRF 10th Battalion War Room Command",
        "timestamp": now_str,
        "channel": payload.channel or "CELL_BROADCAST_4370_AND_APP",
        "dispatchedToCitizens": True,
        "dispatchedToFieldResponders": True,
        "activeUserAlertCount": random.randint(140, 210),
    }

    db_store.broadcasts.insert(0, broadcast_record)

    log_msg = f"[EMERGENCY-BROADCAST] Dispatched '{payload.title}' by {broadcast_record['senderName']} across Cell Broadcast Channel 4370 & Web Clients"
    print(log_msg, flush=True)

    return EmergencyBroadcastResponse(**broadcast_record)


@router.get("/broadcasts", response_model=List[EmergencyBroadcastResponse])
async def list_emergency_broadcasts():
    """Retrieve all active emergency broadcasts in reverse chronological order."""
    return [EmergencyBroadcastResponse(**b) for b in db_store.broadcasts]


@router.get("/incidents", response_model=List[SOSIncidentSchema])
async def list_active_sos_incidents():
    """Retrieve all active SOS incidents for the NDRF War Room console."""
    return [SOSIncidentSchema(**inc) for inc in db_store.sos_incidents]



@router.get("/proximity-volunteers", response_model=List[ProximityVolunteer])
async def get_proximity_volunteers():
    """List verified community responders within 500m proximity radius."""
    results = []
    for vol in db_store.active_volunteers:
        results.append(
            ProximityVolunteer(
                id=vol["id"],
                name=vol["name"],
                phone=vol["phone"],
                ward=vol["ward"],
                distanceMeters=vol.get("distanceMeters", 200),
                role=vol["role"],
                equipment=vol["equipment"],
                status=vol["status"],
                isVerifiedByNDRF=vol.get("isVerifiedByNDRF", True),
            )
        )
    return results
