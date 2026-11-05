import React, { useState } from 'react';
import { ScreenId, ElderProfile } from '../types';
import { JanRakshakAPI } from '../services/api';
import {
  AlertTriangle,
  ArrowLeft,
  PhoneCall,
  Users,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  Radio,
  Clock,
  Shield,
  Send,
} from 'lucide-react';

interface ElderSOSTriggerProps {
  elderProfile: ElderProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const ElderSOSTrigger: React.FC<ElderSOSTriggerProps> = ({ elderProfile, onNavigate }) => {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [selectedUrgency, setSelectedUrgency] = useState<'Oxygen & Critical Care' | 'Immediate Evacuation' | 'Waterlogged Ground Floor'>('Immediate Evacuation');
  const [alertDispatched, setAlertDispatched] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sosDetails, setSosDetails] = useState<{
    sosEventId: string;
    assignedUnit: string;
    proximityCount: number;
  }>({
    sosEventId: 'SOS-2026-AP14-0891',
    assignedUnit: 'NDRF 10th Bn IRB Boat #04',
    proximityCount: 4,
  });

  const handleTriggerSOS = () => {
    setSosTriggered(true);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setAlertDispatched(true);
          // Wire real emergency dispatch to FastAPI backend
          JanRakshakAPI.triggerSOS({
            triggerType: selectedUrgency,
            batteryPercentage: 88,
          })
            .then((res) => {
              if (res) {
                setSosDetails({
                  sosEventId: res.sosEventId || 'SOS-2026-AP14-0891',
                  assignedUnit: res.assignedUnit || 'NDRF 10th Bn IRB Boat #04',
                  proximityCount: res.proximityVolunteerCount || 4,
                });
              }
            })
            .catch(() => {});
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header with back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('citizen_home_disaster')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors"
          aria-label="Back to Disaster Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Disaster Hub</span>
        </button>
        <span className="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
          GPS LOCK: ACCURACY ±3 METERS
        </span>
      </div>

      {/* Main SOS Trigger Card */}
      <div className="bg-white rounded-2xl border-2 border-red-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex p-3 rounded-full bg-red-100 text-red-600 mb-1">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Emergency Elder SOS Trigger
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Sends instantaneous high-priority distress alerts simultaneously to the NDRF War Room, Ward 14 Disaster Coordinator, and 7 verified proximity volunteers within 300 meters.
          </p>
        </div>

        {/* Registered Elder Snapshot Card */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                REGISTERED VULNERABILITY PROFILE
              </span>
              <h3 className="text-base font-bold text-slate-900">{elderProfile.fullName}</h3>
              <p className="text-xs text-slate-500">Age {elderProfile.age} · {elderProfile.ward}</p>
            </div>
            <button
              onClick={() => onNavigate('elder_profile_setup')}
              className="text-xs text-blue-600 font-semibold underline hover:text-blue-700"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-2 border-t border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">Location / Address:</span>
              <span className="font-medium">{elderProfile.address}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Access & Mobility:</span>
              <span className="font-medium text-amber-700">{elderProfile.floorLevel}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-slate-400 block text-[11px] mb-1">Critical Medical Needs:</span>
            <div className="flex flex-wrap gap-1.5">
              {elderProfile.criticalNeeds.map((need, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200"
                >
                  {need}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SOS Situation Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Select Immediate Danger Context:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(['Immediate Evacuation', 'Oxygen & Critical Care', 'Waterlogged Ground Floor'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedUrgency(type)}
                className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedUrgency === type
                    ? 'border-red-600 bg-red-50 text-red-800 shadow-xs ring-1 ring-red-600'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Big Action Button */}
        {!alertDispatched ? (
          <div className="pt-2">
            <button
              onClick={handleTriggerSOS}
              disabled={countdown !== null}
              className="w-full py-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-lg transition-all active:scale-[0.99] flex flex-col items-center justify-center gap-1 cursor-pointer"
            >
              {countdown !== null ? (
                <span className="text-yellow-200 animate-ping text-2xl font-mono">
                  Broadcasting in {countdown}...
                </span>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Radio className="w-6 h-6 animate-pulse" />
                    <span>BROADCAST ELDER RESCUE SOS NOW</span>
                  </div>
                  <span className="text-xs font-normal text-red-100">
                    One-tap priority alert to NDRF & 7 local proximity volunteers
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-full text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-emerald-900">
                  DISTRESS SOS ACTIVATED & TRANSMITTED
                </h4>
                <p className="text-xs text-emerald-700 font-mono">
                  Priority Incident ID: {sosDetails.sosEventId} · Channel NDRF-CH-3
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white rounded-lg p-3 border border-emerald-200">
              <div>
                <span className="text-slate-400 block text-[11px]">NDRF War Room</span>
                <span className="font-bold text-slate-800">{sosDetails.assignedUnit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Local Volunteers</span>
                <span className="font-bold text-slate-800">{sosDetails.proximityCount} Volunteers Responding</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated Arrival</span>
                <span className="font-bold text-emerald-700 font-mono">7 to 10 Minutes</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onNavigate('volunteer_proximity')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Track Responding Volunteers On Radar</span>
              </button>
              <button
                onClick={() => onNavigate('ndrf_dispatcher_dashboard')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>View NDRF War Room Console</span>
              </button>
            </div>
          </div>
        )}

        {/* Emergency family call direct link */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
          <span>Automatic SMS alert queued to registered kin: Dr. S. Ravi (+91 98490 88211)</span>
          <button
            onClick={() => onNavigate('volunteer_proximity')}
            className="text-blue-600 font-semibold underline hover:text-blue-800"
          >
            Switch to Volunteer Proximity View →
          </button>
        </div>
      </div>
    </div>
  );
};
