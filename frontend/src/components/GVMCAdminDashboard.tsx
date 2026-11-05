import React, { useState } from 'react';
import { ScreenId, Ticket, MunicipalOfficer } from '../types';
import {
  Building2,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Phone,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  X,
  FileCheck,
  Camera,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface GVMCAdminDashboardProps {
  tickets: Ticket[];
  officers: MunicipalOfficer[];
  onNavigate: (screen: ScreenId) => void;
  onAssignOfficer: (ticketId: string, officer: MunicipalOfficer) => void;
  onApproveResolution: (ticketId: string) => void;
  onRejectResolution: (ticketId: string, reason: string) => void;
}

export const GVMCAdminDashboard: React.FC<GVMCAdminDashboardProps> = ({
  tickets,
  officers,
  onNavigate,
  onAssignOfficer,
  onApproveResolution,
  onRejectResolution,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Assign Officer Modal state
  const [assignModalTicket, setAssignModalTicket] = useState<Ticket | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('');
  
  // Photo Proof Inspection Modal state
  const [inspectModalTicket, setInspectModalTicket] = useState<Ticket | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Filtered tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchCategory =
      selectedCategory === 'All' || ticket.category === selectedCategory;
    const matchStage = selectedStage === 'All' || ticket.currentStage === selectedStage;
    const matchSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchStage && matchSearch;
  });

  // Calculate high-level SLA metrics
  const totalTickets = tickets.length;
  const resolvedCount = tickets.filter((t) => t.currentStage === 'resolved').length;
  const inProgressCount = tickets.filter((t) => t.currentStage === 'in_progress').length;
  const unassignedCount = tickets.filter(
    (t) => t.currentStage === 'submitted' || t.currentStage === 'deduplicated'
  ).length;
  const mergedClusterCount = tickets.reduce((acc, t) => acc + (t.mergedCount || 1), 0);

  const handleOpenAssignModal = (ticket: Ticket) => {
    setAssignModalTicket(ticket);
    const defaultOfficer = officers.find(
      (o) =>
        (ticket.category.includes('Pothole') && o.department === 'Road Infrastructure') ||
        (ticket.category.includes('Drainage') && o.department === 'Drainage & Stormwater') ||
        (ticket.category.includes('Tree') && o.department === 'Electrical (APEPDCL)')
    );
    setSelectedOfficerId(defaultOfficer ? defaultOfficer.id : officers[0]?.id || '');
  };

  const handleConfirmAssignment = () => {
    if (!assignModalTicket || !selectedOfficerId) return;
    const officer = officers.find((o) => o.id === selectedOfficerId);
    if (officer) {
      onAssignOfficer(assignModalTicket.id, officer);
    }
    setAssignModalTicket(null);
  };

  const handleApproveInspection = () => {
    if (!inspectModalTicket) return;
    onApproveResolution(inspectModalTicket.id);
    setInspectModalTicket(null);
  };

  const handleRejectInspection = () => {
    if (!inspectModalTicket) return;
    onRejectResolution(inspectModalTicket.id, rejectReason || 'Incomplete asphalt levelling or surface compaction.');
    setRejectReason('');
    setShowRejectForm(false);
    setInspectModalTicket(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">
              GVMC Municipal Console
            </span>
            <span>Zone 2 Engineering & Works Department</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Municipal Works & SLA Command Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Real-time tracking of civic defect dispatches, PostGIS 50m spatial deduplication, and contractor photo audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('spatial_dedup_notice')}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>50m Dedupe Engine</span>
          </button>
          <button
            onClick={() => onNavigate('field_worker_checkin')}
            className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Crew Field Check-In</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Total Civic Reports</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{totalTickets}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">{resolvedCount} resolved</span>
            <span>· {unassignedCount} pending assign</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Deduplicated Merges</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
            {mergedClusterCount} reports
          </div>
          <div className="text-[11px] text-slate-500">
            Clustered into <span className="font-semibold text-slate-800">{totalTickets} actionable work orders</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">In-Progress Crews</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">{inProgressCount}</div>
          <div className="text-[11px] text-slate-500">
            Field workers currently on-site with active GPS lock
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider font-mono">Assigned Officers</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
            {officers.filter((o) => o.status !== 'Off Duty').length} / {officers.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Active ward engineers & sanitation inspectors
          </div>
        </div>
      </div>

      {/* Ward Officers Workload Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-600 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Ward Engineers & Section Officers Workload</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            GVMC Zone 2 Engineering Roster
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {officers.map((officer) => (
            <div
              key={officer.id}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 truncate">{officer.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    officer.status === 'On Site'
                      ? 'bg-amber-100 text-amber-800'
                      : officer.status === 'On Duty'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {officer.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 truncate">{officer.designation}</div>
              <div className="text-[11px] text-slate-500 font-mono">{officer.department}</div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 text-slate-500">
                <span>Active Workload:</span>
                <span className="font-bold text-slate-900 font-mono">{officer.activeWorkloadCount} jobs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ticket ID, road, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Pothole & Craters">Pothole & Craters</option>
            <option value="Drainage Block">Drainage Block</option>
            <option value="Fallen Tree & Power Line">Fallen Tree & Power Line</option>
            <option value="Streetlight Outage">Streetlight Outage</option>
            <option value="Structural Crack">Structural Crack</option>
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Stages</option>
            <option value="submitted">Submitted</option>
            <option value="deduplicated">Deduplicated (Pending Assign)</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Tickets Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">
            Civic Work Orders ({filteredTickets.length})
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            SLA Standard: 48h Road · 24h Drainage · 6h Electrical
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Work Order ID</th>
                <th className="px-4 py-3">Category & Severity</th>
                <th className="px-4 py-3">Location & Ward</th>
                <th className="px-4 py-3">Cluster / Dedup</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Assigned Crew / Officer</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTickets.map((ticket) => {
                const isAssigned = !!ticket.assignedCrew;
                const isResolved = ticket.currentStage === 'resolved';
                const hasPhotoProof = !!ticket.afterImageUrl || !!ticket.beforeImageUrl;

                return (
                  <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Ticket ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div>{ticket.id}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {ticket.reportedAt}
                      </span>
                    </td>

                    {/* Category & Severity */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{ticket.category}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            ticket.severity === 'Critical'
                              ? 'bg-red-100 text-red-800'
                              : ticket.severity === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ticket.severity} Priority
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="truncate font-medium text-slate-800">{ticket.location}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>Lat {ticket.coordinates.latitude.toFixed(4)}, Lng {ticket.coordinates.longitude.toFixed(4)}</span>
                      </div>
                    </td>

                    {/* Cluster / Dedup */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {ticket.mergedCount > 1 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Layers className="w-3 h-3" />
                          <span>{ticket.mergedCount} Citizen Reports</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">1 Report</span>
                      )}
                    </td>

                    {/* Stage */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          ticket.currentStage === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ticket.currentStage === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : ticket.currentStage === 'assigned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ticket.currentStage.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Assigned Crew / Officer */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {ticket.assignedCrew ? (
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>{ticket.assignedCrew.workerName}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {ticket.assignedCrew.unitId} · {ticket.assignedCrew.phone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-red-600 font-medium">
                          Unassigned (Action Needed)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Assign Officer button */}
                        {!isResolved && (
                          <button
                            onClick={() => handleOpenAssignModal(ticket)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            {isAssigned ? 'Reassign' : 'Assign Officer'}
                          </button>
                        )}

                        {/* Photo proof inspect button */}
                        {hasPhotoProof && (
                          <button
                            onClick={() => setInspectModalTicket(ticket)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            title="Inspect Before/After Completion Proof"
                          >
                            <Camera className="w-3.5 h-3.5 text-slate-600" />
                            <span>Photo Audit</span>
                          </button>
                        )}

                        {/* Stepper link */}
                        <button
                          onClick={() => onNavigate('public_ticket_stepper')}
                          className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                          title="View Public Tracker"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN OFFICER MODAL */}
      {assignModalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Assign Work Order to Municipal Officer</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{assignModalTicket.id} · {assignModalTicket.category}</p>
                </div>
              </div>
              <button
                onClick={() => setAssignModalTicket(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-800">{assignModalTicket.title}</div>
              <div className="text-slate-500 text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{assignModalTicket.location}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Select Municipal Engineer / Section Officer
              </label>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {officers.map((officer) => {
                  const isSelected = selectedOfficerId === officer.id;
                  return (
                    <button
                      type="button"
                      key={officer.id}
                      onClick={() => setSelectedOfficerId(officer.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/80 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{officer.name}</span>
                          <span className="text-[10px] font-normal text-slate-500">
                            ({officer.designation})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {officer.department} · {officer.ward}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                            officer.status === 'On Site'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {officer.status}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          {officer.activeWorkloadCount} Active Tasks
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setAssignModalTicket(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Confirm Assignment & Dispatch SLA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BEFORE / AFTER PHOTO AUDIT MODAL */}
      {inspectModalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Before / After Photo Proof Quality Audit
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {inspectModalTicket.id} · {inspectModalTicket.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setInspectModalTicket(null);
                  setShowRejectForm(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-side images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700">1. Citizen Reported Defect</span>
                  <span className="text-slate-400 text-[10px]">BEFORE</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative">
                  {inspectModalTicket.beforeImageUrl ? (
                    <img
                      src={inspectModalTicket.beforeImageUrl}
                      alt="Before defect"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No citizen photo available
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    GPS Lat {inspectModalTicket.coordinates.latitude.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700">2. Field Crew Resolution</span>
                  <span className="text-emerald-700 font-bold text-[10px]">AFTER</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative">
                  {inspectModalTicket.afterImageUrl ? (
                    <img
                      src={inspectModalTicket.afterImageUrl}
                      alt="After resolution"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                      <Clock className="w-6 h-6 text-slate-300 mb-1" />
                      <span>Field crew has not uploaded after-work photo yet.</span>
                    </div>
                  )}
                  {inspectModalTicket.afterImageUrl && (
                    <div className="absolute bottom-2 left-2 bg-emerald-900/80 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      Timestamp: Verified On-Site
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rejection input when toggled */}
            {showRejectForm ? (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-red-800">
                  Specify Reason for Work Rejection / Reassignment *
                </label>
                <textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Surface not leveled, edge crumbling visible, asphalt requires second hot-mix coat."
                  className="w-full p-2 text-xs border border-red-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel Rejection
                  </button>
                  <button
                    onClick={handleRejectInspection}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Confirm Rejection & Reassign Crew
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                >
                  Reject Proof & Demand Rework
                </button>

                <button
                  onClick={handleApproveInspection}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Resolution & Close Work Order</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

