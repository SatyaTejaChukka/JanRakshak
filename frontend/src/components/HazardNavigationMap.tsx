import React, { useState } from 'react';
import { ScreenId, HazardIncident } from '../types';
import {
  Compass,
  ArrowLeft,
  AlertTriangle,
  LifeBuoy,
  Shield,
  Layers,
  MapPin,
  CheckCircle2,
  Navigation,
  Flame,
  Radio,
} from 'lucide-react';

interface HazardNavigationMapProps {
  hazards: HazardIncident[];
  onNavigate: (screen: ScreenId) => void;
}

export const HazardNavigationMap: React.FC<HazardNavigationMapProps> = ({ hazards, onNavigate }) => {
  const [selectedHazardId, setSelectedHazardId] = useState<string>('HAZ-101');
  const [avoidHazards, setAvoidHazards] = useState(true);

  const selectedHazard = hazards.find((h) => h.id === selectedHazardId) || hazards[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('citizen_home_disaster')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors w-fit"
          aria-label="Back to Disaster Hub"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Disaster Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('cyclone_shelter_capacity')}
            className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200"
          >
            Cyclone Relief Shelters
          </button>
          <button
            onClick={() => onNavigate('volunteer_proximity')}
            className="text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg border border-emerald-200"
          >
            Volunteer Rescue Radar
          </button>
        </div>
      </div>

      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-mono font-bold uppercase">
              <Compass className="w-4 h-4" />
              <span>DYNAMIC AI HAZARD AVOIDANCE ROUTING</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Dynamic Hazard Navigation Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Live algorithmic route recalculation bypassing deep waterlogging, live fallen 11kV cables, and snapped trees during Cyclone Montha.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={avoidHazards}
                onChange={(e) => setAvoidHazards(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Auto-Detour Active Hazards</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Interactive Schematic Map & Hazard Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas Visualizer */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 text-white relative overflow-hidden min-h-[440px] flex flex-col justify-between">
          {/* Map Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs bg-slate-900/90 backdrop-blur p-2.5 px-3 rounded-xl border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              DESTINATION: AU INDOOR STADIUM CYCLONE RELIEF SHELTER
            </span>
            <span className="font-mono text-slate-400">SAFE DISTANCE: 1.4 KM · ETA 6 MINS</span>
          </div>

          {/* SVG Schematic Route & Hazards Overlay */}
          <div className="relative z-10 my-6 h-64 sm:h-72 w-full flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 600 300">
              {/* Coastline indication */}
              <path
                d="M 500,0 Q 480,150 520,300"
                fill="none"
                stroke="#1e293b"
                strokeWidth="24"
                strokeDasharray="4 4"
              />
              <text x="520" y="40" fill="#64748b" fontSize="10" fontFamily="monospace">
                BAY OF BENGAL (SURGE ZONE)
              </text>

              {/* Dangerous Blocked Route (Red Dashed) */}
              <path
                d="M 60,240 L 220,160 L 370,100 L 460,70"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray="6 6"
                opacity={avoidHazards ? '0.35' : '0.9'}
              />

              {/* Dynamic Recommended Safe Route (Emerald Solid) */}
              <path
                d="M 60,240 Q 140,270 240,240 T 420,180 T 460,70"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Route checkpoints */}
              {/* Origin Citizen Home */}
              <circle cx="60" cy="240" r="8" fill="#3b82f6" />
              <text x="50" y="270" fill="#93c5fd" fontSize="11" fontWeight="bold">
                Your Location (Coastal Ward 14)
              </text>

              {/* Destination Shelter */}
              <circle cx="460" cy="70" r="10" fill="#10b981" />
              <text x="400" y="55" fill="#34d399" fontSize="11" fontWeight="bold">
                AU Shelter (Elevated)
              </text>

              {/* Hazard 101: Waterlogging on old route */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHazardId('HAZ-101')}
              >
                <circle cx="220" cy="160" r="14" fill="#ef4444" opacity="0.3" className="animate-ping" />
                <circle cx="220" cy="160" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                <text x="170" y="145" fill="#fca5a5" fontSize="10" fontWeight="bold">
                  HAZ-101 (Waterlogging 3.5ft)
                </text>
              </g>

              {/* Hazard 102: Live Snapped Cable */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHazardId('HAZ-102')}
              >
                <circle cx="370" cy="100" r="14" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                <circle cx="370" cy="100" r="8" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                <text x="320" y="85" fill="#fde68a" fontSize="10" fontWeight="bold">
                  HAZ-102 (11kV Wire Down)
                </text>
              </g>

              {/* Hazard 103: Uprooted Tree */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHazardId('HAZ-103')}
              >
                <circle cx="480" cy="200" r="8" fill="#a855f7" stroke="#fff" strokeWidth="2" />
                <text x="440" y="225" fill="#d8b4fe" fontSize="10" fontWeight="bold">
                  HAZ-103 (Fallen Tree)
                </text>
              </g>
            </svg>
          </div>

          {/* Route recommendation caption */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-300">
                Recommended Green Path: Hill Top Highway (Elevated Ridge, Zero Waterlogging)
              </span>
            </div>
            <button
              onClick={() => onNavigate('cyclone_shelter_capacity')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline"
            >
              Check Shelter Capacity & Amenities →
            </button>
          </div>
        </div>

        {/* Right Hazard Detail Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Active Roadway Hazards (3 Detected)</h3>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              REAL-TIME GPS
            </span>
          </div>

          <div className="space-y-2.5">
            {hazards.map((hazard) => (
              <button
                key={hazard.id}
                type="button"
                onClick={() => setSelectedHazardId(hazard.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedHazardId === hazard.id
                    ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{hazard.id}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      hazard.severity === 'Extreme'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hazard.severity} Danger
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mt-1">{hazard.type}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{hazard.recommendedAction}</p>
              </button>
            ))}
          </div>

          {/* Selected Hazard Spotlight Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Inspection Brief: {selectedHazard.type}</span>
            </div>
            <p className="text-slate-600">{selectedHazard.recommendedAction}</p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
              <span className="font-bold text-slate-700">Evacuation Impact: </span>
              {selectedHazard.isEvacuationRouteImpacted
                ? 'High danger! Main artery blocked, automated detour in effect.'
                : 'Minor lane obstruction, passable with care.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
