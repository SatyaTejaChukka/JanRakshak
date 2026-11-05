import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceMeters, checkSpatialDeduplication, calculateShelterCapacity, getStageProgress } from './logic';

test('calculateDistanceMeters accurately computes small geographic offsets', () => {
  // Coordinates approx 35 meters apart
  const p1 = { latitude: 17.6868, longitude: 83.2185 };
  const p2 = { latitude: 17.6870, longitude: 83.2187 };
  const dist = calculateDistanceMeters(p1, p2);
  assert.ok(dist > 0 && dist < 60, `Distance should be ~30-40m, got ${dist}`);
});

test('checkSpatialDeduplication flags reports within 50 meters with same category', () => {
  const existing = [
    {
      id: 'TKT-8902',
      location: { latitude: 17.6868, longitude: 83.2185 },
      category: 'Pothole & Craters',
    },
  ];

  // Point ~25m away with matching category
  const newPoint = { latitude: 17.6869, longitude: 83.2186 };
  const res = checkSpatialDeduplication(newPoint, 'Pothole & Craters', existing);
  assert.equal(res.isDuplicate, true);
  assert.equal(res.parentTicketId, 'TKT-8902');
  assert.equal(res.duplicateId, 'TKT-8902');
  assert.ok(res.distanceMeters! <= 50);

  // Different category should NOT deduplicate even if close
  const resDiffCat = checkSpatialDeduplication(newPoint, 'Streetlight Failure', existing);
  assert.equal(resDiffCat.isDuplicate, false);
});

test('calculateShelterCapacity returns correct occupancy rate and alerts', () => {
  const normal = calculateShelterCapacity(500, 1000);
  assert.equal(normal.occupancyRate, 50);
  assert.equal(normal.remainingSlots, 500);
  assert.equal(normal.isSurgeAlert, false);

  const surge = calculateShelterCapacity(880, 1000);
  assert.equal(surge.occupancyRate, 88);
  assert.equal(surge.remainingSlots, 120);
  assert.equal(surge.isSurgeAlert, true);
});

test('getStageProgress computes accurate percentage', () => {
  assert.equal(getStageProgress('submitted'), 20);
  assert.equal(getStageProgress('assigned'), 60);
  assert.equal(getStageProgress('resolved'), 100);
});

test('isTicketRoadBlocking accurately identifies critical road obstructions', async () => {
  const { isTicketRoadBlocking } = await import('./routingEngine');

  const criticalPothole: any = {
    id: 'TKT-8902',
    category: 'Pothole & Craters',
    title: 'Severe 4ft Crater on Beach Road',
    severity: 'High',
    currentStage: 'in_progress',
  };
  assert.equal(isTicketRoadBlocking(criticalPothole), true);

  const minorLight: any = {
    id: 'TKT-8910',
    category: 'Streetlight Outage',
    title: 'Flickering bulb',
    severity: 'Low',
    currentStage: 'submitted',
  };
  assert.equal(isTicketRoadBlocking(minorLight), false);

  const resolvedPothole: any = {
    id: 'TKT-8902',
    category: 'Pothole & Craters',
    title: 'Severe 4ft Crater on Beach Road',
    severity: 'High',
    currentStage: 'resolved',
  };
  assert.equal(isTicketRoadBlocking(resolvedPothole), false);
});

test('detectRoadblocksOnRoute detects tickets intersecting route within proximity buffer', async () => {
  const { detectRoadblocksOnRoute } = await import('./routingEngine');

  // Straight line route from (17.7120, 83.3200) to (17.7200, 83.3200)
  const polyline: [number, number][] = [
    [17.7120, 83.3200],
    [17.7160, 83.3200],
    [17.7200, 83.3200],
  ];

  // Ticket right beside the segment (~20m offset in longitude)
  const blockingTicket: any = {
    id: 'TKT-8902',
    category: 'Pothole & Craters',
    title: 'Severe 4ft Crater on Beach Road',
    severity: 'High',
    coordinates: { latitude: 17.7160, longitude: 83.3202 },
    currentStage: 'in_progress',
  };

  const detected = detectRoadblocksOnRoute(polyline, [blockingTicket], [], 90);
  assert.equal(detected.length, 1);
  assert.equal(detected[0].id, 'TKT-8902');
  assert.ok(detected[0].distanceToRouteMeters < 35);
});

test('calculateDetourWaypoint calculates a safe inland offset away from hazard', async () => {
  const { calculateDetourWaypoint } = await import('./routingEngine');

  const origin = { latitude: 17.7126, longitude: 83.3195 };
  const destination = { latitude: 17.7295, longitude: 83.3225 };
  const blocker = { latitude: 17.7180, longitude: 83.3210 };

  const detour = calculateDetourWaypoint(origin, destination, blocker);
  // Detour longitude should be shifted inland (westward: smaller longitude)
  assert.ok(detour.longitude < blocker.longitude);
});

