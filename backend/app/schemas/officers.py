"""
Pydantic Schemas for Municipal Engineers and Section Officers.
"""

from pydantic import BaseModel


class MunicipalOfficerResponse(BaseModel):
    id: str
    name: str
    department: str
    ward: str
    designation: str
    phone: str
    activeWorkloadCount: int
    status: str
