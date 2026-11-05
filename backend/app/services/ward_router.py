"""
Administrative Ward Router Service.
Resolves GVMC Ward based on coordinates using bounding rules.
"""

from typing import Dict, Any


class WardRouterService:
    @staticmethod
    def resolve_ward(lat: float, lon: float) -> Dict[str, Any]:
        """
        Maps GPS coordinates to administrative Visakhapatnam GVMC Ward.
        """
        # Ward 14: Madhurawada & Coastal Belt (Lat 17.76 ~ 17.82)
        if lat >= 17.75:
            return {
                "wardId": 14,
                "wardName": "Ward 14 (Madhurawada & Coastal)",
                "zoneName": "Zone 2",
                "wardEngineer": "Er. K. Ramesh Naidu",
                "phone": "+91 94401 55672",
            }
        # Ward 18: AU South Campus & Siripuram (Lon <= 83.33)
        elif lon <= 83.33:
            return {
                "wardId": 18,
                "wardName": "Ward 18 (AU South Campus & Siripuram)",
                "zoneName": "Zone 2",
                "wardEngineer": "Smt. D. Sunitha Kumari",
                "phone": "+91 94411 77889",
            }
        # Ward 12: Peda Waltair & Lawson's Bay
        else:
            return {
                "wardId": 12,
                "wardName": "Ward 12 (Peda Waltair & Lawson’s Bay)",
                "zoneName": "Zone 2",
                "wardEngineer": "M. Chenna Rao",
                "phone": "+91 98850 11223",
            }
