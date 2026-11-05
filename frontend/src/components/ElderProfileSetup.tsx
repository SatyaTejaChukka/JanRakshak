import React, { useState } from 'react';
import { ScreenId, ElderProfile } from '../types';
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Save,
  Lock,
  Phone,
  User,
  Heart,
  Activity,
  Flame,
  Waves,
  Building,
  Check,
  Circle,
  FileCheck,
} from 'lucide-react';

interface ElderProfileSetupProps {
  elderProfile: ElderProfile;
  onUpdateProfile: (updated: ElderProfile) => void;
  onNavigate: (screen: ScreenId) => void;
}

type MobilityLevel = 'wheelchair' | 'bedridden' | 'walker' | 'independent';
type FloorLevel = 'ground' | 'first' | 'second_plus';

export const ElderProfileSetup: React.FC<ElderProfileSetupProps> = ({
  elderProfile,
  onUpdateProfile,
  onNavigate,
}) => {
  const [fullName, setFullName] = useState(elderProfile.fullName || 'Kameswari Devi');
  const [age, setAge] = useState<number>(elderProfile.age || 82);
  const [ward, setWard] = useState(elderProfile.ward || 'Ward 14 (Coastal Belt)');
  const [address, setAddress] = useState(elderProfile.address || 'Door 4-12/A, Sea Breeze Enclave, Beach Road, Visakhapatnam');
  
  // Mobility assistance
  const [mobility, setMobility] = useState<MobilityLevel>('wheelchair');
  
  // Floor level
  const [floor, setFloor] = useState<FloorLevel>('ground');
  
  // Medical dependencies
  const [needsContinuousOxygen, setNeedsContinuousOxygen] = useState(true);
  const [isDialysisOrInsulin, setIsDialysisOrInsulin] = useState(true);
  const [hasSensoryImpairment, setHasSensoryImpairment] = useState(false);

  // Caregiver details
  const [caregiverName, setCaregiverName] = useState(
    elderProfile.emergencyContacts[0]?.name || 'Ramesh Chukka (Son)'
  );
  const [caregiverPhone, setCaregiverPhone] = useState(
    elderProfile.emergencyContacts[0]?.phone?.replace('+91 ', '') || '98480 12345'
  );
  
  // Consent & Toast state
  const [consentChecked, setConsentChecked] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDecrementAge = () => {
    if (age > 1) setAge(age - 1);
  };

  const handleIncrementAge = () => {
    if (age < 125) setAge(age + 1);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const compiledNeeds: string[] = [];
    if (needsContinuousOxygen) compiledNeeds.push('Requires continuous oxygen concentrator / portable cylinder');
    if (isDialysisOrInsulin) compiledNeeds.push('Dialysis patient or temperature-sensitive insulin dependent');
    if (hasSensoryImpairment) compiledNeeds.push('Restricted vision or hearing impaired');

    const updatedProfile: ElderProfile = {
      ...elderProfile,
      fullName: fullName.trim(),
      age,
      ward,
      address: address.trim(),
      floorLevel:
        floor === 'ground'
          ? 'Ground Floor (Surge Threat)'
          : floor === 'first'
          ? '1st Floor'
          : '2nd Floor+',
      evacuationDifficulty:
        mobility === 'bedridden' || mobility === 'wheelchair' ? 'High' : 'Medium',
      criticalNeeds: compiledNeeds,
      emergencyContacts: [
        {
          name: caregiverName.trim(),
          relation: 'Primary Caregiver',
          phone: `+91 ${caregiverPhone.trim()}`,
        },
        ...(elderProfile.emergencyContacts.slice(1) || []),
      ],
    };

    onUpdateProfile(updatedProfile);

    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('citizen_home_disaster')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Disaster Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg">
            REGISTRY: {elderProfile.id}
          </span>
          <button
            onClick={() => onNavigate('elder_sos_trigger')}
            className="text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency SOS Screen</span>
          </button>
        </div>
      </div>

      {/* Hero Headline & Statutory Protection Callout */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Emergency Vulnerability Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Mission-critical priority indexing for cyclone & flood rescue operations
            </p>
          </div>
        </div>

        {/* Statutory Protection Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-200/80 px-2 py-0.5 rounded-full font-mono">
                  Statutory Protection
                </span>
                <span className="text-[11px] text-emerald-700 font-bold font-mono">
                  ● 256-Bit Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                This information is securely shared with NDRF 10th Battalion rescue boat squads and verified municipal first-responders <span className="font-bold text-blue-700">ONLY</span> during declared flood and cyclone emergencies (Disaster Management Act §34).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form Card */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Step 1: Resident Identity & Age */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">1. Resident Identity & Age</h2>
            </div>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              Step 1 of 5
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name *
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Resident Age *</label>
                <span className="text-[10px] font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full uppercase">
                  Priority Senior Tier (60+)
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDecrementAge}
                  className="w-12 h-12 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-slate-100 active:scale-95 shadow-xs transition-all cursor-pointer"
                  aria-label="Decrease age"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono leading-none">
                    {age}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5">Years Old</span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrementAge}
                  className="w-12 h-12 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-slate-100 active:scale-95 shadow-xs transition-all cursor-pointer"
                  aria-label="Increase age"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GVMC Ward & Zone *
                </label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address (GPS Anchor Point) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Mobility Assistance Level */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">2. Mobility Assistance Level</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Single Select</span>
          </div>
          <p className="text-xs text-slate-500">
            Crucial for NDRF boat squad equipment (stretchers vs lifting harnesses):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Wheelchair User */}
            <button
              type="button"
              onClick={() => setMobility('wheelchair')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer ${
                mobility === 'wheelchair'
                  ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    mobility === 'wheelchair' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </div>
                {mobility === 'wheelchair' ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div>
                <div className={`text-sm font-bold leading-tight ${mobility === 'wheelchair' ? 'text-blue-900' : 'text-slate-900'}`}>
                  Wheelchair User
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Ramp / hoist vital</div>
              </div>
            </button>

            {/* Bedridden */}
            <button
              type="button"
              onClick={() => setMobility('bedridden')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer ${
                mobility === 'bedridden'
                  ? 'bg-red-50/90 border-red-500 ring-1 ring-red-500 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    mobility === 'bedridden' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                </div>
                {mobility === 'bedridden' ? (
                  <CheckCircle2 className="w-5 h-5 text-red-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div>
                <div className={`text-sm font-bold leading-tight ${mobility === 'bedridden' ? 'text-red-900' : 'text-slate-900'}`}>
                  Bedridden
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Stretcher evacuation squad</div>
              </div>
            </button>

            {/* Walker / Cane */}
            <button
              type="button"
              onClick={() => setMobility('walker')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer ${
                mobility === 'walker'
                  ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    mobility === 'walker' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                {mobility === 'walker' ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div>
                <div className={`text-sm font-bold leading-tight ${mobility === 'walker' ? 'text-blue-900' : 'text-slate-900'}`}>
                  Walker / Cane
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Assisted steadying needed</div>
              </div>
            </button>

            {/* Independent */}
            <button
              type="button"
              onClick={() => setMobility('independent')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer ${
                mobility === 'independent'
                  ? 'bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    mobility === 'independent' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </div>
                {mobility === 'independent' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div>
                <div className={`text-sm font-bold leading-tight ${mobility === 'independent' ? 'text-emerald-900' : 'text-slate-900'}`}>
                  Independent
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Self-locomoting with guide</div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 3: Residence Floor Level & Inundation Model */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">3. Residence Floor Level</h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full uppercase">
              Inundation Model
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Ground floor dwellings face the <strong className="text-red-700">highest flash flood and storm surge risk</strong> in coastal wards during cyclone breaches.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* Ground Floor (Critical Risk) */}
            <button
              type="button"
              onClick={() => setFloor('ground')}
              className={`w-full min-h-[56px] px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                floor === 'ground'
                  ? 'bg-red-800 text-white border-red-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Waves className="w-5 h-5 text-red-300" />
                <div>
                  <div className="text-sm font-bold leading-tight">Ground Floor</div>
                  <div className={`text-xs mt-0.5 ${floor === 'ground' ? 'text-red-200' : 'text-slate-500'}`}>
                    Direct coastal surge water ingress zone
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-red-600 text-white border border-red-500 tracking-wider flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Critical Risk
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              {/* 1st Floor */}
              <button
                type="button"
                onClick={() => setFloor('first')}
                className={`min-h-[50px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  floor === 'first'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold">1st Floor</span>
                </div>
                {floor === 'first' ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
              </button>

              {/* 2nd Floor+ */}
              <button
                type="button"
                onClick={() => setFloor('second_plus')}
                className={`min-h-[50px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  floor === 'second_plus'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold">2nd Floor+</span>
                </div>
                {floor === 'second_plus' ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Step 4: Critical Medical Dependencies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-bold text-slate-900">4. Critical Medical Needs</h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {[needsContinuousOxygen, isDialysisOrInsulin, hasSensoryImpairment].filter(Boolean).length} Selected
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Pre-flags oxygen tank logistics and emergency generator battery priority:
          </p>

          <div className="space-y-2.5 pt-1">
            {/* Need 1: Oxygen */}
            <label
              onClick={() => setNeedsContinuousOxygen(!needsContinuousOxygen)}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                needsContinuousOxygen
                  ? 'bg-blue-50/80 border-blue-400 text-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  needsContinuousOxygen ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                }`}
              >
                {needsContinuousOxygen && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block leading-snug">
                  Requires continuous oxygen concentrator / portable cylinder
                </span>
                <span className="text-[11px] text-blue-700 mt-0.5 block font-medium">
                  Automatic dispatch notification for battery generator support
                </span>
              </div>
            </label>

            {/* Need 2: Dialysis / Insulin */}
            <label
              onClick={() => setIsDialysisOrInsulin(!isDialysisOrInsulin)}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                isDialysisOrInsulin
                  ? 'bg-blue-50/80 border-blue-400 text-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isDialysisOrInsulin ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                }`}
              >
                {isDialysisOrInsulin && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block leading-snug">
                  Dialysis patient or daily temperature-sensitive insulin dependent
                </span>
                <span className="text-[11px] text-blue-700 mt-0.5 block font-medium">
                  Refrigerated medic bag flagged for relief boat
                </span>
              </div>
            </label>

            {/* Need 3: Sensory */}
            <label
              onClick={() => setHasSensoryImpairment(!hasSensoryImpairment)}
              className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                hasSensoryImpairment
                  ? 'bg-blue-50/80 border-blue-400 text-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  hasSensoryImpairment ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                }`}
              >
                {hasSensoryImpairment && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-900 block leading-snug">
                  Restricted vision or hearing impaired
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Tactile and visual siren signal protocol
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Step 5: Emergency Family Caregiver */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">5. Emergency Family Caregiver</h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
              Auto-Paired
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Caregiver Contact Name *
              </label>
              <input
                type="text"
                required
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Emergency SOS Mobile Number *
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 font-mono">
                  ● SMS Pairing Verified
                </span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-xs font-bold text-slate-700 font-mono">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  className="w-full h-11 pl-12 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Legal Consent Box */}
        <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-200 text-xs text-slate-700 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium leading-relaxed">
              I consent to attaching this medical profile to SOS alerts during declared disasters to accelerate rescue triage and authorize NDRF medical teams access.
            </span>
          </label>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pl-7">
            <Lock className="w-3.5 h-3.5" />
            <span>Revocable anytime through Municipal UID portal. No commercial sharing.</span>
          </div>
        </div>

        {/* Save Button & Offline Pin Notice */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Synchronizing...' : 'Save Emergency Profile'}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Available offline on local device cache during cellular blackouts</span>
          </div>
        </div>
      </form>

      {/* Floating Synchronization Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-sm w-full mx-4 bg-slate-900 text-white p-4 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-bold text-white">Profile Synchronized</div>
            <div className="text-[11px] text-slate-300">
              Linked to Resident {fullName} (Age {age})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
