"""
50-Meter Spatial Deduplication Service.
Calculates geographic distance and evaluates cluster merging.
"""

import math
from typing import Tuple, Optional, Dict, Any


def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes exact Great-Circle distance in meters between two WGS-84 points.
    Matches PostGIS ST_Distance(geography, geography) behavior.
    """
    R = 6371000.0  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


class SpatialDedupService:
    THRESHOLD_METERS: float = 50.0

    @classmethod
    def check_deduplication(
        cls,
        new_category: str,
        new_lat: float,
        new_lon: float,
        existing_tickets: list,
    ) -> Tuple[bool, Optional[Dict[str, Any]], Optional[float]]:
        """
        Scans active tickets for same category within 50m.
        Returns: (is_duplicate, matched_ticket, distance_meters)
        """
        closest_ticket = None
        min_distance = float("inf")

        for ticket in existing_tickets:
            # Skip resolved/closed tickets
            stage = ticket.get("currentStage", "")
            if stage in ("resolved", "closed", "rejected"):
                continue

            # Must match category
            if ticket.get("category") != new_category:
                continue

            coords = ticket.get("coordinates", {})
            t_lat = coords.get("latitude")
            t_lon = coords.get("longitude")
            if t_lat is None or t_lon is None:
                continue

            distance = haversine_distance_meters(new_lat, new_lon, t_lat, t_lon)
            if distance <= cls.THRESHOLD_METERS and distance < min_distance:
                min_distance = distance
                closest_ticket = ticket

        if closest_ticket:
            return True, closest_ticket, round(min_distance, 1)

        return False, None, None
