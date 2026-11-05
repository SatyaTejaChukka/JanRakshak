import React, { useState } from 'react';
import { ScreenId, Shelter } from '../types';
import { calculateShelterCapacity } from '../utils/logic';
import {
  ArrowLeft,
  Compass,
  LifeBuoy,
  Users,
  BatteryCharging,
  Droplet,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Flame,
} from 'lucide-react';

interface CycloneReliefShelterProps {
  shelters: Shelter[];
  onNavigate: (screen: ScreenId) => void;
  onUpdateOccupancy: (shelterId: string, delta: number) => void;
  onGoBack?: () => void;
  onSelectShelterForNavigation?: (shelterId: string) => void;
}

export const CycloneReliefShelter: React.FC<CycloneReliefShelterProps> = ({
  shelters,
  onNavigate,
  onUpdateOccupancy,
  onGoBack,
  onSelectShelterForNavigation,
}) => {
  const [selectedShelterId, setSelectedShelterId] = useState<string>('SHL-01');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header with smart dynamic back navigation */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onGoBack ? onGoBack() : onNavigate('citizen_home_disaster'))}
            aria-label="Go Back"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold">Go Back</span>
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>CYCLONE MONTHA EMERGENCY SHELTER MONITOR</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Cyclone Relief Shelter Capacity & Life-Support Dashboard
            </h1>
          </div>
        </div>

        {/* Prototype button element:
            //button[contains(., 'Navigate Safe Route')] -> Dynamic Hazard Navigation Map */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('hazard_navigation_map')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Navigate Safe Route</span>
          </button>
        </div>
      </header>

      {/* Aggregate Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Active Cyclone Centers</span>
          <span className="text-2xl font-black font-mono text-slate-900">18 Shelters</span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">100% Structural Clearance</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Total Occupants Safely Housed</span>
          <span className="text-2xl font-black font-mono text-blue-600">2,160 / 3,450</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">62% Aggregate Fill Rate</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Diesel Generator Reserves</span>
          <span className="text-2xl font-black font-mono text-emerald-600">72 Hours</span>
          <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Fuel stock certified</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Medical Officers Present</span>
          <span className="text-2xl font-black font-mono text-blue-600">24 Doctors</span>
          <span className="text-[10px] text-slate-600 font-medium block mt-0.5">Pediatric & Elder Wings</span>
        </div>
      </div>

      {/* Shelters Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shelters.map((shelter) => {
          const cap = calculateShelterCapacity(shelter.currentOccupants, shelter.totalCapacity);

          return (
            <div
              key={shelter.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
                selectedShelterId === shelter.id
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSelectedShelterId(shelter.id)}
            >
              <div className="space-y-4">
                {/* Card Title & Distance */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">{shelter.id}</span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{shelter.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{shelter.location}</span>
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {shelter.distanceKm} km away
                  </span>
                </div>

                {/* Capacity Progress Ring / Bar */}
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Occupancy</span>
                    <span className="font-mono font-bold text-slate-900">
                      {shelter.currentOccupants} / {shelter.totalCapacity} ({cap.occupancyRate}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cap.isSurgeAlert ? 'bg-red-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${cap.occupancyRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500">
                      Remaining Slots: <strong>{cap.remainingSlots} citizens</strong>
                    </span>
                    {cap.isSurgeAlert && (
                      <span className="text-red-600 font-bold flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3 h-3" /> NEAR CAPACITY
                      </span>
                    )}
                  </div>
                </div>

                {/* Critical Infrastructure Status */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Water Supply</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <Droplet className="w-3.5 h-3.5 text-blue-500" />
                      {shelter.waterSupplyStatus}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Power Backup</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                      {shelter.generatorStatus}
                    </span>
                  </div>
                </div>

                {/* Key Amenities */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Equipped Facilities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {shelter.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Medical Officer & Helpline */}
                <div className="text-xs pt-2 border-t border-slate-100 space-y-1">
                  <div className="text-slate-600">
                    <strong className="text-slate-800">Medical In-Charge:</strong> {shelter.medicalOfficer}
                  </div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <strong className="text-slate-800">Helpline:</strong>{' '}
                    <a href={`tel:${shelter.contactNumber}`} className="text-blue-600 font-mono hover:underline">
                      {shelter.contactNumber}
                    </a>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateOccupancy(shelter.id, -5);
                  }}
                  disabled={shelter.currentOccupants <= 0}
                  className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-lg text-center cursor-pointer"
                  title="Discharge 5 occupants"
                >
                  -5 Out
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateOccupancy(shelter.id, 10);
                  }}
                  disabled={shelter.currentOccupants >= shelter.totalCapacity}
                  className="flex-1 py-2 px-2.5 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-700 text-xs font-semibold rounded-lg text-center cursor-pointer border border-blue-200"
                >
                  +10 Check-In
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectShelterForNavigation) {
                      onSelectShelterForNavigation(shelter.id);
                    }
                    onNavigate('hazard_navigation_map');
                  }}
                  className="flex-1 py-2 px-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
