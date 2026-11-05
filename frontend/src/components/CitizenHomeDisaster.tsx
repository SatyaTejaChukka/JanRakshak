import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import {
  AlertOctagon,
  Users,
  Compass,
  PhoneCall,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Navigation,
  PhoneForwarded,
  X,
  PhoneOff,
  Radio,
  LifeBuoy,
  Building2,
  Ambulance,
  ShieldCheck,
  Wind,
  Waves,
  CloudRain,
  Activity,
  Flame,
} from 'lucide-react';

interface CitizenHomeDisasterProps {
  onNavigate: (screen: ScreenId) => void;
}

interface ActiveCallState {
  title: string;
  phone: string;
  department: string;
  operator: string;
  status: 'DIALING' | 'CONNECTED';
  durationSeconds: number;
}

export const CitizenHomeDisaster: React.FC<CitizenHomeDisasterProps> = ({ onNavigate }) => {
  // State for interactive in-app calling simulation
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);

  // 4 Emergency Disaster Helplines in 2 rows & 2 columns
  const disasterHelplines = [
    {
      id: 'ndrf',
      name: 'NDRF Disaster Rescue Command',
      phone: '1078',
      displayNumber: '1078 (Toll-Free) / 0891-2551078',
      department: '10th Battalion Motorized Boat & Tree Cutter Control',
      badge: 'URGENT RESCUE',
      badgeColor: 'bg-red-600 text-white',
      operator: 'Commandant R. S. Pathak (10th Bn NDRF)',
      icon: ShieldAlert,
    },
    {
      id: 'marine_police',
      name: 'Coastal Marine Police & Coast Guard',
      phone: '1093',
      displayNumber: '1093 / 0891-2561093',
      department: 'Coastal Tidal Surge, Fishermen Evacuation & Harbor Defense',
      badge: 'COASTAL PATROL',
      badgeColor: 'bg-blue-600 text-white',
      operator: 'DSP Coastal Security Wing (Visakhapatnam)',
      icon: Radio,
    },
    {
      id: 'ambulance',
      name: 'Medical Emergency & Trauma (108)',
      phone: '108',
      displayNumber: '108 (24x7 Emergency)',
      department: 'ICU Ambulances, Oxygen Supply & Flood Casualty Triage',
      badge: 'PARAMEDIC',
      badgeColor: 'bg-emerald-600 text-white',
      operator: 'Dr. V. Rao (King George Hospital Disaster Cell)',
      icon: Ambulance,
    },
    {
      id: 'gvmc_cell',
      name: 'GVMC Disaster Operations War Room',
      phone: '18004250001',
      displayNumber: '1800 425 0001 (Toll-Free)',
      department: 'Electrical Grid Isolation, Tree Clearance & Dewatering Pumps',
      badge: 'CIVIC WAR ROOM',
      badgeColor: 'bg-amber-600 text-white',
      operator: 'Chief Engineer (GVMC Zone 2 Disaster Wing)',
      icon: Building2,
    },
  ];

  // Automate direct call when helpline is clicked
  const handleInitiateDirectCall = (helpline: (typeof disasterHelplines)[0]) => {
    try {
      window.location.href = `tel:${helpline.phone}`;
    } catch {}

    setActiveCall({
      title: helpline.name,
      phone: helpline.displayNumber,
      department: helpline.department,
      operator: helpline.operator,
      status: 'DIALING',
      durationSeconds: 0,
    });
  };

  // Call timer simulation
  useEffect(() => {
    let timer: any;
    if (activeCall) {
      if (activeCall.status === 'DIALING') {
        const timeout = setTimeout(() => {
          setActiveCall((prev) => (prev ? { ...prev, status: 'CONNECTED' } : null));
        }, 1500);
        return () => clearTimeout(timeout);
      } else if (activeCall.status === 'CONNECTED') {
        timer = setInterval(() => {
          setActiveCall((prev) => (prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null));
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [activeCall?.status]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 font-sans">
      {/* Emergency Crisis Command Banner */}
      <div className="bg-gradient-to-br from-red-950 via-slate-950 to-red-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-red-600/80 shadow-2xl relative overflow-hidden glow-red">
        {/* Tactical Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-black tracking-wider uppercase bg-red-950/80 border border-red-500/40 px-2.5 py-0.5 rounded-full">
                IMD RED ALERT · CYCLONIC STORM MONTHA
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-300 font-bold">STATE EOC DIRECTIVE ENGAGED</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Cyclone Montha: Category 3 Landfall in 4 Hours
            </h1>

            <p className="text-sm text-red-100 max-w-2xl leading-relaxed">
              Coastal surge +3.8m to 4.2m projected. Low-lying zones within 1.5km of Beach Road must evacuate immediately to designated reinforced shelters. Power lines automatically isolated to prevent electrocution.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            {/* Direct Big SOS Trigger */}
            <button
              onClick={() => onNavigate('elder_sos_trigger')}
              className="px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-red-600/40 transition-transform active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-red-400 glow-red"
            >
              <AlertOctagon className="w-5 h-5 text-yellow-300 animate-bounce" />
              <span>TRIGGER ELDER SOS</span>
            </button>

            <button
              onClick={() => onNavigate('citizen_home_normal')}
              className="px-4 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Normal Civic</span>
            </button>
          </div>
        </div>

        {/* Live Weather Telemetry strip */}
        <div className="relative z-10 mt-7 pt-5 border-t border-red-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-red-950/60 p-3 rounded-xl border border-red-800/40">
            <span className="text-red-300 flex items-center gap-1 text-[11px]">
              <Wind className="w-3.5 h-3.5 text-yellow-300" /> Wind Gust Velocity
            </span>
            <span className="font-bold text-base text-white block mt-1">124 km/h (Peak 140)</span>
          </div>

          <div className="bg-red-950/60 p-3 rounded-xl border border-red-800/40">
            <span className="text-red-300 flex items-center gap-1 text-[11px]">
              <Waves className="w-3.5 h-3.5 text-cyan-300" /> Storm Surge Level
            </span>
            <span className="font-bold text-base text-white block mt-1">+3.8m above high tide</span>
          </div>

          <div className="bg-red-950/60 p-3 rounded-xl border border-red-800/40">
            <span className="text-red-300 flex items-center gap-1 text-[11px]">
              <CloudRain className="w-3.5 h-3.5 text-blue-300" /> Coastal Rainfall
            </span>
            <span className="font-bold text-base text-white block mt-1">182 mm/6hr</span>
          </div>

          <div className="bg-red-950/60 p-3 rounded-xl border border-red-800/40">
            <span className="text-red-300 flex items-center gap-1 text-[11px]">
              <Activity className="w-3.5 h-3.5 text-emerald-300" /> Active Responders
            </span>
            <span className="font-bold text-base text-emerald-400 block mt-1">42 Verified (Ward 14)</span>
          </div>
        </div>
      </div>

      {/* Primary Emergency Action Cards (3-Card Tactical Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Safe Evacuation Route GIS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 shadow-inner">
                <Compass className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                Turn-by-Turn GPS
              </span>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Safe Evacuation Route GIS</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dynamic route avoiding deep waterlogging, fallen trees, and live 11kV snapped cables, navigating to the nearest elevated safety shelter.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('hazard_navigation_map')}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Launch Evacuation Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Community Volunteer Proximity Team */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                &lt; 500m Radar
              </span>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Volunteer Proximity Team</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                42 verified local community first responders within 400m radius equipped with stretchers, high-clearance 4x4s, and triage kits.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('volunteer_proximity')}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Users className="w-4 h-4" />
            <span>Open Volunteer Radar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cyclone Relief Shelters Status */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 shadow-inner">
                <LifeBuoy className="w-6 h-6 text-cyan-600" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase">
                18 Active Shelters
              </span>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Relief Shelters Status</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Track live occupancy percentages, backup power generators, drinking water tanks, and medical beds across municipal shelters.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('cyclone_shelter_capacity')}
            className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>View Shelters Capacity</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Disaster Helplines in 2 Rows & 2 Columns with Direct Call Automation */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 rounded-2xl text-white shadow-md shadow-red-600/30">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md border border-red-500/30">
                  24x7 TOLL-FREE DIRECT DIAL
                </span>
                <span className="text-xs text-slate-400">Click Any Box to Automate Direct Call</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5 tracking-tight">
                Emergency Disaster Helpline Numbers
              </h2>
            </div>
          </div>

          <div className="px-3.5 py-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Red Alert · Disaster Mgmt Act 2005</span>
          </div>
        </div>

        {/* 2 Rows and 2 Columns Helpline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {disasterHelplines.map((helpline) => {
            const Icon = helpline.icon;
            return (
              <div
                key={helpline.id}
                onClick={() => handleInitiateDirectCall(helpline)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleInitiateDirectCall(helpline)}
                className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-red-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase ${helpline.badgeColor}`}>
                      {helpline.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Line Open</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-slate-800 group-hover:bg-red-600 group-hover:text-white rounded-xl transition-colors shrink-0 text-slate-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-red-400 transition-colors">
                        {helpline.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {helpline.department}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-mono font-bold text-sm sm:text-base">
                    <PhoneForwarded className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                    <span>{helpline.displayNumber}</span>
                  </div>

                  <span className="px-3 py-1.5 bg-red-600 group-hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs active:scale-95">
                    <span>Direct Call</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automated In-App Direct Calling Simulation Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 border-2 border-slate-800 text-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center space-y-6">
            <button
              onClick={() => setActiveCall(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">{activeCall.title}</h3>
              <p className="text-xs text-slate-400 font-mono">{activeCall.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Call Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    activeCall.status === 'CONNECTED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/30 animate-pulse'
                  }`}
                >
                  {activeCall.status === 'CONNECTED' ? 'CONNECTED (24x7 EOC)' : 'DIALING DISPATCHER...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-white font-bold">{formatCallDuration(activeCall.durationSeconds)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Operator:</span>
                <span className="text-white truncate max-w-[180px]">{activeCall.operator}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveCall(null)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Disconnect Emergency Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
