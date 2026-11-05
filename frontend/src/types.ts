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
  | 'ndrf_volunteer_hub'
  | 'user_account';

export interface UserProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  aadhaarNumber: string;
  ward: string;
  isVerified: boolean;
  registeredAt: string;
}

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
  targetSlaHours?: number;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  targetSlaHours?: number;
}

export interface EmergencyBroadcast {
  id: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'ADVISORY';
  targetZone: string;
  senderName: string;
  timestamp: string;
  channel: string;
  dispatchedToCitizens?: boolean;
  dispatchedToFieldResponders?: boolean;
  activeUserAlertCount?: number;
}

export interface SOSIncident {
  id: string;
  priority: string;
  elderName: string;
  location: string;
  details: string;
  assignedUnit: string;
  status: string;
  timestamp: string;
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
  coordinates: { latitude: number; longitude: number };
}

export interface HazardIncident {
  id: string;
  type: 'Road Waterlogging' | 'Fallen High-Tension Wire' | 'Uprooted Banyan Tree' | 'Embankment Breach' | 'Debris Barrier';
  coordinates: { x: number; y: number; latitude?: number; longitude?: number };
  latitude?: number;
  longitude?: number;
  affectedRoad?: string;
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

export interface ToastNotification {
  id: string;
  type: 'success' | 'alert' | 'info';
  title: string;
  message: string;
}
