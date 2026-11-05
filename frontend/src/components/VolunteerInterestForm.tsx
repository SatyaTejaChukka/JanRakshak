import React, { useState } from 'react';
import { ScreenId, VolunteerApplication } from '../types';
import {
  HeartHandshake,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  LifeBuoy,
  Phone,
  User,
  MapPin,
  Wrench,
  Truck,
  Flame,
  Radio,
  FileCheck,
  Clock,
} from 'lucide-react';

interface VolunteerInterestFormProps {
  onNavigate: (screen: ScreenId) => void;
  onSubmitApplication: (application: VolunteerApplication) => void;
}

const AVAILABLE_SKILLS = [
  'First Aid & CPR',
  'Swimming & Water Rescue',
  'Chainsaw & Tree Clearing',
  '4x4 Off-Road Driving',
  'Medical / Nursing Support',
  'Ham Radio / Wireless Comms',
  'Motorized Boat Operation',
  'Relief Food & Supply Logistics',
  'Elderly & Wheelchair Evacuation',
  'Electrical Hazard Tagging',
];

const AVAILABLE_EQUIPMENT = [
  'Inflatable Raft / Motor Boat',
  'Mahindra Thar / 4x4 High-Clearance Vehicle',
  'Electric Chainsaw / Tree Cutter',
  'Heavy Duty Rope & Climbing Harness',
  'Life Jackets (2+ units)',
  'Portable Petrol Generator (> 2kVA)',
  'Trauma First Aid Kit & Pulse Oximeter',
  'Handheld VHF/UHF Ham Radio',
  'Surveillance / Search Drone',
];

export const VolunteerInterestForm: React.FC<VolunteerInterestFormProps> = ({
  onNavigate,
  onSubmitApplication,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [govtIdType, setGovtIdType] = useState<'Aadhaar' | 'Voter ID' | 'Driving License'>('Aadhaar');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [ward, setWard] = useState('Ward 14 (Coastal Belt / Beach Road)');
  const [address, setAddress] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['First Aid & CPR']);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [availability, setAvailability] = useState<'Immediate (24x7)' | 'Daytime Only' | 'Standby'>(
    'Immediate (24x7)'
  );
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleEquipment = (eq: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim() || !govtIdNumber.trim()) {
      setErrorMsg('Please complete all mandatory fields marked with an asterisk (*).');
      return;
    }

    if (selectedSkills.length === 0) {
      setErrorMsg('Please select at least one rescue skill or support domain.');
      return;
    }

    setErrorMsg('');
    const newId = `APP-${Math.floor(700 + Math.random() * 200)}`;
    const newApp: VolunteerApplication = {
      id: newId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      govtIdType,
      govtIdNumber: govtIdNumber.trim(),
      ward,
      address: address.trim(),
      skills: selectedSkills,
      equipmentAvailable: selectedEquipment,
      availability,
      bloodGroup,
      status: 'PENDING',
      appliedAt: 'Just now',
    };

    onSubmitApplication(newApp);
    setSubmittedAppId(newId);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
              Registration Received · Status: PENDING REVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Thank You for Answering the Call, Citizen Rescuer
            </h1>
            <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
              Your application has been logged with Application ID{' '}
              <strong className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {submittedAppId}
              </strong>
              . NDRF 10th Battalion War Room officers will verify your government credentials and coordinate mobilization during critical rescue sweeps.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs space-y-2.5 max-w-lg mx-auto">
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-semibold text-slate-900">{fullName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Registered Mobile:</span>
              <span className="font-semibold text-slate-900 font-mono">{phone}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Assigned Ward:</span>
              <span className="font-semibold text-slate-900">{ward}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-500">Declared Skills:</span>
              <span className="font-semibold text-slate-900">{selectedSkills.join(', ')}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Availability:</span>
              <span className="font-semibold text-emerald-700 font-mono">{availability}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('citizen_home_disaster')}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Return to Disaster Hub
            </button>
            <button
              onClick={() => onNavigate('volunteer_proximity')}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              View Active Responders Radar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('citizen_home_disaster')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Disaster Emergency Hub</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
            CYCLONE RELIEF MOBILIZATION
          </span>
          <span className="text-slate-500">NDRF Civil Defense Portal</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-blue-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-800/80 border border-blue-600 text-blue-100 text-xs px-3 py-1 rounded-full font-medium">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Community Disaster Responder Enrolment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Register as a JanRakshak Emergency Volunteer
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            During Category 3 cyclone landfall, first responders save lives in the first 60 minutes.
            If you have medical training, off-road 4x4 vehicles, boats, or rescue skills, register
            below to be mobilized alongside NDRF 10th Battalion squads.
          </p>
        </div>
      </div>

      {/* Main Enrolment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
      >
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Personal & Identification Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>1. Identity & Contact Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name as per Govt ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chukka Satya Teja"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active WhatsApp / Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98480 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Government ID Type *
              </label>
              <select
                value={govtIdType}
                onChange={(e) => setGovtIdType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Aadhaar">Aadhaar Card (UIDAI)</option>
                <option value="Voter ID">Voter ID (Election Commission)</option>
                <option value="Driving License">Driving License (RTO)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ID Document Number *
              </label>
              <input
                type="text"
                required
                placeholder="XXXX-XXXX-4912 or AP31-XXXX"
                value={govtIdNumber}
                onChange={(e) => setGovtIdNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 2: Location & Availability */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>2. Location & Availability</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary GVMC Ward *
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Ward 14 (Coastal Belt / Beach Road)">Ward 14 (Coastal Belt / Beach Road)</option>
                <option value="Ward 12 (Peda Waltair / Lawson’s Bay)">Ward 12 (Peda Waltair / Lawson’s Bay)</option>
                <option value="Ward 18 (AU South Campus / Siripuram)">Ward 18 (AU South Campus / Siripuram)</option>
                <option value="Ward 9 (Madhurawada IT SEZ)">Ward 9 (Madhurawada IT SEZ)</option>
                <option value="Ward 25 (Gajuwaka Industrial)">Ward 25 (Gajuwaka Industrial)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Availability *
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Immediate (24x7)">Immediate (24x7 Emergency Callout)</option>
                <option value="Daytime Only">Daytime Operations Only (06:00 - 18:00)</option>
                <option value="Standby">Standby (Only on Severity Escalation)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group (Optional)
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-mono"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Residential / Work Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Flat 302, Sagar View Apts, Beach Road, Visakhapatnam"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 3: Specialized Rescue Capabilities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>3. Skills & Capabilities (Select All That Apply) *</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {selectedSkills.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AVAILABLE_SKILLS.map((skill) => {
              const checked = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    checked
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{skill}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      checked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 4: Available Equipment */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>4. Emergency Equipment / Vehicles You Can Deploy</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {selectedEquipment.length} ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AVAILABLE_EQUIPMENT.map((eq) => {
              const checked = selectedEquipment.includes(eq);
              return (
                <button
                  type="button"
                  key={eq}
                  onClick={() => toggleEquipment(eq)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    checked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{eq}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification & Consent Note */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Govt of Andhra Pradesh Disaster Management Protocol</span>
          </div>
          <p className="leading-relaxed">
            By submitting this application, you declare that all provided details and qualifications
            are accurate. You consent to your contact details and equipment inventory being made
            available to the National Disaster Response Force (NDRF) 10th Battalion and District
            Collectorate Emergency Cell.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('citizen_home_disaster')}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Submit Volunteer Application</span>
          </button>
        </div>
      </form>
    </div>
  );
};

