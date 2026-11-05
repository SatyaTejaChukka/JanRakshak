"""
Pydantic Schemas for Aadhaar OTP Generation and Verification.
Enforces statutory masking and consent logging.
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class AadhaarOtpRequest(BaseModel):
    mobile_number: str = Field(..., description="10-digit Indian mobile number")
    aadhaar_number: Optional[str] = Field(None, description="12-digit Aadhaar number with or without spaces")
    full_name: Optional[str] = Field(None, description="Legal full name of the citizen")
    ward: Optional[str] = Field(None, description="Residing municipal ward")
    consent: bool = Field(True, description="Statutory citizen consent checkbox")


class AadhaarOtpResponse(BaseModel):
    client_id: str = Field(..., description="Unique transaction reference ID")
    otp_sent: bool = Field(True, description="Delivery confirmation flag")
    valid_seconds: int = Field(600, description="Validity period in seconds")
    masked_mobile: str = Field(..., description="Masked mobile phone")
    masked_aadhaar: str = Field(..., description="Masked Aadhaar format: XXXX-XXXX-1234")
    simulated_sms: str = Field(..., description="Formatted UIDAI SMS banner text")
    debug_otp: str = Field(..., description="Ephemeral OTP code for hackathon/testing inspection")


class AadhaarVerifyRequest(BaseModel):
    client_id: str = Field(..., description="Transaction reference ID received from generate-otp")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code")
    aadhaar_number: Optional[str] = Field(None, description="Optional raw Aadhaar for fallback verification")
    mobile_number: Optional[str] = Field(None, description="Optional mobile number for fallback")
    full_name: Optional[str] = Field(None, description="Citizen full name")
    ward: Optional[str] = Field(None, description="Assigned ward")


class AadhaarVerifyResponse(BaseModel):
    verified: bool = Field(..., description="Verification success flag")
    token: str = Field(..., description="Session authentication JWT or bearer token")
    citizen: Dict[str, Any] = Field(..., description="Verified citizen profile record")
    message: str = Field(..., description="Informational status message")


class OfficialRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, description="Officer legal / badge full name")
    department: str = Field(..., description="GVMC_ADMIN or NDRF_ADMIN")
    badge_id: str = Field(..., min_length=3, description="Officer badge ID or employee service code")
    email: str = Field(..., description="Departmental email address")
    designation: Optional[str] = Field("Official Administrator", description="Official rank / role title")
    pin: str = Field(..., min_length=4, description="Clearance security PIN or password")


class OfficialLoginRequest(BaseModel):
    department: str = Field(..., description="GVMC_ADMIN or NDRF_ADMIN")
    identifier: str = Field(..., description="Email or Badge ID")
    pin: str = Field(..., min_length=4, description="Clearance PIN")


class OfficialAuthResponse(BaseModel):
    success: bool
    role: str
    officer: Dict[str, Any]
    token: str
    message: str


