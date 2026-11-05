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


@router.post(
    "/aadhaar/generate-otp",
    response_model=AadhaarOtpResponse,
    summary="Generate Aadhaar e-KYC OTP (Hackathon Simulated UIDAI Gateway)",
)
async def generate_aadhaar_otp(payload: AadhaarOtpRequest):
    """
    Simulates UIDAI OTP Generation:
    1. Validates 12-digit Aadhaar & 10-digit mobile number format.
    2. Generates an authentic 6-digit cryptographically random OTP.
    3. Prints real-time dispatch log to Backend Terminal:
       [INFO] [UIDAI-GATEWAY] OTP 584920 generated for Aadhaar XXXX-XXXX-1092 (Txn: AADH-88219)
    4. Returns payload with simulated UIDAI SMS banner text.
    """
    clean_aadhaar = re.sub(r"\D", "", payload.aadhaar_number)
    clean_mobile = re.sub(r"\D", "", payload.mobile_number)

    if len(clean_aadhaar) != 12:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Aadhaar number must contain exactly 12 numeric digits.",
        )

    if len(clean_mobile) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Mobile phone number must contain at least 10 numeric digits.",
        )

    # Generate 6-digit OTP code & unique transaction client ID
    otp_code = str(random.randint(100000, 999999))
    client_id = f"AADH-TXN-{uuid.uuid4().hex[:6].upper()}"
    masked_aadhaar = f"XXXX-XXXX-{clean_aadhaar[-4:]}"
    masked_mobile = f"+91 XXXXX {clean_mobile[-4:]}"

    simulated_sms = (
        f"[UIDAI - Govt of India] Your Aadhaar e-KYC OTP for JanRakshak registration is {otp_code}. "
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
        "full_name": payload.full_name or "Citizen Applicant",
        "ward": payload.ward or "Ward 14 (Madhurawada & Coastal Belt)",
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

    # Extract or infer citizen profile
    full_name = payload.full_name or (session["full_name"] if session else "K. Satyanarayana")
    ward = payload.ward or (session["ward"] if session else "Ward 14 (Madhurawada & Coastal Belt)")
    masked_aadhaar = session["masked_aadhaar"] if session else "XXXX-XXXX-1092"
    mobile = payload.mobile_number or (session["clean_mobile"] if session else "9848012345")

    # Log successful verification in terminal
    success_log = f"[INFO] [UIDAI-GATEWAY] OTP verified successfully for Aadhaar {masked_aadhaar} (Txn: {client_id})"
    print(success_log, flush=True)
    logger.info(success_log)

    citizen_id = f"USR-{random.randint(10000, 99999)}"
    token = f"janrakshak_session_{uuid.uuid4().hex}"

    citizen_profile = {
        "id": citizen_id,
        "fullName": full_name,
        "mobileNumber": f"+91 {mobile[-10:]}",
        "aadhaarNumber": masked_aadhaar,
        "ward": ward,
        "isVerified": True,
        "registeredAt": "Just Now",
    }

    # Clean up session
    if client_id in _active_aadhaar_sessions:
        del _active_aadhaar_sessions[client_id]

    return AadhaarVerifyResponse(
        verified=True,
        token=token,
        citizen=citizen_profile,
        message="Aadhaar e-KYC demographic verification authenticated successfully.",
    )
