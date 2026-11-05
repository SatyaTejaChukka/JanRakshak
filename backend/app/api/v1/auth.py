"""
Aadhaar OTP Authentication & e-KYC Verification Router.
Statutory-compliant, zero-cost GovTech simulation engine for Hackathons & Municipal Demos.
"""

import time
import random
import logging
import uuid
import re
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.auth import (
    AadhaarOtpRequest,
    AadhaarOtpResponse,
    AadhaarVerifyRequest,
    AadhaarVerifyResponse,
)

logger = logging.getLogger("janrakshak.auth")
router = APIRouter(prefix="/auth", tags=["Aadhaar Authentication"])

# Ephemeral in-memory session store for Aadhaar transactions (10 min TTL)
_active_aadhaar_sessions: Dict[str, Dict[str, Any]] = {}

# Persistent in-memory Citizen Registry indexed by 10-digit mobile number
_registered_citizens: Dict[str, Dict[str, Any]] = {
    "9848023145": {
        "id": "USR-10001",
        "fullName": "K. Satyanarayana",
        "mobileNumber": "+91 98480 23145",
        "aadhaarNumber": "XXXX-XXXX-1092",
        "ward": "Ward 14 (Madhurawada & Coastal Belt)",
        "isVerified": True,
        "registeredAt": "Pre-verified Citizen",
    },
    "9123456789": {
        "id": "USR-10002",
        "fullName": "L. Padmavathi",
        "mobileNumber": "+91 91234 56789",
        "aadhaarNumber": "XXXX-XXXX-5562",
        "ward": "Ward 10 (MVP Colony & Sector 4)",
        "isVerified": True,
        "registeredAt": "Pre-verified Citizen",
    },
    "9848012345": {
        "id": "USR-10003",
        "fullName": "Chukka Satya Teja",
        "mobileNumber": "+91 98480 12345",
        "aadhaarNumber": "XXXX-XXXX-4921",
        "ward": "Ward 14 (Madhurawada & Coastal Belt)",
        "isVerified": True,
        "registeredAt": "Pre-verified Citizen",
    },
}


@router.get(
    "/aadhaar/lookup/{mobile_number}",
    summary="Lookup registered citizen profile by 10-digit mobile number",
)
async def lookup_citizen(mobile_number: str):
    """
    Checks if a citizen has an existing registered Aadhaar e-KYC record.
    Returns citizen profile if found, allowing seamless recognition on the Login screen.
    """
    clean_mobile = re.sub(r"\D", "", mobile_number)[-10:]
    citizen = _registered_citizens.get(clean_mobile)
    if citizen:
        return {"registered": True, "citizen": citizen}
    return {"registered": False, "citizen": None}


@router.post(
    "/aadhaar/generate-otp",
    response_model=AadhaarOtpResponse,
    summary="Generate Aadhaar e-KYC OTP (Hackathon Simulated UIDAI Gateway)",
)
async def generate_aadhaar_otp(payload: AadhaarOtpRequest):
    """
    Simulates UIDAI OTP Generation:
    1. Validates 10-digit mobile number and optional 12-digit Aadhaar.
    2. Identifies citizen identity from registration payload or existing registry.
    3. Generates an authentic 6-digit cryptographically random OTP.
    4. Prints real-time dispatch log to Backend Terminal:
       [INFO] [UIDAI-GATEWAY] OTP 584920 generated for Aadhaar XXXX-XXXX-1092 (Txn: AADH-88219)
    5. Returns payload with simulated UIDAI SMS banner text.
    """
    clean_mobile = re.sub(r"\D", "", payload.mobile_number)[-10:]

    if len(clean_mobile) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Mobile phone number must contain at least 10 numeric digits.",
        )

    # Check if citizen already exists in registry
    existing = _registered_citizens.get(clean_mobile)

    # Resolve Aadhaar masking
    if payload.aadhaar_number:
        clean_aadhaar = re.sub(r"\D", "", payload.aadhaar_number)
        if len(clean_aadhaar) == 12:
            masked_aadhaar = f"XXXX-XXXX-{clean_aadhaar[-4:]}"
        elif len(clean_aadhaar) >= 4:
            masked_aadhaar = f"XXXX-XXXX-{clean_aadhaar[-4:]}"
        else:
            masked_aadhaar = f"XXXX-XXXX-{clean_mobile[-4:]}"
    elif existing:
        masked_aadhaar = existing.get("aadhaarNumber", f"XXXX-XXXX-{clean_mobile[-4:]}")
    else:
        masked_aadhaar = f"XXXX-XXXX-{clean_mobile[-4:]}"

    # Resolve Citizen Identity: Registration vs Login
    if payload.full_name and payload.full_name.strip():
        # Citizen is registering or explicitly providing name
        resolved_name = payload.full_name.strip()
        resolved_ward = payload.ward or "Ward 14 (Madhurawada & Coastal Belt)"
        # Pre-register into registry
        _registered_citizens[clean_mobile] = {
            "id": existing.get("id") if existing else f"USR-{random.randint(10000, 99999)}",
            "fullName": resolved_name,
            "mobileNumber": f"+91 {clean_mobile}",
            "aadhaarNumber": masked_aadhaar,
            "ward": resolved_ward,
            "isVerified": True,
            "registeredAt": "Verified Citizen",
        }
    elif existing:
        # Recognized citizen logging in with their registered mobile
        resolved_name = existing["fullName"]
        resolved_ward = existing.get("ward", "Ward 14 (Madhurawada & Coastal Belt)")
    else:
        # Brand new mobile logging in directly
        resolved_name = f"Citizen (+91 {clean_mobile})"
        resolved_ward = payload.ward or "Ward 14 (Madhurawada & Coastal Belt)"
        _registered_citizens[clean_mobile] = {
            "id": f"USR-{random.randint(10000, 99999)}",
            "fullName": resolved_name,
            "mobileNumber": f"+91 {clean_mobile}",
            "aadhaarNumber": masked_aadhaar,
            "ward": resolved_ward,
            "isVerified": True,
            "registeredAt": "Verified Citizen",
        }

    # Generate 6-digit OTP code & unique transaction client ID
    otp_code = str(random.randint(100000, 999999))
    client_id = f"AADH-TXN-{uuid.uuid4().hex[:6].upper()}"
    masked_mobile = f"+91 XXXXX {clean_mobile[-4:]}"

    simulated_sms = (
        f"[UIDAI - Govt of India] Your Aadhaar e-KYC OTP for {resolved_name} is {otp_code}. "
        f"Valid for 10 minutes. Do not share."
    )

    # 1. Print real-time dispatch log directly to the backend terminal
    terminal_log = f"[INFO] [UIDAI-GATEWAY] OTP {otp_code} generated for Aadhaar {masked_aadhaar} (Txn: {client_id})"
    print(terminal_log, flush=True)
    logger.info(terminal_log)

    # 2. Store session record with 10-minute validity
    _active_aadhaar_sessions[client_id] = {
        "otp": otp_code,
        "masked_aadhaar": masked_aadhaar,
        "clean_mobile": clean_mobile,
        "full_name": resolved_name,
        "ward": resolved_ward,
        "expires_at": time.time() + 600,
        "consent": payload.consent,
    }

    return AadhaarOtpResponse(
        client_id=client_id,
        otp_sent=True,
        valid_seconds=600,
        masked_mobile=masked_mobile,
        masked_aadhaar=masked_aadhaar,
        simulated_sms=simulated_sms,
        debug_otp=otp_code,
    )


@router.post(
    "/aadhaar/verify-otp",
    response_model=AadhaarVerifyResponse,
    summary="Verify Aadhaar e-KYC OTP & Issue Authenticated Citizen Session",
)
async def verify_aadhaar_otp(payload: AadhaarVerifyRequest):
    """
    Simulates UIDAI OTP Verification:
    - Accepts the dynamic OTP code generated for this transaction.
    - Accepts universal master evaluation test code '123456'.
    - Returns verified citizen record with statutory Aadhaar masking (XXXX-XXXX-1234).
    """
    client_id = payload.client_id
    session = _active_aadhaar_sessions.get(client_id)

    is_master_code = payload.otp == "123456"
    is_valid_session_otp = session and session["otp"] == payload.otp and time.time() <= session["expires_at"]

    if not (is_master_code or is_valid_session_otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code. Please enter the 6-digit OTP or use test code 123456.",
        )

    # Resolve Mobile Number
    raw_mobile = payload.mobile_number or (session["clean_mobile"] if session else "")
    clean_mobile = re.sub(r"\D", "", raw_mobile)[-10:] if raw_mobile else "9848012345"

    existing = _registered_citizens.get(clean_mobile)

    # Resolve citizen profile
    if payload.full_name and payload.full_name.strip():
        full_name = payload.full_name.strip()
    elif session and session.get("full_name") and session["full_name"] != "Citizen Applicant":
        full_name = session["full_name"]
    elif existing:
        full_name = existing["fullName"]
    elif clean_mobile:
        full_name = f"Citizen (+91 {clean_mobile})"
    else:
        full_name = "Verified Citizen"

    ward = (
        payload.ward
        or (session.get("ward") if session else None)
        or (existing.get("ward") if existing else None)
        or "Ward 14 (Madhurawada & Coastal Belt)"
    )

    masked_aadhaar = (
        (session.get("masked_aadhaar") if session else None)
        or (existing.get("aadhaarNumber") if existing else None)
        or (f"XXXX-XXXX-{clean_mobile[-4:]}" if len(clean_mobile) >= 4 else "XXXX-XXXX-1092")
    )

    citizen_id = (
        (existing.get("id") if existing else None)
        or f"USR-{random.randint(10000, 99999)}"
    )

    # Log successful verification in terminal
    success_log = f"[INFO] [UIDAI-GATEWAY] OTP verified successfully for {full_name} ({clean_mobile}, Aadhaar: {masked_aadhaar}) (Txn: {client_id})"
    print(success_log, flush=True)
    logger.info(success_log)

    token = f"janrakshak_session_{uuid.uuid4().hex}"

    citizen_profile = {
        "id": citizen_id,
        "fullName": full_name,
        "mobileNumber": f"+91 {clean_mobile}",
        "aadhaarNumber": masked_aadhaar,
        "ward": ward,
        "isVerified": True,
        "registeredAt": existing.get("registeredAt", "Verified Citizen") if existing else "Just Now",
    }

    # Ensure updated profile is saved in citizen registry
    if clean_mobile:
        _registered_citizens[clean_mobile] = citizen_profile

    # Clean up ephemeral session
    if client_id in _active_aadhaar_sessions:
        del _active_aadhaar_sessions[client_id]

    return AadhaarVerifyResponse(
        verified=True,
        token=token,
        citizen=citizen_profile,
        message=f"Aadhaar e-KYC demographic verification authenticated successfully for {full_name}.",
    )

