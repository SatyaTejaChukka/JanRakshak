import React, { useState } from 'react';
import { ScreenId, VolunteerApplication, ActiveVolunteer } from '../types';
import {
  ShieldAlert,
  Users,
  UserCheck,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Radio,
  Truck,
  Phone,
  MapPin,
  Clock,
  Search,
  Filter,
  Send,
  LifeBuoy,
  HeartHandshake,
  Wrench,
  AlertOctagon,
  X,
  FileCheck,
} from 'lucide-react';

interface NDRFVolunteerManagementProps {
  applications: VolunteerApplication[];
  activeVolunteers: ActiveVolunteer[];
  onNavigate: (screen: ScreenId) => void;
  onApproveApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string) => void;
  onAddDirectVolunteer: (volunteer: ActiveVolunteer) => void;
  onUpdateVolunteerStatus: (
    volunteerId: string,
    status: ActiveVolunteer['status'],
    incidentId?: string
  ) => void;
}

export const NDRFVolunteerManagement: React.FC<NDRFVolunteerManagementProps> = ({
  applications,
  activeVolunteers,
  onNavigate,
  onApproveApplication,
  onRejectApplication,
  onAddDirectVolunteer,
  onUpdateVolunteerStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'direct_entry' | 'roster'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWard, setFilterWard] = useState('All');
  
  // Direct entry form state
  const [directName, setDirectName] = useState('');
  const [directPhone, setDirectPhone] = useState('');
  const [directWard, setDirectWard] = useState('Ward 14 (Coastal Belt)');
  const [directRole, setDirectRole] = useState('Fishermen Community Boat Skipper');
  const [directEquipment, setDirectEquipment] = useState('Motorized Boat + 4 Life Jackets');
  const [directSkill, setDirectSkill] = useState('Swimming & Water Rescue');
  const [directStatus, setDirectStatus] = useState<ActiveVolunteer['status']>('Available');
  const [directSuccessMsg, setDirectSuccessMsg] = useState('');

  // Dispatch modal state
  const [dispatchModalVol, setDispatchModalVol] = useState<ActiveVolunteer | null>(null);
  const [targetIncidentId, setTargetIncidentId] = useState('ELD-4091');
  const [targetIncidentDesc, setTargetIncidentDesc] = useState('Bedridden Elder Evacuation (Beach Rd)');

  const pendingApps = applications.filter((app) => app.status === 'PENDING');
  const approvedAppsCount = applications.filter((app) => app.status === 'APPROVED').length;

  const handleDirectEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directName.trim() || !directPhone.trim()) return;

    const newVolunteer: ActiveVolunteer = {
      id: `VOL-${String(activeVolunteers.length + 1).padStart(2, '0')}`,
      name: directName.trim(),
      phone: directPhone.trim(),
      ward: directWard,
      role: directRole,
      equipment: directEquipment,
      skills: [directSkill],
      status: directStatus,
      isVerifiedByNDRF: true,
      onboardedBy: 'NDRF_DIRECT_ENTRY',
      distanceMeters: Math.floor(150 + Math.random() * 400),
    };

    onAddDirectVolunteer(newVolunteer);
    setDirectSuccessMsg(`Successfully enrolled ${directName} into active NDRF volunteer corps.`);
    setDirectName('');
    setDirectPhone('');
    setTimeout(() => {
      setDirectSuccessMsg('');
      setActiveTab('roster');
    }, 1500);
  };

  const handleConfirmDispatch = () => {
    if (!dispatchModalVol) return;
    onUpdateVolunteerStatus(dispatchModalVol.id, 'En Route', targetIncidentId);
    setDispatchModalVol(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold uppercase">
              NDRF 10th Bn Tactical Command
            </span>
            <span>Civilian Volunteer Mobilization Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            NDRF Civilian Volunteer Command Center
          </h1>
          <p className="text-sm text-slate-500">
            Vet incoming citizen applications, manually onboard trusted civil defense units, and dispatch responders to high-water SOS zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('ndrf_dispatcher_dashboard')}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Radio className="w-4 h-4 text-amber-600" />
            <span>War Room Console</span>
          </button>
          <button
            onClick={() => onNavigate('volunteer_proximity')}
            className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Live Radar Map</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Pending Citizen Apps</span>
            <HeartHandshake className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {pendingApps.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Awaiting identity & equipment verification
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Active Volunteer Corps</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
            {activeVolunteers.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {activeVolunteers.filter((v) => v.status === 'Available').length} available immediately
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Currently Deployed</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
            {activeVolunteers.filter((v) => v.status === 'En Route' || v.status === 'On-Scene').length}
          </div>
          <div className="text-[11px] text-slate-500">
            Assigned to coastal evacuation sweeps
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Direct NDRF Onboarded</span>
            <ShieldAlert className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {activeVolunteers.filter((v) => v.onboardedBy === 'NDRF_DIRECT_ENTRY').length}
          </div>
          <div className="text-[11px] text-slate-500">
            Civil defense, fishermen & divers
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pending'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Pending Citizen Applications</span>
          {pendingApps.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-mono font-bold">
              {pendingApps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('direct_entry')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'direct_entry'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Direct NDRF Onboarding (Fast-Track)</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'roster'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Volunteer Roster & Deployment ({activeVolunteers.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING CITIZEN APPLICATIONS */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">
                Citizen Volunteer Intake Queue
              </h2>
              <p className="text-xs text-slate-500">
                Review verified identities, medical certifications, and offered equipment prior to field assignment.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {pendingApps.length} Pending Approval
            </span>
          </div>

          {pendingApps.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Intake Queue Clear</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All citizen volunteer applications have been reviewed and approved or rejected.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{app.fullName}</span>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {app.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{app.phone}</span>
                        <span>·</span>
                        <span className="font-mono font-bold text-red-600">Blood: {app.bloodGroup}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 uppercase">
                      {app.availability}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Govt ID:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {app.govtIdType}: {app.govtIdNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-medium text-slate-800 truncate">{app.ward}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{app.address}</div>
                  </div>

                  {/* Skills badges */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 mb-1.5">
                      Rescue Skills:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {app.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Equipment */}
                  {app.equipmentAvailable.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 mb-1.5">
                        Deployable Equipment:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {app.equipmentAvailable.map((eq) => (
                          <span
                            key={eq}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onRejectApplication(app.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => onApproveApplication(app.id)}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve & Enrol to Corps</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DIRECT NDRF ONBOARDING */}
      {activeTab === 'direct_entry' && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Direct Fast-Track Enrolment</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Direct NDRF Volunteer & Civil Defense Registration
            </h2>
            <p className="text-xs text-slate-500">
              For on-scene registration of trusted local fishermen, ham radio operators, off-duty lifeguards, and heavy vehicle operators.
            </p>
          </div>

          {directSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{directSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleDirectEntrySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Volunteer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M. Srinivas & Crew"
                  value={directName}
                  onChange={(e) => setDirectName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94401 22334"
                  value={directPhone}
                  onChange={(e) => setDirectPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Ward / Staging Area
                </label>
                <select
                  value={directWard}
                  onChange={(e) => setDirectWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Ward 14 (Coastal Belt)">Ward 14 (Coastal Belt / Beach Road)</option>
                  <option value="Ward 12 (Peda Waltair)">Ward 12 (Peda Waltair)</option>
                  <option value="Ward 18 (AU South Campus)">Ward 18 (AU South Campus)</option>
                  <option value="Ward 9 (Madhurawada)">Ward 9 (Madhurawada)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tactical Operational Role
                </label>
                <select
                  value={directRole}
                  onChange={(e) => setDirectRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Fishermen Community Boat Skipper">Fishermen Community Boat Skipper</option>
                  <option value="Certified Rescue Diver">Certified Rescue Diver</option>
                  <option value="Civil Defense Heavy 4x4 Driver">Civil Defense Heavy 4x4 Driver</option>
                  <option value="Disaster First Responder (CPR/Triage)">Disaster First Responder (CPR/Triage)</option>
                  <option value="Ham Radio Communications Link">Ham Radio Communications Link</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Core Technical Skill
                </label>
                <select
                  value={directSkill}
                  onChange={(e) => setDirectSkill(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Swimming & Water Rescue">Swimming & Water Rescue</option>
                  <option value="4x4 Off-Road Driving">4x4 Off-Road Driving</option>
                  <option value="First Aid & Triage">First Aid & Triage</option>
                  <option value="Chainsaw & Tree Clearing">Chainsaw & Tree Clearing</option>
                  <option value="Ham Radio Communication">Ham Radio Communication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Deployment Status
                </label>
                <select
                  value={directStatus}
                  onChange={(e) => setDirectStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                >
                  <option value="Available">Available (Immediate Dispatch)</option>
                  <option value="En Route">En Route (Deploying to Coast)</option>
                  <option value="Standby">Standby</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Equipment & Assets On-Hand
              </label>
              <input
                type="text"
                placeholder="e.g. 1x OBM Motorized Inflatable Boat + 6 Lifebuoys"
                value={directEquipment}
                onChange={(e) => setDirectEquipment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>Enrol Directly to NDRF Active Roster</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ACTIVE VOLUNTEER ROSTER & DEPLOYMENT TRACKER */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search volunteer name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500">Ward:</span>
              <select
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white"
              >
                <option value="All">All Wards</option>
                <option value="Ward 14">Ward 14</option>
                <option value="Ward 12">Ward 12</option>
                <option value="Ward 18">Ward 18</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Volunteer ID & Name</th>
                    <th className="px-4 py-3">Tactical Role & Skills</th>
                    <th className="px-4 py-3">Equipment On-Hand</th>
                    <th className="px-4 py-3">Ward / Proximity</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Verification & Origin</th>
                    <th className="px-4 py-3 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activeVolunteers
                    .filter((v) => {
                      const matchSearch =
                        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        v.role.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchWard = filterWard === 'All' || v.ward.includes(filterWard);
                      return matchSearch && matchWard;
                    })
                    .map((vol) => (
                      <tr key={vol.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="font-mono text-slate-400 text-[11px]">{vol.id}</span>
                            <span>{vol.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {vol.phone}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-800">{vol.role}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {vol.skills.map((s) => (
                              <span
                                key={s}
                                className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                          {vol.equipment}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-medium text-slate-800">{vol.ward}</div>
                          {vol.distanceMeters && (
                            <span className="text-[10px] text-emerald-600 font-mono font-bold">
                              {vol.distanceMeters}m from Coastal Line
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              vol.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : vol.status === 'En Route'
                                ? 'bg-amber-100 text-amber-800'
                                : vol.status === 'On-Scene'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {vol.status}
                          </span>
                          {vol.assignedIncidentId && (
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                              Target: {vol.assignedIncidentId}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[11px]">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-medium text-slate-800">NDRF Verified</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {vol.onboardedBy === 'NDRF_DIRECT_ENTRY' ? 'Fast-Track Entry' : 'Citizen Application'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setDispatchModalVol(vol)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Dispatch / Reassign
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH TO INCIDENT MODAL */}
      {dispatchModalVol && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Deploy Volunteer to Emergency Incident</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{dispatchModalVol.name} · {dispatchModalVol.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDispatchModalVol(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-800">Volunteer Role: {dispatchModalVol.role}</div>
              <div className="text-slate-500 text-[11px]">Equipment: {dispatchModalVol.equipment}</div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Select Active Disaster / SOS Incident
              </label>

              <div className="space-y-2">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-red-200 bg-red-50/50 cursor-pointer">
                  <input
                    type="radio"
                    name="incident"
                    checked={targetIncidentId === 'ELD-4091'}
                    onChange={() => {
                      setTargetIncidentId('ELD-4091');
                      setTargetIncidentDesc('Elder SOS Evacuation (Beach Rd - High Water)');
                    }}
                    className="mt-0.5 text-red-600"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-red-900">ELD-4091: Bedridden Senior Citizen</div>
                    <div className="text-[11px] text-red-700">Ward 14 Beach Rd · Floor 1 Surge Threat · Needs Stretcher</div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer">
                  <input
                    type="radio"
                    name="incident"
                    checked={targetIncidentId === 'TKT-8904'}
                    onChange={() => {
                      setTargetIncidentId('TKT-8904');
                      setTargetIncidentDesc('Fallen Gulmohar Tree & 11kV Wire Blockade');
                    }}
                    className="mt-0.5 text-amber-600"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-amber-900">TKT-8904: Evacuation Route Blocked</div>
                    <div className="text-[11px] text-amber-700">Siripuram Junction · Needs Chainsaw & Debris Clearance</div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-blue-200 bg-blue-50/50 cursor-pointer">
                  <input
                    type="radio"
                    name="incident"
                    checked={targetIncidentId === 'SHELTER-01'}
                    onChange={() => {
                      setTargetIncidentId('SHELTER-01');
                      setTargetIncidentDesc('Andhra University Stadium Relief Shelter');
                    }}
                    className="mt-0.5 text-blue-600"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-blue-900">SHELTER-01: AU Indoor Stadium Hub</div>
                    <div className="text-[11px] text-blue-700">Food Distribution & Elder Medical Care Staging</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDispatchModalVol(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Responder (Set En Route)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
