"""
Unit tests verifying spatial deduplication formulas and ward boundary checks using Shapely.
"""

import math
import pytest
from shapely.geometry import Point, Polygon, MultiPolygon


def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes exact Great-Circle distance in meters between two WGS-84 points."""
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


def test_spatial_deduplication_50m_threshold():
    """Verify reports within 50m are flagged as duplicates and beyond 50m as independent."""
    # Defect Centroid on Beach Road, Visakhapatnam: (17.7412, 83.3421)
    master_lat, master_lon = 17.7412, 83.3421

    # Citizen report 1: ~18 meters away
    nearby_lat, nearby_lon = 17.7413, 83.3422
    dist1 = haversine_distance_meters(master_lat, master_lon, nearby_lat, nearby_lon)
    assert dist1 < 50.0, f"Expected < 50m, got {dist1}m"

    # Citizen report 2: ~120 meters away (should NOT deduplicate)
    distant_lat, distant_lon = 17.7422, 83.3429
    dist2 = haversine_distance_meters(master_lat, master_lon, distant_lat, distant_lon)
    assert dist2 > 50.0, f"Expected > 50m, got {dist2}m"


def test_ward_point_in_polygon_containment():
    """Verify ST_Contains administrative ward routing using Shapely polygons."""
    # Define Ward 14 Madhurawada Polygon: bounding 83.33~83.37 Lon, 17.76~17.82 Lat
    ward14_poly = Polygon([
        (83.33, 17.76),
        (83.37, 17.76),
        (83.37, 17.82),
        (83.33, 17.82),
        (83.33, 17.76),
    ])

    # Point inside Ward 14 (Madhurawada IT SEZ)
    inside_pt = Point(83.350, 17.780)
    assert ward14_poly.contains(inside_pt) is True

    # Point outside Ward 14 (Gajuwaka Industrial Belt)
    outside_pt = Point(83.210, 17.690)
    assert ward14_poly.contains(outside_pt) is False

