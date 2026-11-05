/**
 * JanRakshak Unified API Client.
 * Connects the React PWA frontend to the FastAPI + PostGIS backend.
 * Provides seamless offline / mock fallback if the backend server is unreachable.
 */

import {
  Ticket,
  ElderProfile,
  Shelter,
  HazardIncident,
  VolunteerApplication,
  ActiveVolunteer,
  MunicipalOfficer,
} from '../types';

const API_BASE = '/api/v1';

async function safeFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[JanRakshak API] Falling back to local state for ${endpoint}:`, error);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

export const JanRakshakAPI = {
  // --- Civic Tickets ---
  async getTickets(category?: string, stage?: string, search?: string): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (stage && stage !== 'All') params.append('stage', stage);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return safeFetch<Ticket[]>(`/tickets${query}`);
  },

  async createTicket(payload: Partial<Ticket>): Promise<Ticket> {
    return safeFetch<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async checkSpatialDedup(
    category: string,
    coordinates: { latitude: number; longitude: number }
  ): Promise<{ isDuplicate: boolean; existingTicketId?: string; distanceMeters?: number; message: string }> {
    return safeFetch('/tickets/check-dedup', {
      method: 'POST',
      body: JSON.stringify({ category, coordinates }),
    });
  },

  async updateTicketStage(ticketId: string, stage: Ticket['currentStage']): Promise<Ticket> {
    return safeFetch<Ticket>(`/tickets/${ticketId}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    });
  },

  async assignOfficer(ticketId: string, officerId: string, targetSlaHours = 48): Promise<Ticket> {
    return safeFetch<Ticket>(`/tickets/${ticketId}/assign-officer`, {
      method: 'POST',
      body: JSON.stringify({ officerId, targetSlaHours }),
    });
  },

  async auditPhotoProof(ticketId: string, decision: 'APPROVE' | 'REJECT', reason?: string): Promise<Ticket> {
    return safeFetch<Ticket>(`/tickets/${ticketId}/audit`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason }),
    });
  },

  // --- Municipal Officers ---
  async getOfficers(): Promise<MunicipalOfficer[]> {
    return safeFetch<MunicipalOfficer[]>('/officers');
  },

  // --- Disaster & Emergency SOS ---
  async triggerSOS(payload: { triggerType?: string; batteryPercentage?: number }): Promise<any> {
    return safeFetch('/sos/trigger', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getElderProfile(): Promise<ElderProfile> {
    return safeFetch<ElderProfile>('/sos/elder-profile');
  },

  async updateElderProfile(profile: ElderProfile): Promise<ElderProfile> {
    return safeFetch<ElderProfile>('/sos/elder-profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  async getProximityVolunteers(): Promise<any[]> {
    return safeFetch('/sos/proximity-volunteers');
  },

  // --- Shelters & Hazards ---
  async getShelters(): Promise<Shelter[]> {
    return safeFetch<Shelter[]>('/shelters');
  },

  async updateShelterOccupancy(shelterId: string, delta: number): Promise<Shelter> {
    return safeFetch<Shelter>(`/shelters/${shelterId}/occupancy`, {
      method: 'PATCH',
      body: JSON.stringify({ delta }),
    });
  },

  async getHazards(): Promise<HazardIncident[]> {
    return safeFetch<HazardIncident[]>('/hazards');
  },

  // --- Civilian Volunteer Corps ---
  async getVolunteerApplications(statusFilter?: string): Promise<VolunteerApplication[]> {
    const query = statusFilter && statusFilter !== 'All' ? `?status_filter=${statusFilter}` : '';
    return safeFetch<VolunteerApplication[]>(`/volunteers/applications${query}`);
  },

  async submitVolunteerApplication(app: Partial<VolunteerApplication>): Promise<VolunteerApplication> {
    return safeFetch<VolunteerApplication>('/volunteers/applications', {
      method: 'POST',
      body: JSON.stringify(app),
    });
  },

  async approveVolunteerApplication(appId: string): Promise<ActiveVolunteer> {
    return safeFetch<ActiveVolunteer>(`/volunteers/applications/${appId}/approve`, {
      method: 'POST',
    });
  },

  async rejectVolunteerApplication(appId: string): Promise<{ message: string }> {
    return safeFetch(`/volunteers/applications/${appId}/reject`, {
      method: 'POST',
    });
  },

  async getActiveVolunteers(statusFilter?: string, ward?: string): Promise<ActiveVolunteer[]> {
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'All') params.append('status_filter', statusFilter);
    if (ward && ward !== 'All') params.append('ward', ward);
    const query = params.toString() ? `?${params.toString()}` : '';
    return safeFetch<ActiveVolunteer[]>(`/volunteers/active${query}`);
  },

  async directOnboardVolunteer(payload: Partial<ActiveVolunteer>): Promise<ActiveVolunteer> {
    return safeFetch<ActiveVolunteer>('/volunteers/direct', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async dispatchVolunteer(volunteerId: string, incidentId: string, targetStatus = 'En Route'): Promise<ActiveVolunteer> {
    return safeFetch<ActiveVolunteer>(`/volunteers/${volunteerId}/dispatch`, {
      method: 'POST',
      body: JSON.stringify({ incidentId, targetStatus }),
    });
  },

  // --- System Mode & Telemetry ---
  async getSystemTelemetry(): Promise<any> {
    return safeFetch('/system/telemetry');
  },

  async toggleSystemMode(isDisasterMode: boolean): Promise<any> {
    return safeFetch('/system/mode', {
      method: 'POST',
      body: JSON.stringify({ isDisasterMode }),
    });
  },

  // --- Aadhaar OTP Authentication (Hackathon UIDAI Simulation Gateway) ---
  async generateAadhaarOtp(payload: {
    aadhaar_number: string;
    mobile_number: string;
    full_name?: string;
    ward?: string;
  }): Promise<{
    client_id: string;
    otp_sent: boolean;
    valid_seconds: number;
    masked_mobile: string;
    masked_aadhaar: string;
    simulated_sms: string;
    debug_otp: string;
  }> {
    const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const fallbackClientId = `AADH-LOCAL-${Date.now().toString().slice(-6)}`;
    return safeFetch(
      '/auth/aadhaar/generate-otp',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      {
        client_id: fallbackClientId,
        otp_sent: true,
        valid_seconds: 600,
        masked_mobile: `+91 XXXXX ${payload.mobile_number.slice(-4)}`,
        masked_aadhaar: `XXXX-XXXX-${payload.aadhaar_number.replace(/\D/g, '').slice(-4)}`,
        simulated_sms: `[UIDAI] Your Aadhaar e-KYC OTP for JanRakshak registration is ${fallbackOtp}. Valid for 10 minutes. Do not share.`,
        debug_otp: fallbackOtp,
      }
    );
  },

  async verifyAadhaarOtp(payload: {
    client_id: string;
    otp: string;
    full_name?: string;
    mobile_number?: string;
    ward?: string;
  }): Promise<{
    verified: boolean;
    token: string;
    citizen: any;
    message: string;
  }> {
    return safeFetch(
      '/auth/aadhaar/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      {
        verified: true,
        token: `session_fallback_${Date.now()}`,
        citizen: {
          id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
          fullName: payload.full_name || 'K. Satyanarayana',
          mobileNumber: `+91 ${payload.mobile_number || '9848012345'}`,
          aadhaarNumber: 'XXXX-XXXX-1092',
          ward: payload.ward || 'Ward 14 (Madhurawada & Coastal Belt)',
          isVerified: true,
          registeredAt: 'Just Now',
        },
        message: 'Aadhaar e-KYC demographic verification authenticated successfully.',
      }
    );
  },
};
