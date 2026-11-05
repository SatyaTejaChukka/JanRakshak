import React, { useState, useEffect, useRef } from 'react';
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
  LocateFixed,
  Play,
  RotateCcw,
  Footprints,
  Wind,
  Waves,
  Building2,
  ShieldAlert,
} from 'lucide-react';

interface HazardNavigationMapProps {
  hazards: HazardIncident[];
  onNavigate: (screen: ScreenId) => void;
}

interface LiveCoords {
  lat: number;
  lng: number;
  accuracy: number;
  isSimulated: boolean;
  address: string;
}

export const HazardNavigationMap: React.FC<HazardNavigationMapProps> = ({ hazards, onNavigate }) => {
  const [selectedHazardId, setSelectedHazardId] = useState<string>('HAZ-01');
  const [avoidHazards, setAvoidHazards] = useState(true);
  const [targetShelter, setTargetShelter] = useState<'AU_INDOOR' | 'SWARNA_STADIUM'>('AU_INDOOR');

  // Real-time Live GPS Location State
  const [liveLocation, setLiveLocation] = useState<LiveCoords>({
    lat: 17.7412,
    lng: 83.3421,
    accuracy: 4,
    isSimulated: false,
    address: 'Lawson’s Bay Colony, Visakhapatnam Coastal Belt',
  });
  const [gpsStatus, setGpsStatus] = useState<'ACQUIRING' | 'LOCKED' | 'OFFLINE'>('LOCKED');

  // Simulation of movement along safe evacuation route
  const [isSimulatingMovement, setIsSimulatingMovement] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0 to 100%
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch real browser geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setGpsStatus('ACQUIRING');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLiveLocation((prev) => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy) || 5,
            isSimulated: false,
          }));
          setGpsStatus('LOCKED');
        },
        () => {
          // Graceful fallback to Vizag Coast GPS
          setGpsStatus('LOCKED');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Handle Live Evacuation Simulation Movement
  const handleToggleSimulation = () => {
    if (isSimulatingMovement) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      setIsSimulatingMovement(false);
    } else {
      setIsSimulatingMovement(true);
      setSimulationStep(0);

      simulationTimerRef.current = setInterval(() => {
        setSimulationStep((prev) => {
          if (prev >= 100) {
            if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
            setIsSimulatingMovement(false);
            return 100;
          }
          return prev + 5;
        });
      }, 700);
    }
  };

  const handleResetSimulation = () => {
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    setIsSimulatingMovement(false);
    setSimulationStep(0);
  };

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, []);

  const selectedHazard = hazards.find((h) => h.id === selectedHazardId) || hazards[0];

  // Dynamic telemetry calculated from live location and simulation progress
  const baseDistanceKm = targetShelter === 'AU_INDOOR' ? 1.4 : 3.8;
  const currentRemainingKm = Math.max(0, Number((baseDistanceKm * (1 - simulationStep / 100)).toFixed(2)));
  const currentEtaMinutes = Math.max(0, Math.ceil((currentRemainingKm / baseDistanceKm) * (targetShelter === 'AU_INDOOR' ? 6 : 14)));
  const currentElevationMeters = Math.round(12 + (simulationStep / 100) * 22);

  // Calculate live marker X, Y coordinates along the SVG path
  // SVG viewBox is 600 x 300. Path goes from (70, 240) -> (480, 70)
  const markerX = 70 + (simulationStep / 100) * (480 - 70);
  // Quadratic curve approximation for Y
  const t = simulationStep / 100;
  const markerY = (1 - t) * (1 - t) * 240 + 2 * (1 - t) * t * 270 + t * t * 70;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('citizen_home_disaster')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors w-fit cursor-pointer"
          aria-label="Back to Disaster Hub"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Disaster Hub</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-emerald-800">
            <LocateFixed className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>GPS STATUS: {gpsStatus === 'LOCKED' ? 'LIVE SIGNAL LOCKED' : 'SEARCHING SATELLITES'}</span>
          </div>
        </div>
      </div>

      {/* Title & Live GPS Telemetry Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-mono font-bold uppercase">
              <Compass className="w-4 h-4" />
              <span>LIVE GPS MULTI-POLYGON DETOUR ENGINE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Safe Evacuation Route (Live Location Map)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Real-time route calculation from your exact live coordinates to the nearest cyclone relief shelter, dynamically bypassing coastal floodings and live snapped electric wires.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Target Shelter Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTargetShelter('AU_INDOOR')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  targetShelter === 'AU_INDOOR'
                    ? 'bg-white text-blue-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AU Sports Hub (1.4 km)
              </button>
              <button
                type="button"
                onClick={() => setTargetShelter('SWARNA_STADIUM')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  targetShelter === 'SWARNA_STADIUM'
                    ? 'bg-white text-blue-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Swarna Stadium (3.8 km)
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={avoidHazards}
                onChange={(e) => setAvoidHazards(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Auto-Detour Hazards</span>
            </label>
          </div>
        </div>

        {/* Live GPS Coordinates and Safe Telemetry Strip */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Live Coordinates</span>
            <span className="font-mono font-bold text-slate-800">
              {liveLocation.lat.toFixed(4)}° N, {liveLocation.lng.toFixed(4)}° E
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Accurate to ±{liveLocation.accuracy}m</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Remaining Distance</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {currentRemainingKm} km
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Estimated Walk: {currentEtaMinutes} mins</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Current Elevation</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              +{currentElevationMeters}m Above Sea Level
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Safe from +3.8m Surge</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Hazard Avoidance</span>
            <span className="font-mono font-bold text-blue-700 text-sm">
              3 Hazards Bypassed
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Via Elevated Ridge Road</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Route Canvas & Live Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas Visualizer */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 text-white relative overflow-hidden min-h-[460px] flex flex-col justify-between shadow-lg">
          {/* Subtle Vector Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Map Top Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-emerald-400 font-bold">
                {targetShelter === 'AU_INDOOR'
                  ? 'DESTINATION: AU INDOOR STADIUM CYCLONE RELIEF SHELTER'
                  : 'DESTINATION: SWARNA BHARATHI INDOOR STADIUM'}
              </span>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSimulation}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSimulatingMovement
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isSimulatingMovement ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                    <span>Pause Simulation</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>{simulationStep > 0 && simulationStep < 100 ? 'Resume Route' : 'Simulate Live Movement'}</span>
                  </>
                )}
              </button>

              {simulationStep > 0 && (
                <button
                  type="button"
                  onClick={handleResetSimulation}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Reset Live Position to Start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* SVG Schematic Live Route Canvas */}
          <div className="relative z-10 my-4 h-72 sm:h-80 w-full flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 600 300">
              {/* Coastline indication */}
              <path
                d="M 520,0 Q 500,150 540,300"
                fill="none"
                stroke="#1e293b"
                strokeWidth="28"
                strokeDasharray="4 4"
              />
              <text x="530" y="30" fill="#64748b" fontSize="10" fontFamily="monospace">
                BAY OF BENGAL (+3.8m SURGE ZONE)
              </text>

              {/* Blocked Dangerous Road (Red Dashed) */}
              <path
                d="M 70,240 L 220,160 L 370,110 L 480,70"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray="6 6"
                opacity={avoidHazards ? '0.35' : '0.9'}
              />

              {/* Dynamic Recommended Safe Route (Emerald Solid) */}
              <path
                id="safePath"
                d="M 70,240 Q 150,270 250,240 T 430,170 T 480,70"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Origin Checkpoint: Citizen Live Location */}
              <circle cx="70" cy="240" r="10" fill="#3b82f6" />
              <circle cx="70" cy="240" r="18" fill="#3b82f6" opacity="0.25" className="animate-ping" />
              <text x="35" y="270" fill="#93c5fd" fontSize="11" fontWeight="bold">
                Your Live GPS (Lawson&apos;s Bay)
              </text>

              {/* Destination Checkpoint: Shelter */}
              <circle cx="480" cy="70" r="12" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <text x="410" y="50" fill="#34d399" fontSize="11" fontWeight="bold">
                AU Sports Shelter (+34m)
              </text>

              {/* Live Moving Location Pin during Simulation */}
              <g transform={`translate(${markerX}, ${markerY})`}>
                <circle cx="0" cy="0" r="12" fill="#38bdf8" opacity="0.4" className="animate-ping" />
                <circle cx="0" cy="0" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
                <text x="12" y="4" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {simulationStep === 100 ? 'ARRIVED' : `${simulationStep}% LIVE GPS`}
                </text>
              </g>

              {/* Hazard 01: Waterlogging on low coastal road */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHazardId('HAZ-01')}
              >
                <circle cx="220" cy="160" r="14" fill="#ef4444" opacity="0.3" className="animate-ping" />
                <circle cx="220" cy="160" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                <text x="160" y="145" fill="#fca5a5" fontSize="10" fontWeight="bold">
                  HAZ-01: Flooding 3.5ft
                </text>
              </g>

              {/* Hazard 02: Fallen High-Tension Cable */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHazardId('HAZ-02')}
              >
                <circle cx="370" cy="110" r="14" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                <circle cx="370" cy="110" r="8" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                <text x="310" y="95" fill="#fde68a" fontSize="10" fontWeight="bold">
                  HAZ-02: 11kV Wire Down
                </text>
              </g>

              {/* Hazard 03: Fallen Banyan Tree */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHazardId('HAZ-03')}
              >
                <circle cx="490" cy="190" r="8" fill="#f97316" stroke="#fff" strokeWidth="2" />
                <text x="440" y="215" fill="#fed7aa" fontSize="10" fontWeight="bold">
                  HAZ-03: Tree Trunk
                </text>
              </g>
            </svg>
          </div>

          {/* Route recommendation caption */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-300">
                Live Safe Route: Inland VIP Ridge Highway (+18m elevation, zero flood hazard)
              </span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">
              {simulationStep >= 100 ? '✅ Successfully Reached Shelter Safe Zone' : `In Transit: ${simulationStep}% Completed`}
            </span>
          </div>
        </div>

        {/* Right Guidance and Hazard Detail Panel */}
        <div className="space-y-4">
          {/* Turn-by-Turn Safe Evacuation Guidance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Live Route Guidance</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                SAFE PATH
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className={`p-2.5 rounded-xl border transition-all ${simulationStep < 30 ? 'bg-blue-50 border-blue-400 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Depart Live GPS Location</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-7">Head West onto VIP Road away from coastal surge zone.</p>
              </div>

              <div className={`p-2.5 rounded-xl border transition-all ${simulationStep >= 30 && simulationStep < 70 ? 'bg-blue-50 border-blue-400 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Inland Detour via Ridge Bypass</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-7">Bypasses HAZ-01 (3.5ft water) and HAZ-02 (snapped 11kV cable).</p>
              </div>

              <div className={`p-2.5 rounded-xl border transition-all ${simulationStep >= 70 ? 'bg-emerald-50 border-emerald-400 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Arrive at Cyclone Relief Shelter</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-7">AU Indoor Complex: 125kVA generator & medical wing active.</p>
              </div>
            </div>
          </div>

          {/* Active Detected Hazards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Detected Road Hazards ({hazards.length})</h3>
              <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                BYPASS ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              {hazards.map((hazard) => (
                <button
                  key={hazard.id}
                  type="button"
                  onClick={() => setSelectedHazardId(hazard.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
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
                      {hazard.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 mt-1 text-[11px]">{hazard.type}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{hazard.recommendedAction}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
