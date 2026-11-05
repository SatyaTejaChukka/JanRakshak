import React, { useState } from 'react';
import { ScreenId, ElderProfile } from '../types';
import {
  HeartHandshake,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Users,
  Building,
  Save,
} from 'lucide-react';

interface ElderProfileSetupProps {
  elderProfile: ElderProfile;
  onUpdateProfile: (updated: ElderProfile) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ElderProfileSetup: React.FC<ElderProfileSetupProps> = ({
  elderProfile,
  onUpdateProfile,
  onNavigate,
}) => {
  const [fullName, setFullName] = useState(elderProfile.fullName);
  const [age, setAge] = useState(elderProfile.age);
  const [ward, setWard] = useState(elderProfile.ward);
  const [address, setAddress] = useState(elderProfile.address);
  const [floorLevel, setFloorLevel] = useState(elderProfile.floorLevel);
  const [criticalNeeds, setCriticalNeeds] = useState<string[]>(elderProfile.criticalNeeds);
  const [newNeedInput, setNewNeedInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const availableNeeds = [
    'Oxygen Concentrator',
    'Wheelchair Mobility',
    'Insulin Cold Storage',
    'Cardiac Pacemaker',
    'Dialysis Schedule Priority',
    'Bedridden - Stretcher Required',
  ];

  const toggleNeed = (need: string) => {
    if (criticalNeeds.includes(need)) {
      setCriticalNeeds(criticalNeeds.filter((n) => n !== need));
    } else {
      setCriticalNeeds([...criticalNeeds, need]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ElderProfile = {
      ...elderProfile,
      fullName,
      age: Number(age),
      ward,
      address,
      floorLevel,
      criticalNeeds,
    };
    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onNavigate('elder_sos_trigger');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('citizen_home_normal')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors"
          aria-label="Back to Civic Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Civic Portal</span>
        </button>

        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
          REGISTRY ID: {elderProfile.id}
        </span>
      </div>

      {/* Main Profile Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="p-3 bg-red-100 text-red-700 rounded-xl shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>SPECIAL RESILIENCE REGISTRY</span>
              <span>·</span>
              <span>WARD 14 DISASTER CELL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Elder Vulnerability Profile Setup
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Configure medical dependencies, elevator power failure risks, and emergency contacts so volunteers and NDRF rescue boats bring right equipment during disasters.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Elder Full Name(s):
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Age:
              </label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Ward & Municipal Zone:
              </label>
              <input
                type="text"
                required
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Floor & Cyclone Blackout Access Risk:
              </label>
              <input
                type="text"
                required
                value={floorLevel}
                onChange={(e) => setFloorLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Residential Address (GPS Anchor Point):
            </label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600 bg-white"
            />
          </div>

          {/* Critical Needs Checkboxes */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Specialized Medical & Evacuation Dependencies:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableNeeds.map((need) => {
                const active = criticalNeeds.includes(need);
                return (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    className={`p-3 rounded-xl border text-xs text-left font-medium transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-red-50 border-red-300 text-red-900 ring-1 ring-red-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{need}</span>
                    <CheckCircle2
                      className={`w-4 h-4 ${active ? 'text-red-600' : 'text-slate-300'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency Kin Contacts */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Registered Emergency Kin Contacts:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {elderProfile.emergencyContacts.map((contact, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block">{contact.name}</span>
                  <span className="text-slate-500 text-[11px] block">{contact.relation}</span>
                  <span className="font-mono text-blue-600 font-semibold mt-1 block">
                    {contact.phone}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Saving Profile...' : 'Save Profile & Link with Proximity Radar'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('elder_sos_trigger')}
              className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Test Emergency SOS Trigger →
            </button>
          </div>

          {isSaved && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold text-center">
              Elder Vulnerability Profile securely updated and synced with 7 proximity volunteers!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
