/**
 * JanRakshak — Dual-Mode Civic & Disaster Management Platform
 * Unified Desktop & Mobile Web Application Shell with RBAC
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ScreenId,
  UserRole,
  Ticket,
  ElderProfile,
  Shelter,
  HazardIncident,
  VolunteerApplication,
  ActiveVolunteer,
  MunicipalOfficer,
  UserProfile,
  ToastNotification,
  EmergencyBroadcast,
  LiveGPSLocation,
  GPSFixStatus,
} from './types';
import { isUserTicketOwner } from './utils/logic';
import { UserAccountModal } from './components/UserAccountModal';
import { LiveGPSPromptModal } from './components/LiveGPSPromptModal';
import {
  INITIAL_TICKETS,
  INITIAL_ELDER_PROFILE,
  INITIAL_SHELTERS,
  INITIAL_HAZARDS,
  INITIAL_VOLUNTEER_APPLICATIONS,
  INITIAL_ACTIVE_VOLUNTEERS,
  INITIAL_MUNICIPAL_OFFICERS,
} from './data/seedData';
import { Navbar } from './components/Navbar';
import { CitizenHomeNormal } from './components/CitizenHomeNormal';
import { CitizenHomeDisaster } from './components/CitizenHomeDisaster';
import { ElderSOSTrigger } from './components/ElderSOSTrigger';
import { VolunteerProximity } from './components/VolunteerProximity';
import { SpatialDedupNotice } from './components/SpatialDedupNotice';
import { NDRFDispatcherDashboard } from './components/NDRFDispatcherDashboard';
import { FieldWorkerCheckin } from './components/FieldWorkerCheckin';
import { DistrictCollectorSwitcher } from './components/DistrictCollectorSwitcher';
import { HazardNavigationMap } from './components/HazardNavigationMap';
import { CitizenCameraDefectCapture } from './components/CitizenCameraDefectCapture';
import { ElderProfileSetup } from './components/ElderProfileSetup';
import { PublicTicketStepper } from './components/PublicTicketStepper';
import { CycloneReliefShelter } from './components/CycloneReliefShelter';
import { GVMCAdminDashboard } from './components/GVMCAdminDashboard';
import { NDRFVolunteerManagement } from './components/NDRFVolunteerManagement';
import { VolunteerInterestForm } from './components/VolunteerInterestForm';
import { CitizenAuthDashboard } from './components/CitizenAuthDashboard';
import { OfficialPersonnelAuth } from './components/OfficialPersonnelAuth';
import { JanRakshakAPI } from './services/api';
import {
  Home,
  Camera,
  Layers,
  CheckCircle2,
  HardHat,
  Flame,
  AlertOctagon,
  Users,
  HeartHandshake,
  LifeBuoy,
  Radio,
  Compass,
  ShieldCheck,
  Activity,
  Wind,
  Waves,
  Building2,
  User,
  ShieldAlert,
  X,
  Info,
  Check,
  LogOut,
  LocateFixed,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('janrakshak_citizen_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return {
          id: parsed.id || 'USR-CITIZEN',
          fullName: parsed.fullName || 'Verified Citizen',
          mobileNumber: parsed.mobileNumber || '+91 98480 12345',
          aadhaarNumber: parsed.aadhaarNumber || 'XXXX-XXXX-1092',
          ward: parsed.ward || 'Ward 14 (Madhurawada & Coastal Belt)',
          isVerified: Boolean(parsed.isVerified ?? true),
          registeredAt: parsed.registeredAt || 'Today',
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [officialSession, setOfficialSession] = useState<{
    role: UserRole;
    name: string;
    id: string;
    designation: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('janrakshak_official_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showOfficialPortal, setShowOfficialPortal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.search.includes('portal=official') ||
        window.location.search.includes('admin=true') ||
        window.location.hash === '#official'
      );
    }
    return false;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const official = localStorage.getItem('janrakshak_official_session');
      if (official) {
        const parsed = JSON.parse(official);
        if (parsed.role === 'GVMC_ADMIN' || parsed.role === 'NDRF_ADMIN') {
          return parsed.role;
        }
      }
    } catch {}
    return 'CITIZEN';
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    try {
      const official = localStorage.getItem('janrakshak_official_session');
      if (official) {
        const parsed = JSON.parse(official);
        if (parsed.role === 'GVMC_ADMIN') return 'gvmc_admin_dashboard';
        if (parsed.role === 'NDRF_ADMIN') return 'ndrf_dispatcher_dashboard';
      }
    } catch {}
    return 'citizen_home_normal';
  });

  const [isDisasterMode, setIsDisasterMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Data states
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    return INITIAL_TICKETS.map((t) => {
      try {
        const storedBefore = localStorage.getItem(`janrakshak_photo_before_${t.id}`);
        const storedAfter = localStorage.getItem(`janrakshak_photo_after_${t.id}`);
        return {
          ...t,
          beforeImageUrl: storedBefore || t.beforeImageUrl,
          afterImageUrl: storedAfter || t.afterImageUrl,
        };
      } catch {
        return t;
      }
    });
  });
  const [elderProfile, setElderProfile] = useState<ElderProfile>(INITIAL_ELDER_PROFILE);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [hazards, setHazards] = useState<HazardIncident[]>(INITIAL_HAZARDS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [selectedShelterForNavigation, setSelectedShelterForNavigation] = useState<string>('SHL-01');
  const [volunteerApplications, setVolunteerApplications] = useState<VolunteerApplication[]>(
    INITIAL_VOLUNTEER_APPLICATIONS
  );
  const [activeVolunteers, setActiveVolunteers] = useState<ActiveVolunteer[]>(
    INITIAL_ACTIVE_VOLUNTEERS
  );
  const [municipalOfficers, setMunicipalOfficers] = useState<MunicipalOfficer[]>(
    INITIAL_MUNICIPAL_OFFICERS
  );
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);

  // Synchronize state with backend API on mount
  useEffect(() => {
    JanRakshakAPI.getTickets()
      .then((data) => {
        if (data && data.length > 0) {
          const hydrated = data.map((t) => {
            try {
              const storedBefore = localStorage.getItem(`janrakshak_photo_before_${t.id}`);
              const storedAfter = localStorage.getItem(`janrakshak_photo_after_${t.id}`);
              return {
                ...t,
                beforeImageUrl: storedBefore || t.beforeImageUrl,
                afterImageUrl: storedAfter || t.afterImageUrl,
              };
            } catch {
              return t;
            }
          });
          setTickets(hydrated);
        }
      })
      .catch(() => {});

    JanRakshakAPI.getShelters()
      .then((data) => {
        if (data && data.length > 0) setShelters(data);
      })
      .catch(() => {});

    JanRakshakAPI.getOfficers()
      .then((data) => {
        if (data && data.length > 0) setMunicipalOfficers(data);
      })
      .catch(() => {});

    JanRakshakAPI.getActiveVolunteers()
      .then((data) => {
        if (data && data.length > 0) setActiveVolunteers(data);
      })
      .catch(() => {});

    JanRakshakAPI.getVolunteerApplications()
      .then((data) => {
        if (data && data.length > 0) setVolunteerApplications(data);
      })
      .catch(() => {});
  }, []);

  // Real-Time Emergency Broadcast Alert state across all connected citizens & users
  const [activeEmergencyBroadcast, setActiveEmergencyBroadcast] = useState<EmergencyBroadcast | null>(null);

  useEffect(() => {
    // 1. Fetch any recently published active emergency broadcast from backend
    JanRakshakAPI.getEmergencyBroadcasts()
      .then((res) => {
        if (res && res.length > 0) {
          setActiveEmergencyBroadcast(res[0]);
        }
      })
      .catch(() => {});

    // 2. Local storage initial check
    try {
      const raw = localStorage.getItem('janrakshak_emergency_broadcasts');
      if (raw) {
        const list = JSON.parse(raw);
        if (list && list.length > 0) {
          setActiveEmergencyBroadcast(list[0]);
        }
      }
    } catch {}

    // 3. Connect real-time cross-tab / cross-window BroadcastChannel mesh
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('janrakshak_emergency_mesh');
        bc.onmessage = (event) => {
          if (event.data?.type === 'EMERGENCY_BROADCAST') {
            const bcData = event.data.data;
            setActiveEmergencyBroadcast(bcData);
            showToast('alert', `EMERGENCY BROADCAST: ${bcData.title}`, bcData.message);

            // Play emergency tone & vibrate
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(880, audioCtx.currentTime);
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime + 0.15);
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.5);
            } catch {}

            if ('vibrate' in navigator) {
              navigator.vibrate([400, 150, 400]);
            }
          }
        };
      }
    } catch (e) {
      console.warn('[JanRakshak Mesh] BroadcastChannel setup error:', e);
    }

    return () => {
      bc?.close();
    };
  }, []);

  // --------------------------------------------------------------------------
  // Continuous Real-Time User GPS Tracking & Authorization Engine
  // --------------------------------------------------------------------------
  const [liveLocation, setLiveLocation] = useState<LiveGPSLocation | null>(() => {
    try {
      const cached = localStorage.getItem('janrakshak_live_user_coordinates');
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });
  const [gpsStatus, setGpsStatus] = useState<GPSFixStatus>('INITIALIZING');
  const [showGpsModal, setShowGpsModal] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);

  const startContinuousLocationWatch = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGpsStatus('UNSUPPORTED');
      return;
    }

    setGpsStatus('REQUESTING');

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const loc: LiveGPSLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: pos.timestamp || Date.now(),
          source: 'GPS_HARDWARE',
        };
        setLiveLocation(loc);
        setGpsStatus('LOCKED');
        try {
          localStorage.setItem('janrakshak_live_user_coordinates', JSON.stringify(loc));
        } catch {}
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('DENIED');
          setShowGpsModal(true);
        } else {
          console.warn('[JanRakshak GPS] Watch error:', err.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 3000,
      }
    );

    watchIdRef.current = id;
  }, []);

  // Request GPS immediately when the application opens
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (result.state === 'prompt') {
            setShowGpsModal(true);
          } else if (result.state === 'denied') {
            setGpsStatus('DENIED');
            setShowGpsModal(true);
          }
        })
        .catch(() => {
          setShowGpsModal(true);
        });
    } else {
      setShowGpsModal(true);
    }

    startContinuousLocationWatch();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startContinuousLocationWatch]);

  const handleSetManualLocation = (lat: number, lng: number) => {
    const manualLoc: LiveGPSLocation = {
      latitude: lat,
      longitude: lng,
      accuracy: 5,
      timestamp: Date.now(),
      source: 'MANUAL',
    };
    setLiveLocation(manualLoc);
    setGpsStatus('LOCKED');
    try {
      localStorage.setItem('janrakshak_live_user_coordinates', JSON.stringify(manualLoc));
    } catch {}
    showToast('success', 'Location Locked', `Position set to ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
  };


  // Navigation History Stack & Intake Category State
  const [navigationHistory, setNavigationHistory] = useState<ScreenId[]>([]);
  const [activeCategoryForIntake, setActiveCategoryForIntake] = useState<Ticket['category'] | undefined>(undefined);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (type: 'success' | 'alert' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastNotification = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role-Based Screen Whitelists (Strict RBAC Boundary)
  const CITIZEN_ALLOWED_SCREENS: ScreenId[] = [
    'citizen_home_normal',
    'citizen_home_disaster',
    'camera_defect_capture',
    'public_ticket_stepper',
    'spatial_dedup_notice',
    'cyclone_shelter_capacity',
    'elder_sos_trigger',
    'volunteer_proximity',
    'volunteer_interest_form',
    'elder_profile_setup',
    'hazard_navigation_map',
  ];

  const GVMC_ADMIN_ALLOWED_SCREENS: ScreenId[] = [
    'gvmc_admin_dashboard',
    'public_ticket_stepper',
    'camera_defect_capture',
    'hazard_navigation_map',
    'field_worker_checkin',
    'cyclone_shelter_capacity',
    'spatial_dedup_notice',
    'district_collector_switcher',
  ];

  const NDRF_ADMIN_ALLOWED_SCREENS: ScreenId[] = [
    'ndrf_dispatcher_dashboard',
    'ndrf_volunteer_hub',
    'volunteer_proximity',
    'cyclone_shelter_capacity',
    'hazard_navigation_map',
    'elder_sos_trigger',
    'elder_profile_setup',
    'district_collector_switcher',
  ];

  const handleNavigate = (screen: ScreenId, category?: Ticket['category']) => {
    // Strict Role-Based Access Control (RBAC) Guard
    if (currentRole === 'CITIZEN' && !CITIZEN_ALLOWED_SCREENS.includes(screen)) {
      showToast(
        'alert',
        'Restricted Official Area',
        'Access to municipal engineering or military tactical consoles requires authorized official clearance.'
      );
      return;
    }
    if (currentRole === 'GVMC_ADMIN' && !GVMC_ADMIN_ALLOWED_SCREENS.includes(screen)) {
      showToast('info', 'Zonal Works Scope', 'Navigating within GVMC Municipal Works jurisdiction.');
      setCurrentScreen('gvmc_admin_dashboard');
      return;
    }
    if (currentRole === 'NDRF_ADMIN' && !NDRF_ADMIN_ALLOWED_SCREENS.includes(screen)) {
      showToast('info', 'Tactical Scope', 'Navigating within NDRF 10th Battalion War Room jurisdiction.');
      setCurrentScreen('ndrf_dispatcher_dashboard');
      return;
    }

    if (category) {
      setActiveCategoryForIntake(category);
    }
    if (currentScreen !== screen) {
      setNavigationHistory((prev) => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
    if (currentRole === 'CITIZEN') {
      if (screen === 'citizen_home_disaster') {
        setIsDisasterMode(true);
      } else if (screen === 'citizen_home_normal') {
        setIsDisasterMode(false);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    const isAllowedForRole = (s: ScreenId) => {
      if (currentRole === 'CITIZEN') return CITIZEN_ALLOWED_SCREENS.includes(s);
      if (currentRole === 'GVMC_ADMIN') return GVMC_ADMIN_ALLOWED_SCREENS.includes(s);
      return NDRF_ADMIN_ALLOWED_SCREENS.includes(s);
    };

    let prevScreen: ScreenId | null = null;
    let newHistory = [...navigationHistory];

    while (newHistory.length > 0) {
      const candidate = newHistory.pop()!;
      if (candidate !== currentScreen && isAllowedForRole(candidate)) {
        prevScreen = candidate;
        break;
      }
    }

    setNavigationHistory(newHistory);

    if (prevScreen) {
      setCurrentScreen(prevScreen);
    } else {
      if (currentRole === 'GVMC_ADMIN') {
        setCurrentScreen('gvmc_admin_dashboard');
      } else if (currentRole === 'NDRF_ADMIN') {
        setCurrentScreen('ndrf_dispatcher_dashboard');
      } else {
        setCurrentScreen(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCitizenLogin = (user: UserProfile) => {
    const sanitizedUser: UserProfile = {
      id: user?.id || `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: user?.fullName || 'Verified Citizen',
      mobileNumber: user?.mobileNumber || '+91 98480 12345',
      aadhaarNumber: user?.aadhaarNumber || 'XXXX-XXXX-1092',
      ward: user?.ward || 'Ward 14 (Madhurawada & Coastal Belt)',
      isVerified: Boolean(user?.isVerified ?? true),
      registeredAt: user?.registeredAt || 'Today',
    };
    try {
      localStorage.setItem('janrakshak_citizen_user', JSON.stringify(sanitizedUser));
    } catch {}
    setCurrentUser(sanitizedUser);
    setOfficialSession(null);
    setCurrentRole('CITIZEN');
    setCurrentScreen(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal');
    showToast(
      'success',
      'Citizen Authentication Successful',
      `Welcome, ${sanitizedUser.fullName}. Aadhaar verified session active in ${sanitizedUser.ward}.`
    );
  };

  const handleCitizenLogout = () => {
    try {
      localStorage.removeItem('janrakshak_citizen_user');
    } catch {}
    setCurrentUser(null);
    setIsAccountModalOpen(false);
    setCurrentScreen('citizen_home_normal');
    showToast(
      'info',
      'Signed Out',
      'You have signed out of your JanRakshak Citizen account.'
    );
  };

  const handleOfficialLogin = (
    role: UserRole,
    officerDetails: { name: string; id: string; designation: string }
  ) => {
    const session = { role, ...officerDetails };
    try {
      localStorage.setItem('janrakshak_official_session', JSON.stringify(session));
    } catch {}
    setOfficialSession(session);
    setCurrentUser(null);
    setCurrentRole(role);
    setCurrentScreen(role === 'GVMC_ADMIN' ? 'gvmc_admin_dashboard' : 'ndrf_dispatcher_dashboard');
    showToast(
      'success',
      'Security Clearance Granted',
      `${officerDetails.name} (${officerDetails.designation}) authenticated.`
    );
  };

  const handleOfficialLogout = () => {
    try {
      localStorage.removeItem('janrakshak_official_session');
    } catch {}
    setOfficialSession(null);
    setCurrentRole('CITIZEN');
    setShowOfficialPortal(false);
    setCurrentScreen('citizen_home_normal');
    showToast(
      'info',
      'Official Session Terminated',
      'Terminal closed. Returned to public citizen interface.'
    );
  };

  const handleToggleDisasterMode = (enabled: boolean) => {
    setIsDisasterMode(enabled);
    JanRakshakAPI.toggleSystemMode(enabled).catch(() => {});
    showToast(
      enabled ? 'alert' : 'info',
      enabled ? 'DISASTER RED ALERT ENGAGED' : 'NORMAL CIVIC RESTORED',
      enabled ? 'IMD Cyclone protocol online. Coastal shelters active.' : 'Reverted to standard municipal works.'
    );
    if (currentRole === 'CITIZEN') {
      setCurrentScreen(enabled ? 'citizen_home_disaster' : 'citizen_home_normal');
    }
  };

  const handleAddNewTicket = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    if (newTicket.beforeImageUrl) {
      try {
        localStorage.setItem(`janrakshak_photo_before_${newTicket.id}`, newTicket.beforeImageUrl);
      } catch {}
    }
    JanRakshakAPI.createTicket(newTicket).catch(() => {});
    showToast('success', 'Ticket Dispatched to GVMC', `${newTicket.id} logged with GPS lock & photo proof.`);
  };

  const handleUpdateTicketPhoto = (ticketId: string, photoUrl: string, type: 'before' | 'after') => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              [type === 'before' ? 'beforeImageUrl' : 'afterImageUrl']: photoUrl,
            }
          : t
      )
    );
    try {
      localStorage.setItem(`janrakshak_photo_${type}_${ticketId}`, photoUrl);
    } catch {}
    showToast(
      'success',
      'Photo Evidence Saved',
      `Photographic proof attached to work order ${ticketId}.`
    );
  };

  const handleUpdateTicketStage = (ticketId: string, stage: Ticket['currentStage']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: stage } : t))
    );
    JanRakshakAPI.updateTicketStage(ticketId, stage).catch(() => {});
    showToast('info', 'Work Order Stage Updated', `Ticket ${ticketId} advanced to ${stage.replace('_', ' ')}.`);
  };

  const handleAssignOfficerToTicket = (ticketId: string, officer: MunicipalOfficer) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              currentStage: 'assigned',
              assignedCrew: {
                workerName: officer.name,
                unitId: officer.id,
                phone: officer.phone,
                checkedInTime: 'Assigned Just Now',
              },
            }
          : t
      )
    );
    setMunicipalOfficers((prev) =>
      prev.map((o) =>
        o.id === officer.id
          ? { ...o, activeWorkloadCount: o.activeWorkloadCount + 1 }
          : o
      )
    );
    JanRakshakAPI.assignOfficer(ticketId, officer.id).catch(() => {});
    showToast('success', 'Section Engineer Assigned', `${officer.name} assigned with 48h resolution SLA.`);
  };

  const handleApproveTicketResolution = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: 'resolved' } : t))
    );
    JanRakshakAPI.auditPhotoProof(ticketId, 'APPROVE').catch(() => {});
    showToast('success', 'Resolution Verified', `Photo proof approved. Ticket ${ticketId} resolved.`);
  };

  const handleRejectTicketResolution = (ticketId: string, reason: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, currentStage: 'in_progress' } : t))
    );
    JanRakshakAPI.auditPhotoProof(ticketId, 'REJECT', reason).catch(() => {});
    showToast('alert', 'Resolution Rejected', `Audit: ${reason}. Returned to field crew.`);
  };

  const handleSubmitVolunteerApplication = (application: VolunteerApplication) => {
    setVolunteerApplications((prev) => [application, ...prev]);
    JanRakshakAPI.submitVolunteerApplication(application).catch(() => {});
    showToast('success', 'Application Logged', 'Credential verification underway with NDRF 10th Bn.');
  };

  const handleApproveVolunteerApplication = (applicationId: string) => {
    const app = volunteerApplications.find((a) => a.id === applicationId);
    if (!app) return;

    setVolunteerApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'APPROVED' } : a))
    );

    const newVolunteer: ActiveVolunteer = {
      id: `VOL-${String(activeVolunteers.length + 1).padStart(2, '0')}`,
      name: app.fullName,
      phone: app.phone,
      ward: app.ward,
      role: 'Community Disaster First Responder',
      equipment: app.equipmentAvailable.join(', ') || 'First Aid Kit & Torch',
      skills: app.skills,
      status: 'Available',
      isVerifiedByNDRF: true,
      onboardedBy: 'PUBLIC_APPLICATION',
      distanceMeters: Math.floor(100 + Math.random() * 350),
    };

    setActiveVolunteers((prev) => [newVolunteer, ...prev]);
    JanRakshakAPI.approveVolunteerApplication(applicationId).catch(() => {});
    showToast('success', 'Volunteer Approved', `${app.fullName} credentialed into coastal rescue grid.`);
  };

  const handleRejectVolunteerApplication = (applicationId: string) => {
    setVolunteerApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'REJECTED' } : a))
    );
    JanRakshakAPI.rejectVolunteerApplication(applicationId).catch(() => {});
    showToast('info', 'Application Rejected', 'Application archived.');
  };

  const handleAddDirectVolunteer = (volunteer: ActiveVolunteer) => {
    setActiveVolunteers((prev) => [volunteer, ...prev]);
    JanRakshakAPI.directOnboardVolunteer(volunteer).catch(() => {});
    showToast('success', 'Direct Responder Added', `${volunteer.name} added to live command roster.`);
  };

  const handleUpdateVolunteerStatus = (
    volunteerId: string,
    status: ActiveVolunteer['status'],
    incidentId?: string
  ) => {
    setActiveVolunteers((prev) =>
      prev.map((v) =>
        v.id === volunteerId
          ? {
              ...v,
              status,
              assignedIncidentId: incidentId !== undefined ? incidentId : v.assignedIncidentId,
            }
          : v
      )
    );
    if (incidentId) {
      JanRakshakAPI.dispatchVolunteer(volunteerId, incidentId, status).catch(() => {});
    }
  };

  const handleUpdateOccupancy = (shelterId: string, delta: number) => {
    setShelters((prev) =>
      prev.map((s) =>
        s.id === shelterId
          ? {
              ...s,
              currentOccupants: Math.min(s.totalCapacity, Math.max(0, s.currentOccupants + delta)),
            }
          : s
      )
    );
    JanRakshakAPI.updateShelterOccupancy(shelterId, delta).catch(() => {});
  };

  // Filter tickets that belong strictly to the current logged-in citizen
  const userTickets = useMemo(() => {
    return tickets.filter((t) => isUserTicketOwner(t, currentUser));
  }, [tickets, currentUser]);

  // If a specific ticket was chosen, display it.
  // Otherwise default to the user's own ticket, or null if a newly registered user with 0 tickets.
  const currentSelectedTicket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId) || null
    : userTickets.length > 0
    ? userTickets[0]
    : null;

  // Dynamic Navigation Groups based on User Role
  const getNavigationGroups = () => {
    if (currentRole === 'GVMC_ADMIN') {
      return [
        {
          title: 'MUNICIPAL WORKS OPERATIONS',
          items: [
            { id: 'gvmc_admin_dashboard' as ScreenId, label: 'GVMC Admin Console', icon: Building2, count: `${tickets.length} Orders` },
            { id: 'public_ticket_stepper' as ScreenId, label: 'Public SLA Stepper', icon: CheckCircle2, count: null },
            { id: 'camera_defect_capture' as ScreenId, label: 'Manual Defect Intake', icon: Camera, count: null },
          ],
        },
        {
          title: 'WARD GIS & EMERGENCIES',
          items: [
            { id: 'hazard_navigation_map' as ScreenId, label: 'Hazard Detour GIS', icon: Compass, count: 'Live' },
            { id: 'cyclone_shelter_capacity' as ScreenId, label: 'Relief Shelters Status', icon: LifeBuoy, count: '18 Active' },
            { id: 'district_collector_switcher' as ScreenId, label: 'Collector Override', icon: ShieldCheck, count: 'IAS' },
          ],
        },
      ];
    }

    if (currentRole === 'NDRF_ADMIN') {
      const pendingCount = volunteerApplications.filter((a) => a.status === 'PENDING').length;
      return [
        {
          title: 'TACTICAL COMMAND & WAR ROOM',
          items: [
            { id: 'ndrf_dispatcher_dashboard' as ScreenId, label: 'NDRF War Room Console', icon: Radio, count: '10th Bn' },
            { id: 'ndrf_volunteer_hub' as ScreenId, label: 'Volunteer Command Hub', icon: Users, count: `${pendingCount} Pending` },
            { id: 'elder_sos_trigger' as ScreenId, label: 'Emergency Elder SOS', icon: AlertOctagon, count: 'URGENT' },
            { id: 'volunteer_proximity' as ScreenId, label: 'Live Responder Radar', icon: HeartHandshake, count: `${activeVolunteers.length} Active` },
          ],
        },
        {
          title: 'EVACUATION & LOGISTICS',
          items: [
            { id: 'cyclone_shelter_capacity' as ScreenId, label: 'Relief Shelter Log', icon: LifeBuoy, count: '18 Active' },
            { id: 'hazard_navigation_map' as ScreenId, label: 'Hazard Detour GIS', icon: Compass, count: 'Live' },
            { id: 'elder_profile_setup' as ScreenId, label: 'Vulnerability Registry', icon: ShieldCheck, count: null },
            { id: 'district_collector_switcher' as ScreenId, label: 'Collector Override', icon: ShieldCheck, count: 'IAS' },
          ],
        },
      ];
    }

    // Default: CITIZEN
    return [
      {
        title: 'CIVIC GOVERNANCE',
        items: [
          { id: 'citizen_home_normal' as ScreenId, label: 'Civic Portal Home', icon: Home, count: null },
          { id: 'camera_defect_capture' as ScreenId, label: 'Report Road Defect', icon: Camera, count: null },
          { id: 'public_ticket_stepper' as ScreenId, label: 'Track My Report (SLA)', icon: CheckCircle2, count: null },
          { id: 'spatial_dedup_notice' as ScreenId, label: '50m Spatial Dedupe', icon: Layers, count: '18m' },
        ],
      },
      {
        title: 'DISASTER & LIFE SAFETY',
        items: [
          { id: 'citizen_home_disaster' as ScreenId, label: 'Disaster Hub', icon: Flame, count: 'RED' },
          { id: 'cyclone_shelter_capacity' as ScreenId, label: 'Relief Shelters Status', icon: LifeBuoy, count: '18 Active' },
          { id: 'elder_sos_trigger' as ScreenId, label: 'Emergency Elder SOS', icon: AlertOctagon, count: 'URGENT' },
          { id: 'volunteer_proximity' as ScreenId, label: 'Volunteer Radar', icon: Users, count: '<500m' },
          { id: 'elder_profile_setup' as ScreenId, label: 'Vulnerability Registry', icon: User, count: null },
        ],
      },
      {
        title: 'NAVIGATION & COMMUNITY',
        items: [
          { id: 'hazard_navigation_map' as ScreenId, label: 'Safe Evacuation GIS', icon: Compass, count: 'Live' },
          { id: 'volunteer_interest_form' as ScreenId, label: 'Join Volunteer Corps', icon: HeartHandshake, count: 'Enlist' },
        ],
      },
    ];
  };

  const navigationGroups = getNavigationGroups();

  // Authentication Boundary: Enforce Public Citizen Login or Official Terminal
  if (!currentUser && !officialSession) {
    if (showOfficialPortal) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          {toasts.length > 0 && (
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
              {toasts.map((t) => (
                <div
                  key={t.id}
                  className="pointer-events-auto p-3.5 rounded-xl border bg-slate-900/95 border-amber-500/50 text-slate-100 shadow-xl"
                >
                  <span className="font-bold block text-xs">{t.title}</span>
                  <span className="text-[11px] text-slate-300 block mt-0.5">{t.message}</span>
                </div>
              ))}
            </div>
          )}
          <OfficialPersonnelAuth
            onOfficialLogin={handleOfficialLogin}
            onReturnToPublic={() => setShowOfficialPortal(false)}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {toasts.length > 0 && (
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((t) => (
              <div
                key={t.id}
                className="pointer-events-auto p-3.5 rounded-xl border bg-slate-900/95 border-blue-500/50 text-slate-100 shadow-xl"
              >
                <span className="font-bold block text-xs">{t.title}</span>
                <span className="text-[11px] text-slate-300 block mt-0.5">{t.message}</span>
              </div>
            ))}
          </div>
        )}
        <CitizenAuthDashboard
          onCitizenLogin={handleCitizenLogin}
          onOpenOfficialPortal={() => setShowOfficialPortal(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Universal Top Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        isDisasterMode={isDisasterMode}
        currentRole={currentRole}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentUser={currentUser}
        officialSession={officialSession}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onLogout={currentRole === 'CITIZEN' ? handleCitizenLogout : handleOfficialLogout}
        liveLocation={liveLocation}
        gpsStatus={gpsStatus}
        onOpenGPSModal={() => setShowGpsModal(true)}
      />

      {/* Real-Time Civil Defense Emergency Broadcast Alert Banner (Notifies all nearby citizens & users) */}
      {activeEmergencyBroadcast && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 sm:px-6 py-3 border-b-2 border-red-400 shadow-xl glow-red animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="p-2 bg-white/20 rounded-xl shrink-0 shadow-inner">
                <Radio className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase bg-white/25 px-2 py-0.5 rounded-full border border-white/30">
                    EMERGENCY CELL BROADCAST · 4370
                  </span>
                  <span className="text-[11px] text-red-100 font-mono">
                    {activeEmergencyBroadcast.timestamp}
                  </span>
                  <span className="text-[11px] text-red-100 font-medium hidden sm:inline">
                    · Authorized by: <strong className="text-white">{activeEmergencyBroadcast.senderName}</strong>
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white mt-0.5 truncate">
                  {activeEmergencyBroadcast.title}
                </h3>
                <p className="text-xs text-red-100 mt-0.5 leading-snug line-clamp-2 sm:line-clamp-none">
                  {activeEmergencyBroadcast.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => {
                  handleNavigate('hazard_navigation_map');
                  setActiveEmergencyBroadcast(null);
                }}
                className="px-3.5 py-1.5 bg-white text-red-700 font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-red-600" />
                <span>Evacuation Route</span>
              </button>
              <button
                onClick={() => setActiveEmergencyBroadcast(null)}
                className="px-3 py-1.5 bg-red-900/60 hover:bg-red-900 text-white font-semibold text-xs rounded-xl border border-red-400/50 cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Real-Time Operational Telemetry Strip */}
      <div
        className={`px-4 sm:px-6 py-2 border-b text-xs flex flex-wrap items-center justify-between gap-3 transition-colors shadow-2xs font-mono ${
          isDisasterMode
            ? 'bg-red-950/95 text-red-100 border-red-800/80 backdrop-blur-md'
            : currentRole === 'GVMC_ADMIN'
            ? 'bg-slate-950 text-blue-100 border-slate-800 backdrop-blur-md'
            : currentRole === 'NDRF_ADMIN'
            ? 'bg-slate-950 text-amber-200 border-slate-800 backdrop-blur-md'
            : 'bg-slate-900/95 text-slate-200 border-slate-800 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold font-mono uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {currentRole === 'GVMC_ADMIN'
                ? 'GVMC WORKS SYSTEM:'
                : currentRole === 'NDRF_ADMIN'
                ? 'NDRF 10TH BATTALION COMMAND:'
                : 'OPERATIONAL STATUS:'}
            </span>
          </span>
          <span className="font-medium">
            {currentRole === 'GVMC_ADMIN'
              ? 'Zone 2 Works Dept · 42 Open Civic Defects · 94.2% On-Time SLA · PostGIS Deduplication Active'
              : currentRole === 'NDRF_ADMIN'
              ? 'Tactical War Room · Motorized Boats Deployed · Coastal Sweeps in Progress · 4 Responders Dispatched'
              : isDisasterMode
              ? 'IMD Cyclone Red Alert · 18 Coastal Shelters Active · Citizen Mobilization Online'
              : 'GVMC Ward 14 · Visakhapatnam Smart City Operations Center'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          {/* Continuous Live GPS Fix Telemetry Badge */}
          <button
            type="button"
            onClick={() => setShowGpsModal(true)}
            className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 px-2.5 py-0.5 rounded border border-white/20 cursor-pointer transition-colors"
            title="Click to view Live GPS diagnostics"
          >
            {liveLocation ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>GPS: {liveLocation.latitude.toFixed(4)}°N, {liveLocation.longitude.toFixed(4)}°E (±{Math.round(liveLocation.accuracy)}m)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300 font-bold animate-pulse">
                <LocateFixed className="w-3 h-3 text-amber-400" />
                <span>GPS: ACQUIRING FIX...</span>
              </span>
            )}
          </button>

          {isDisasterMode ? (
            <>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-yellow-300" /> 124 km/h Gusts
              </span>
              <span className="flex items-center gap-1">
                <Waves className="w-3.5 h-3.5 text-cyan-300" /> +3.8m Surge
              </span>
            </>
          ) : (
            <span className="text-slate-400">PostGIS ST_DWithin(50m) Active</span>
          )}
          <span className="bg-white/10 px-2 py-0.5 rounded font-bold">
            {currentRole === 'CITIZEN'
              ? 'AADHAAR VERIFIED CITIZEN'
              : `OFFICIAL CLEARANCE: ${officialSession?.id || currentRole}`}
          </span>
        </div>
      </div>

      {/* Main Container: Collapsible Desktop Sidebar + Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Collapsible Left Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 shrink-0 select-none ${
            isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0'
          }`}
          aria-label="Desktop application navigation"
        >
          {/* Active Citizen Identity / Official Terminal Card in Sidebar */}
          {currentRole === 'CITIZEN' ? (
            <div className="p-3.5 m-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="leading-tight min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.fullName || 'Verified Citizen'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono font-medium flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Aadhaar Verified</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCitizenLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer shrink-0 border border-transparent hover:border-slate-200"
                title="Sign Out of Citizen Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3.5 m-3 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    currentRole === 'GVMC_ADMIN' ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'
                  }`}
                >
                  {currentRole === 'GVMC_ADMIN' ? (
                    <Building2 className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                </div>
                <div className="leading-tight min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {officialSession?.name || (currentRole === 'GVMC_ADMIN' ? 'GVMC Works Admin' : 'NDRF Officer')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {officialSession?.designation || 'Official Terminal'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOfficialLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Exit Official Terminal"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="text-[10px] font-bold font-mono text-slate-400 tracking-wider px-2.5 mb-1.5 uppercase">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  const isSos = item.id === 'elder_sos_trigger';

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? isDisasterMode || isSos
                            ? 'bg-red-600 text-white font-bold shadow-xs'
                            : 'bg-blue-600 text-white font-bold shadow-xs'
                          : isSos
                          ? 'text-red-700 hover:bg-red-50 bg-red-50/60 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.count && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : isSos
                              ? 'bg-red-200 text-red-900 font-bold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
            <div className="font-semibold text-slate-700">JanRakshak Web Console</div>
            <div className="text-[10px] text-slate-400 font-mono">v1.0.0 · Visakhapatnam GVMC & NDRF</div>
          </div>
        </aside>

        {/* Screen Router Viewport */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-12">
          {/* Floating GovTech Toast Alerts Container */}
          {toasts.length > 0 && (
            <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
              {toasts.map((t) => (
                <div
                  key={t.id}
                  className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-top-2 ${
                    t.type === 'success'
                      ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                      : t.type === 'alert'
                      ? 'bg-red-950/95 border-red-500/60 text-red-100'
                      : 'bg-slate-900/90 border-blue-500/50 text-slate-100'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {t.type === 'success' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : t.type === 'alert' ? (
                      <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-400" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-bold block tracking-wide">{t.title}</span>
                    <span className="opacity-90 leading-tight block mt-0.5 text-[11px]">{t.message}</span>
                  </div>
                  <button
                    onClick={() => removeToast(t.id)}
                    className="p-1 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* GVMC Admin Dashboard */}
          {currentScreen === 'gvmc_admin_dashboard' && (
            <GVMCAdminDashboard
              tickets={tickets}
              officers={municipalOfficers}
              onNavigate={handleNavigate}
              onAssignOfficer={handleAssignOfficerToTicket}
              onApproveResolution={handleApproveTicketResolution}
              onRejectResolution={handleRejectTicketResolution}
              officerSession={officialSession}
            />
          )}

          {/* NDRF Volunteer Hub */}
          {currentScreen === 'ndrf_volunteer_hub' && (
            <NDRFVolunteerManagement
              applications={volunteerApplications}
              activeVolunteers={activeVolunteers}
              onNavigate={handleNavigate}
              onApproveApplication={handleApproveVolunteerApplication}
              onRejectApplication={handleRejectVolunteerApplication}
              onAddDirectVolunteer={handleAddDirectVolunteer}
              onUpdateVolunteerStatus={handleUpdateVolunteerStatus}
            />
          )}

          {/* Public Volunteer Interest Form */}
          {currentScreen === 'volunteer_interest_form' && (
            <VolunteerInterestForm
              onNavigate={handleNavigate}
              onSubmitApplication={handleSubmitVolunteerApplication}
              onGoBack={handleGoBack}
              currentUser={currentUser}
            />
          )}

          {/* Existing screens */}
          {currentScreen === 'citizen_home_normal' && (
            <CitizenHomeNormal
              tickets={tickets}
              onNavigate={handleNavigate}
              onSelectTicket={setSelectedTicketId}
              currentUser={currentUser}
            />
          )}

          {currentScreen === 'citizen_home_disaster' && (
            <CitizenHomeDisaster onNavigate={handleNavigate} />
          )}

          {currentScreen === 'elder_sos_trigger' && (
            <ElderSOSTrigger
              elderProfile={elderProfile}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
              liveLocation={liveLocation}
              activeUser={currentUser}
            />
          )}

          {currentScreen === 'volunteer_proximity' && (
            <VolunteerProximity
              elderProfile={elderProfile}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
              liveLocation={liveLocation}
            />
          )}

          {currentScreen === 'spatial_dedup_notice' && (
            <SpatialDedupNotice
              tickets={tickets}
              onNavigate={handleNavigate}
              onSelectTicket={setSelectedTicketId}
              selectedTicketId={selectedTicketId}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'ndrf_dispatcher_dashboard' && (
            <NDRFDispatcherDashboard
              tickets={tickets}
              onNavigate={handleNavigate}
              officerSession={officialSession}
            />
          )}

          {currentScreen === 'field_worker_checkin' && (
            <FieldWorkerCheckin
              tickets={tickets}
              onNavigate={handleNavigate}
              onUpdateTicketStage={handleUpdateTicketStage}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'district_collector_switcher' && (
            <DistrictCollectorSwitcher
              isDisasterMode={isDisasterMode}
              onToggleDisasterMode={handleToggleDisasterMode}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'hazard_navigation_map' && (
            <HazardNavigationMap
              tickets={tickets}
              hazards={hazards}
              shelters={shelters}
              targetShelterId={selectedShelterForNavigation}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
              liveLocation={liveLocation}
              onRequestGPS={startContinuousLocationWatch}
            />
          )}

          {currentScreen === 'camera_defect_capture' && (
            <CitizenCameraDefectCapture
              existingTickets={tickets}
              onNavigate={handleNavigate}
              onAddNewTicket={handleAddNewTicket}
              onSelectTicket={setSelectedTicketId}
              initialCategory={activeCategoryForIntake}
              onGoBack={handleGoBack}
              onUpdateTicketPhoto={handleUpdateTicketPhoto}
              currentUser={currentUser}
              liveLocation={liveLocation}
            />
          )}

          {currentScreen === 'elder_profile_setup' && (
            <ElderProfileSetup
              elderProfile={elderProfile}
              onUpdateProfile={setElderProfile}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'public_ticket_stepper' && (
            <PublicTicketStepper
              ticket={currentSelectedTicket}
              userTickets={userTickets}
              allTickets={tickets}
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onGoBack={handleGoBack}
              onSelectTicket={setSelectedTicketId}
              onUpdateTicketPhoto={handleUpdateTicketPhoto}
            />
          )}

          {currentScreen === 'cyclone_shelter_capacity' && (
            <CycloneReliefShelter
              shelters={shelters}
              onNavigate={handleNavigate}
              onUpdateOccupancy={handleUpdateOccupancy}
              onGoBack={handleGoBack}
              onSelectShelterForNavigation={setSelectedShelterForNavigation}
              liveLocation={liveLocation}
            />
          )}
        </main>
      </div>

      {/* User Account / Citizen Profile Modal */}
      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentUser={currentUser}
        onSaveUser={(user) => {
          try {
            localStorage.setItem('janrakshak_citizen_user', JSON.stringify(user));
            const clean = user.mobileNumber.replace(/\D/g, '').slice(-10);
            const raw = localStorage.getItem('janrakshak_citizen_registry');
            const registry = raw ? JSON.parse(raw) : {};
            registry[clean] = user;
            localStorage.setItem('janrakshak_citizen_registry', JSON.stringify(registry));
          } catch {}
          setCurrentUser(user);
          setIsAccountModalOpen(false);
          showToast('success', 'Profile Updated', `Account details for ${user.fullName} have been saved.`);
        }}
        onLogout={handleCitizenLogout}
      />

      {/* Live GPS Authorization & Continuous Positioning HUD Modal */}
      <LiveGPSPromptModal
        isOpen={showGpsModal}
        onClose={() => setShowGpsModal(false)}
        gpsStatus={gpsStatus}
        liveLocation={liveLocation}
        onRequestGPS={startContinuousLocationWatch}
        onSetManualLocation={handleSetManualLocation}
      />

      {/* Mobile Sticky Bottom Floating Navigation Dock */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-xl flex items-center justify-around py-2 px-2 font-sans">
        {currentRole === 'CITIZEN' && (
          <>
            <button
              onClick={() => handleNavigate(isDisasterMode ? 'citizen_home_disaster' : 'citizen_home_normal')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'citizen_home_normal' || currentScreen === 'citizen_home_disaster'
                  ? 'text-blue-600 bg-blue-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavigate('camera_defect_capture')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'camera_defect_capture'
                  ? 'text-blue-600 bg-blue-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Report</span>
            </button>

            <button
              onClick={() => handleNavigate('public_ticket_stepper')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'public_ticket_stepper'
                  ? 'text-blue-600 bg-blue-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Track SLA</span>
            </button>

            <button
              onClick={() => handleNavigate('hazard_navigation_map')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'hazard_navigation_map'
                  ? 'text-blue-600 bg-blue-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Evac Route</span>
            </button>

            <button
              onClick={() => handleNavigate('elder_sos_trigger')}
              className="flex flex-col items-center gap-1 text-[10px] font-black py-1 px-3 rounded-xl text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-sm active:scale-95 transition-transform cursor-pointer border border-red-500 glow-red"
            >
              <AlertOctagon className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>SOS Alert</span>
            </button>
          </>
        )}

        {currentRole === 'GVMC_ADMIN' && (
          <>
            <button
              onClick={() => handleNavigate('gvmc_admin_dashboard')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'gvmc_admin_dashboard'
                  ? 'text-blue-600 bg-blue-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Console</span>
            </button>

            <button
              onClick={() => handleNavigate('hazard_navigation_map')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'hazard_navigation_map'
                  ? 'text-blue-600 bg-blue-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Detour GIS</span>
            </button>

            <button
              onClick={() => handleNavigate('public_ticket_stepper')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'public_ticket_stepper'
                  ? 'text-blue-600 bg-blue-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>SLA Audit</span>
            </button>
          </>
        )}

        {currentRole === 'NDRF_ADMIN' && (
          <>
            <button
              onClick={() => handleNavigate('ndrf_dispatcher_dashboard')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'ndrf_dispatcher_dashboard'
                  ? 'text-amber-700 bg-amber-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>War Room</span>
            </button>

            <button
              onClick={() => handleNavigate('ndrf_volunteer_hub')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'ndrf_volunteer_hub'
                  ? 'text-amber-700 bg-amber-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Volunteers</span>
            </button>

            <button
              onClick={() => handleNavigate('volunteer_proximity')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'volunteer_proximity'
                  ? 'text-amber-700 bg-amber-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Radar</span>
            </button>

            <button
              onClick={() => handleNavigate('cyclone_shelter_capacity')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all cursor-pointer ${
                currentScreen === 'cyclone_shelter_capacity'
                  ? 'text-amber-700 bg-amber-50/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Shelters</span>
            </button>

            <button
              onClick={() => handleNavigate('elder_sos_trigger')}
              className="flex flex-col items-center gap-1 text-[10px] font-black py-1 px-3 rounded-xl text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-sm active:scale-95 transition-transform cursor-pointer border border-red-500 glow-red"
            >
              <AlertOctagon className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>SOS Alert</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
