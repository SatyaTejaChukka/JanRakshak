// Pure business logic: 50m spatial distance calculation (Haversine formula),
// spatial deduplication checking, shelter occupancy calculations, and ticket status progression.

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

/**
 * Calculates distance in meters between two lat/lng points using Haversine formula
 */
export function calculateDistanceMeters(point1: GeoLocation, point2: GeoLocation): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (point1.latitude * Math.PI) / 180;
  const phi2 = (point2.latitude * Math.PI) / 180;
  const deltaPhi = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const deltaLambda = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 10) / 10;
}

/**
 * Checks if a new incident defect is within 50 meters of an existing ticket of the same category
 */
export function checkSpatialDeduplication(
  newPoint: GeoLocation,
  category: string,
  existingReports: Array<{ id: string; location: GeoLocation; category: string; primaryTicketId?: string }>
): { isDuplicate: boolean; parentTicketId?: string; duplicateId?: string; distanceMeters?: number } {
  const THRESHOLD_METERS = 50;

  for (const report of existingReports) {
    if (report.category.toLowerCase() === category.toLowerCase()) {
      const dist = calculateDistanceMeters(newPoint, report.location);
      if (dist <= THRESHOLD_METERS) {
        const pId = report.primaryTicketId || report.id;
        return {
          isDuplicate: true,
          parentTicketId: pId,
          duplicateId: pId,
          distanceMeters: dist,
        };
      }
    }
  }

  return { isDuplicate: false };
}

/**
 * Calculates shelter remaining capacity and occupancy percentage
 */
export function calculateShelterCapacity(currentOccupants: number, totalCapacity: number) {
  const safeCapacity = Math.max(totalCapacity, 1);
  const occupancyRate = Math.min(100, Math.round((currentOccupants / safeCapacity) * 100));
  const remainingSlots = Math.max(0, totalCapacity - currentOccupants);
  const isSurgeAlert = occupancyRate >= 85;
  const isFull = remainingSlots === 0;

  return {
    occupancyRate,
    remainingSlots,
    isSurgeAlert,
    isFull,
  };
}

/**
 * 5-Stage Ticket Workflow definition and validation
 */
export const TICKET_STAGES = [
  { step: 1, id: 'submitted', title: 'Citizen Reported', description: 'GPS Geotagged with AI Computer Vision classification' },
  { step: 2, id: 'deduplicated', title: 'Spatial Verified & Merged', description: '50m radius clustering & deduplication engine passed' },
  { step: 3, id: 'assigned', title: 'Assigned to Ward Engineer', description: 'Dispatched to Municipal Field Crew Unit' },
  { step: 4, id: 'in_progress', title: 'On-Site Repair Execution', description: 'Field worker checked in via GPS geofence with materials' },
  { step: 5, id: 'resolved', title: 'Geo-Verification & Closed', description: 'Before/After dual photographic inspection verified' },
] as const;

export function getStageProgress(currentStageId: string): number {
  const index = TICKET_STAGES.findIndex((s) => s.id === currentStageId);
  if (index === -1) return 20;
  return Math.round(((index + 1) / TICKET_STAGES.length) * 100);
}
