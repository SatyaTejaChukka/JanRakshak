"""
Mode-Adaptive SLA Engine.
Calculates target resolution hours based on Category and Operating Mode.
"""

from typing import Dict


class SLAEngine:
    # Mode-dependent SLA Matrix in Hours
    SLA_MATRIX: Dict[str, Dict[str, int]] = {
        "Pothole & Craters": {
            "NORMAL": 48,
            "DISASTER": 6,
        },
        "Drainage Block": {
            "NORMAL": 24,
            "DISASTER": 4,
        },
        "Fallen Tree & Power Line": {
            "NORMAL": 12,
            "DISASTER": 2,
        },
        "Streetlight Outage": {
            "NORMAL": 72,
            "DISASTER": 12,
        },
        "Structural Crack": {
            "NORMAL": 48,
            "DISASTER": 8,
        },
    }

    @classmethod
    def get_target_hours(cls, category: str, operating_mode: str = "NORMAL") -> int:
        cat_slas = cls.SLA_MATRIX.get(category, {"NORMAL": 48, "DISASTER": 6})
        return cat_slas.get(operating_mode.upper(), 48)
