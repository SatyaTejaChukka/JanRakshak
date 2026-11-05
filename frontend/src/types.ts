export type ScreenId =
  | 'citizen_home_normal'
  | 'citizen_home_disaster'
  | 'elder_sos_trigger'
  | 'volunteer_proximity'
  | 'spatial_dedup_notice'
  | 'ndrf_dispatcher_dashboard'
  | 'field_worker_checkin'
  | 'district_collector_switcher'
  | 'hazard_navigation_map'
  | 'camera_defect_capture'
  | 'elder_profile_setup'
  | 'public_ticket_stepper'
  | 'cyclone_shelter_capacity';

export interface Ticket {
  id: string;
  category: 'Pothole & Craters' | 'Drainage Block' | 'Fallen Tree & Power Line' | 'Streetlight Outage' | 'Structural Crack';
  title: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
  reportedAt: string;
  currentStage: 'submitted' | 'deduplicated' | 'assigned' | 'in_progress' | 'resolved';
  citizenName: string;
  citizenPhone: string;
  mergedCount: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  assignedCrew?: {
    workerName: string;
    unitId: string;
    phone: string;
    checkedInTime?: string;
  };
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export interface ElderProfile {
  id: string;
  fullName: string;
  age: number;
  ward: string;
  address: string;
  criticalNeeds: string[]; // e.g. "Oxygen Concentrator", "Wheelchair Mobility", "Insulin Cold Storage", "Cardiac Pacemaker"
  emergencyContacts: Array<{ name: string; relation: string; phone: string }>;
  floorLevel: string;
  evacuationDifficulty: 'High' | 'Medium' | 'Low';
  proximityVolunteerCount: number;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  totalCapacity: number;
  currentOccupants: number;
  amenities: string[];
  medicalOfficer: string;
  contactNumber: string;
  waterSupplyStatus: 'Abundant' | 'Moderate' | 'Critical';
  generatorStatus: 'Operational' | 'Standby' | 'Offline';
  safeRouteStatus: 'Clear & Elevated' | 'Caution - Waterlogged' | 'Inaccessible';
}

export interface HazardIncident {
  id: string;
  type: 'Road Waterlogging' | 'Fallen High-Tension Wire' | 'Uprooted Banyan Tree' | 'Embankment Breach' | 'Debris Barrier';
  coordinates: { x: number; y: number }; // normalized 0-100 on schematic map
  severity: 'Extreme' | 'High' | 'Moderate';
  reportedAt: string;
  recommendedAction: string;
  isEvacuationRouteImpacted: boolean;
}
