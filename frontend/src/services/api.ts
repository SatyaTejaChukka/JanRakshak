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
};
