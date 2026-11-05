export type UserRole = 'CITIZEN' | 'GVMC_ADMIN' | 'NDRF_ADMIN';

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
  | 'cyclone_shelter_capacity'
  | 'gvmc_admin_dashboard'
  | 'volunteer_interest_form'
  | 'ndrf_volunteer_hub';

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
  criticalNeeds: string[];
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
  coordinates: { x: number; y: number };
  severity: 'Extreme' | 'High' | 'Moderate';
  reportedAt: string;
  recommendedAction: string;
  isEvacuationRouteImpacted: boolean;
}

export interface VolunteerApplication {
  id: string;
  fullName: string;
  phone: string;
  govtIdType: 'Aadhaar' | 'Voter ID' | 'Driving License';
  govtIdNumber: string;
  ward: string;
  address: string;
  skills: string[];
  equipmentAvailable: string[];
  availability: 'Immediate (24x7)' | 'Daytime Only' | 'Standby';
  bloodGroup: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  reviewedBy?: string;
}

export interface ActiveVolunteer {
  id: string;
  name: string;
  phone: string;
  ward: string;
  distanceMeters?: number;
  role: string;
  equipment: string;
  skills: string[];
  status: 'Available' | 'En Route' | 'On-Scene' | 'Standby';
  isVerifiedByNDRF: boolean;
  assignedIncidentId?: string;
  onboardedBy: 'PUBLIC_APPLICATION' | 'NDRF_DIRECT_ENTRY';
}

export interface MunicipalOfficer {
  id: string;
  name: string;
  department: 'Road Infrastructure' | 'Drainage & Stormwater' | 'Electrical (APEPDCL)' | 'Sanitation & Health';
  ward: string;
  designation: string;
  phone: string;
  activeWorkloadCount: number;
  status: 'On Duty' | 'On Site' | 'Off Duty';
}
