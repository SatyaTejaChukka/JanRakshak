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
