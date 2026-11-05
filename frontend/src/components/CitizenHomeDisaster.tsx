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
    // 1. Direct native phone call automation for mobile dialers
    try {
      window.location.href = `tel:${helpline.phone}`;
    } catch {
      // Ignore if browser prevents direct tel scheme
    }

    // 2. Open automated in-app emergency calling console
    setActiveCall({
      title: helpline.name,
      phone: helpline.displayNumber,
      department: helpline.department,
      operator: helpline.operator,
      status: 'DIALING',
      durationSeconds: 0,
    });
  };

  // Manage in-call timer & auto-connect simulation
  useEffect(() => {
    let connectTimeout: NodeJS.Timeout;
    let durationInterval: NodeJS.Timeout;

    if (activeCall) {
      if (activeCall.status === 'DIALING') {
        connectTimeout = setTimeout(() => {
          setActiveCall((prev) => (prev ? { ...prev, status: 'CONNECTED' } : null));
        }, 1800);
      } else if (activeCall.status === 'CONNECTED') {
        durationInterval = setInterval(() => {
          setActiveCall((prev) =>
            prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null
          );
        }, 1000);
      }
    }

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(durationInterval);
    };
  }, [activeCall?.status]);

  const formatCallDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Red Alert Headline Ribbon */}
      <div className="bg-red-700 text-white rounded-2xl p-6 shadow-md border-2 border-red-500 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-white text-red-700 font-extrabold text-xs px-2.5 py-1 rounded tracking-wider uppercase font-mono">
                DISASTER EMERGENCY MODE ACTIVE
              </span>
              <span className="text-xs text-red-200">District Collectorate Section 144 Enforced</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Cyclone Montha: Category 3 Landfall in 4 Hours
            </h1>
            <p className="text-sm text-red-100 max-w-2xl leading-relaxed">
              Coastal surge 4.2m projected. Low-lying zones within 1.5km of Beach Road must evacuate immediately to designated reinforced shelters. Power lines automatically isolated to prevent electrocution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {/* Direct Big SOS Trigger */}
            <button
              onClick={() => onNavigate('elder_sos_trigger')}
              className="px-6 py-3.5 bg-white text-red-700 hover:bg-red-50 font-extrabold text-base rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <AlertOctagon className="w-5 h-5 text-red-600 animate-bounce" />
              <span>TRIGGER ELDER SOS</span>
            </button>
            <button
              onClick={() => onNavigate('citizen_home_normal')}
              className="px-4 py-3 bg-red-800 hover:bg-red-900 text-white font-semibold text-xs rounded-xl border border-red-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Normal Civic</span>
            </button>
          </div>
        </div>

        {/* Live Weather Telemetry strip */}
        <div className="mt-6 pt-4 border-t border-red-600/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-red-200 block text-[11px]">Wind Gust Velocity</span>
            <span className="font-mono font-bold text-base text-white">124 km/h (Peak 140)</span>
          </div>
          <div>
            <span className="text-red-200 block text-[11px]">Storm Surge Level</span>
            <span className="font-mono font-bold text-base text-white">+3.8m above high tide</span>
          </div>
          <div>
            <span className="text-red-200 block text-[11px]">Coastal Rainfall</span>
            <span className="font-mono font-bold text-base text-white">182 mm/6hr</span>
          </div>
          <div>
            <span className="text-red-200 block text-[11px]">Active Responders</span>
            <span className="font-mono font-bold text-base text-white">42 Verified in Ward 14</span>
          </div>
        </div>
      </div>

      {/* Primary Emergency Action Cards (Shelters & NDRF War Room removed per citizen requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dynamic Hazard Navigation Map with Live Location */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <Compass className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                Live GPS Routing Active
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Safe Evacuation Route (Live Location)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dynamic turn-by-turn path from your current live GPS position to the nearest elevated safety shelter, automatically calculating detours around deep waterlogging, fallen trees, and live 11kV snapped cables.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('hazard_navigation_map')}
            className="mt-6 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            <span>Launch Live Evacuation Route Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Community Volunteer Proximity Rescue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                &lt; 500m Proximity Radar
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Volunteer Proximity Team</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                42 verified local community first responders within 400m of your GPS coordinates, equipped with stretchers, high-clearance 4x4 vehicles, and first aid kits ready to reach stranded residents.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('volunteer_proximity')}
            className="mt-6 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Open Volunteer Proximity Radar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Disaster Helplines in 2 Rows & 2 Columns with Direct Call Automation */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 rounded-xl text-white">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                  24x7 TOLL-FREE DIRECT DIAL
                </span>
                <span className="text-xs text-slate-400">Click Any Box to Automate Direct Call</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Emergency Disaster Helpline Numbers
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate('district_collector_switcher')}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors w-fit cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>District Collector Override</span>
          </button>
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
                className="p-5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-red-500 transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${helpline.badgeColor}`}>
                      {helpline.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Line Open</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-slate-700/80 group-hover:bg-red-600 group-hover:text-white rounded-lg transition-colors shrink-0 text-slate-300">
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

                <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-mono font-bold text-base">
                    <PhoneForwarded className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                    <span>{helpline.displayNumber}</span>
                  </div>

                  <span className="px-3 py-1 bg-red-600 group-hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-center space-y-5">
            <button
              onClick={() => setActiveCall(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Calling Animation Indicator */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {activeCall.status === 'DIALING' ? (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-600/30 animate-ping" />
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                    <PhoneCall className="w-8 h-8 animate-bounce" />
                  </div>
                </>
              ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                  <PhoneCall className="w-8 h-8" />
                </div>
              )}
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeCall.status === 'DIALING' ? 'Dialing Control Room...' : 'Connected • Line Encrypted'}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">{activeCall.title}</h3>
              <p className="text-sm font-mono text-emerald-400 mt-1 font-bold">{activeCall.phone}</p>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300 text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Duty Officer:</span>
                <span className="font-semibold text-white">{activeCall.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Call Duration:</span>
                <span className="font-mono font-bold text-white">
                  {formatCallDuration(activeCall.durationSeconds)}
                </span>
              </div>
            </div>

            {/* End Call Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveCall(null)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Disconnect Call</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
