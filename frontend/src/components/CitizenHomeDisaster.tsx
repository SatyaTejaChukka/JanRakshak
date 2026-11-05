import React from 'react';
import { ScreenId } from '../types';
import {
  AlertOctagon,
  LifeBuoy,
  Users,
  Compass,
  PhoneCall,
  BellRing,
  ArrowRight,
  ShieldAlert,
  Wind,
  Waves,
  BatteryCharging,
  Flame,
  ArrowLeft,
  Navigation,
} from 'lucide-react';

interface CitizenHomeDisasterProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CitizenHomeDisaster: React.FC<CitizenHomeDisasterProps> = ({ onNavigate }) => {
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
              className="px-4 py-3 bg-red-800 hover:bg-red-900 text-white font-semibold text-xs rounded-xl border border-red-600 transition-colors flex items-center justify-center gap-2"
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
            <span className="text-red-200 block text-[11px]">Shelter Occupancy</span>
            <span className="font-mono font-bold text-base text-white">2,160 / 3,450 (62%)</span>
          </div>
        </div>
      </div>

      {/* Emergency Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Shelter Capacity Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cyclone Relief Shelters</h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time occupancy, generator fuel status, clean water supplies, and medical staff presence.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('cyclone_shelter_capacity')}
            className="mt-4 w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View 18 Shelters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Hazard Navigation Map */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Safe Evacuation Route</h3>
              <p className="text-xs text-slate-500 mt-1">
                Dynamic routing avoiding waterlogged roads, collapsed bridges, and snapped electrical wires.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('hazard_navigation_map')}
            className="mt-4 w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Navigate Safe Route</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Community Volunteer Proximity Rescue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Volunteer Proximity Team</h3>
              <p className="text-xs text-slate-500 mt-1">
                42 verified community responders within 400m radius ready with stretchers, 4x4 vehicles & dry rations.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('volunteer_proximity')}
            className="mt-4 w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Rescue Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* NDRF War Room Dispatcher */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">NDRF War Room Command</h3>
              <p className="text-xs text-slate-500 mt-1">
                10th Battalion NDRF + SDRF emergency motorized inflatable boats and rescue helicopter units.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ndrf_dispatcher_dashboard')}
            className="mt-4 w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>War Room Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Emergency Control Center Contact Hotline Strip */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 rounded-lg shrink-0">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Emergency Disaster Helplines (Toll-Free 24x7)</h4>
            <p className="text-xs text-slate-400">
              NDRF Control Room: 1078 · Coastal Marine Police: 1093 · Medical Ambulance: 108 · GVMC Disaster Cell: 1800 425 0001
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('district_collector_switcher')}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            District Collector Override
          </button>
          <button
            onClick={() => onNavigate('field_worker_checkin')}
            className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Field Worker Check-In
          </button>
        </div>
      </div>
    </div>
  );
};
