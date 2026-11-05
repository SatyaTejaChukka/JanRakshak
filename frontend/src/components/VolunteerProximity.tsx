import React, { useState } from 'react';
import { ScreenId, ElderProfile } from '../types';
import {
  Users,
  ArrowLeft,
  Navigation,
  Shield,
  Phone,
  CheckCircle2,
  Clock,
  Radio,
  MapPin,
  HeartHandshake,
  AlertOctagon,
} from 'lucide-react';

interface VolunteerProximityProps {
  elderProfile: ElderProfile;
  onNavigate: (screen: ScreenId) => void;
  onGoBack?: () => void;
}

interface Volunteer {
  id: string;
  name: string;
  distanceMeters: number;
  etaMinutes: number;
  role: string;
  equipment: string;
  phone: string;
  status: 'En Route' | 'Arrived' | 'Standby';
  isVerified: boolean;
}

export const VolunteerProximity: React.FC<VolunteerProximityProps> = ({ elderProfile, onNavigate, onGoBack }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: 'VOL-01',
      name: 'K. Sai Kumar',
      distanceMeters: 140,
      etaMinutes: 3,
      role: 'Ward 14 Youth Wing Captain',
      equipment: 'Folding Stretcher & First Aid Trauma Pack',
      phone: '+91 98480 11990',
      status: 'En Route',
      isVerified: true,
    },
    {
      id: 'VOL-02',
      name: 'P. Venkat & Team (2 members)',
      distanceMeters: 220,
      etaMinutes: 5,
      role: 'Fishermen Community Rescuer',
      equipment: 'Inflatable Raft & Life Jackets',
      phone: '+91 94401 88776',
      status: 'En Route',
      isVerified: true,
    },
    {
      id: 'VOL-03',
      name: 'Dr. Archana M.',
      distanceMeters: 310,
      etaMinutes: 7,
      role: 'Resident Medical Officer (PHC)',
      equipment: 'Portable Oxygen Cylinder & BP Monitor',
      phone: '+91 91234 44332',
      status: 'En Route',
      isVerified: true,
    },
    {
      id: 'VOL-04',
      name: 'T. Nagesh',
      distanceMeters: 450,
      etaMinutes: 10,
      role: 'Civil Defence Volunteer',
      equipment: 'High-Torque 4x4 Bolero for Evacuation',
      phone: '+91 97000 66554',
      status: 'Standby',
      isVerified: true,
    },
  ]);

  const handleUpdateStatus = (id: string) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: v.status === 'En Route' ? 'Arrived' : 'En Route' } : v))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => (onGoBack ? onGoBack() : onNavigate('citizen_home_disaster'))}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors w-fit active:scale-95 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('elder_sos_trigger')}
            className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg border border-red-200"
          >
            Trigger Elder SOS
          </button>
          <button
            onClick={() => onNavigate('hazard_navigation_map')}
            className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200"
          >
            Safe Route Map
          </button>
        </div>
      </div>

      {/* Target Mission Overview */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>ACTIVE 500M HYPERLOCAL PROXIMITY GRID</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Emergency Elder Evacuation: {elderProfile.fullName}
            </h1>
            <p className="text-xs text-slate-300">
              Address: {elderProfile.address} ({elderProfile.floorLevel})
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 px-4 shrink-0 flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block font-mono">Active Responders</span>
              <span className="text-xl font-bold font-mono text-emerald-400">4 En Route</span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block font-mono">Closest ETA</span>
              <span className="text-xl font-bold font-mono text-white">~3 Mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proximity Radar Simulation Widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Distance Radar & Responders</h2>
            <p className="text-xs text-slate-500">Volunteers with geotagged civilian badges and equipment verified</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
            4 Responders Matched
          </span>
        </div>

        {/* Radar Graphic Simulation */}
        <div className="relative w-full h-56 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {/* Concentric rings */}
          <div className="absolute w-28 h-28 border border-emerald-500/30 rounded-full" />
          <div className="absolute w-44 h-44 border border-emerald-500/20 rounded-full" />
          <div className="absolute w-64 h-64 border border-emerald-500/10 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-emerald-500/15" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-px bg-emerald-500/15" />
          </div>

          {/* Center Target: Elder */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white animate-ping absolute" />
            <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white relative z-10 flex items-center justify-center text-[10px] text-white font-bold">
              SOS
            </div>
            <span className="text-[10px] font-bold text-white bg-red-950/80 px-1.5 py-0.5 rounded mt-1">
              Target Elder Home
            </span>
          </div>

          {/* Blips */}
          <div className="absolute top-14 left-1/3 flex items-center gap-1">
            <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full border border-white animate-pulse" />
            <span className="text-[10px] text-emerald-300 font-mono bg-black/70 px-1 rounded">
              Sai Kumar (140m)
            </span>
          </div>

          <div className="absolute bottom-12 right-1/4 flex items-center gap-1">
            <div className="w-3.5 h-3.5 bg-blue-400 rounded-full border border-white animate-pulse" />
            <span className="text-[10px] text-blue-300 font-mono bg-black/70 px-1 rounded">
              Boat Team (220m)
            </span>
          </div>

          <div className="absolute top-10 right-1/3 flex items-center gap-1">
            <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full border border-white animate-pulse" />
            <span className="text-[10px] text-emerald-300 font-mono bg-black/70 px-1 rounded">
              Dr. Archana (310m)
            </span>
          </div>
        </div>

        {/* Responders List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{vol.name}</span>
                    {vol.isVerified && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-100">
                        Verified Volunteer
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      vol.status === 'Arrived'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vol.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1">{vol.role}</p>

                <div className="mt-2 text-xs bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Proximity Distance:</span>
                    <span className="font-mono font-bold text-slate-700">{vol.distanceMeters} Meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Arrival:</span>
                    <span className="font-mono font-bold text-emerald-700">{vol.etaMinutes} Mins</span>
                  </div>
                  <div className="text-slate-600 pt-1 text-[11px] border-t border-slate-100">
                    <strong className="text-slate-700">Gear:</strong> {vol.equipment}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${vol.phone}`}
                  className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 text-center flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call {vol.phone}</span>
                </a>
                <button
                  onClick={() => handleUpdateStatus(vol.id)}
                  className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  {vol.status === 'En Route' ? 'Mark Arrived' : 'Mark En Route'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
