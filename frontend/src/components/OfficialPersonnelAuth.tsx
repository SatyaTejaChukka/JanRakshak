import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { JanRakshakAPI } from '../services/api';
import {
  ShieldAlert,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  HardHat,
  User,
  Mail,
  UserPlus,
  LogIn,
} from 'lucide-react';

export interface OfficialAccount {
  id: string; // Badge ID, e.g. 'GVMC-ENG-402'
  name: string; // e.g. 'Dr. Satya Teja Chukka'
  department: 'GVMC_ADMIN' | 'NDRF_ADMIN';
  email: string;
  designation: string;
  pin: string;
  registeredAt?: string;
}

const DEFAULT_OFFICIALS: Record<string, OfficialAccount> = {
  'GVMC-ENG-402': {
    id: 'GVMC-ENG-402',
    name: 'Er. Ramesh Naidu',
    department: 'GVMC_ADMIN',
    email: 'ramesh.naidu@gvmc.gov.in',
    designation: 'GVMC Superintending Engineer (Works)',
    pin: '1234',
    registeredAt: 'Pre-authorized Officer',
  },
  'NDRF-CMD-10': {
    id: 'NDRF-CMD-10',
    name: 'Col. Vikram Singh',
    department: 'NDRF_ADMIN',
    email: 'vikram.singh@ndrf.gov.in',
    designation: '10th Battalion Commander, NDRF Coastal Andhra',
    pin: '1234',
    registeredAt: 'Pre-authorized Officer',
  },
};

function getOfficialRegistry(): Record<string, OfficialAccount> {
  try {
    const raw = localStorage.getItem('janrakshak_official_registry');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_OFFICIALS, ...parsed };
    }
  } catch (err) {
    console.warn('[JanRakshak Official Auth] Local registry read error:', err);
  }
  return { ...DEFAULT_OFFICIALS };
}

function saveOfficialToRegistry(officer: OfficialAccount): void {
  try {
    const registry = getOfficialRegistry();
    // Index by both badge ID and lowercase email for fast lookups
    registry[officer.id.toUpperCase()] = officer;
    if (officer.email) {
      registry[officer.email.toLowerCase()] = officer;
    }
    localStorage.setItem('janrakshak_official_registry', JSON.stringify(registry));
  } catch (err) {
    console.warn('[JanRakshak Official Auth] Local registry write error:', err);
  }
}

interface OfficialPersonnelAuthProps {
  onOfficialLogin: (role: UserRole, officerDetails: { name: string; id: string; designation: string }) => void;
  onReturnToPublic: () => void;
}

export const OfficialPersonnelAuth: React.FC<OfficialPersonnelAuthProps> = ({
  onOfficialLogin,
  onReturnToPublic,
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [department, setDepartment] = useState<'GVMC_ADMIN' | 'NDRF_ADMIN'>('GVMC_ADMIN');

  // Form Fields
  const [officerName, setOfficerName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Status & Recognition
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [recognizedOfficial, setRecognizedOfficial] = useState<OfficialAccount | null>(null);

  // Dynamic recognition on Login screen
  useEffect(() => {
    if (authMode !== 'LOGIN') {
      setRecognizedOfficial(null);
      return;
    }

    const cleanInput = employeeId.trim();
    if (cleanInput.length >= 3) {
      const registry = getOfficialRegistry();
      const match = registry[cleanInput.toUpperCase()] || registry[cleanInput.toLowerCase()];
      if (match) {
        setRecognizedOfficial(match);
        if (match.department) {
          setDepartment(match.department);
        }
      } else {
        setRecognizedOfficial(null);
        // Async query backend registry
        JanRakshakAPI.lookupOfficial(cleanInput).then((res) => {
          if (res?.registered && res.officer) {
            const officerAcc: OfficialAccount = {
              id: res.officer.id,
              name: res.officer.name,
              department: res.officer.department as any,
              email: res.officer.email,
              designation: res.officer.designation,
              pin: '1234',
            };
            setRecognizedOfficial(officerAcc);
            saveOfficialToRegistry(officerAcc);
            if (officerAcc.department) {
              setDepartment(officerAcc.department);
            }
          }
        }).catch(() => {});
      }
    } else {
      setRecognizedOfficial(null);
    }
  }, [employeeId, authMode]);

  // Handle Switch Mode
  const handleSwitchMode = (mode: 'LOGIN' | 'REGISTER') => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
    if (mode === 'REGISTER' && !designation) {
      setDesignation(
        department === 'GVMC_ADMIN'
          ? 'GVMC Executive Engineer (Works)'
          : '10th Battalion Tactical Commander'
      );
    }
  };

  // Submit Handler for Sign In / Registration
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authMode === 'REGISTER') {
      // 1. Validate Admin Creation Fields
      if (officerName.trim().length < 2) {
        setErrorMessage('Please enter the officer’s full legal or official name.');
        return;
      }

      if (employeeId.trim().length < 3) {
        setErrorMessage('Please enter a valid Officer Service / Badge ID (at least 3 characters).');
        return;
      }

      if (!officialEmail.includes('@')) {
        setErrorMessage('Please enter a valid official government or organizational email.');
        return;
      }

      if (securityPin.length < 4) {
        setErrorMessage('Security clearance PIN must be at least 4 digits.');
        return;
      }

      if (securityPin !== confirmPin) {
        setErrorMessage('Security clearance PIN confirmation does not match.');
        return;
      }

      setIsAuthenticating(true);

      const cleanBadgeId = employeeId.trim().toUpperCase();
      const cleanName = officerName.trim();
      const cleanDesignation = designation.trim() || (
        department === 'GVMC_ADMIN' ? 'GVMC Zonal Engineer' : 'NDRF Unit Commander'
      );
      const cleanEmail = officialEmail.trim().toLowerCase();

      try {
        // Register in backend
        await JanRakshakAPI.registerOfficial({
          name: cleanName,
          department,
          badge_id: cleanBadgeId,
          email: cleanEmail,
          designation: cleanDesignation,
          pin: securityPin,
        });

        // Save in client persistent registry
        const newAccount: OfficialAccount = {
          id: cleanBadgeId,
          name: cleanName,
          department,
          email: cleanEmail,
          designation: cleanDesignation,
          pin: securityPin,
          registeredAt: new Date().toLocaleTimeString(),
        };
        saveOfficialToRegistry(newAccount);

        setSuccessMessage(`Official clearance granted for ${cleanName}. Initializing console...`);

        setTimeout(() => {
          setIsAuthenticating(false);
          // Pass the EXACT name entered by the user
          onOfficialLogin(department, {
            id: cleanBadgeId,
            name: cleanName,
            designation: cleanDesignation,
          });
        }, 600);
      } catch (err: any) {
        setIsAuthenticating(false);
        setErrorMessage(err?.message || 'Failed to register official account. Please try again.');
      }
    } else {
      // LOGIN MODE
      if (employeeId.trim().length < 3) {
        setErrorMessage('Please enter your registered Badge ID or Departmental Email.');
        return;
      }

      if (securityPin.length < 4) {
        setErrorMessage('Please enter your 4-digit security clearance PIN.');
        return;
      }

      setIsAuthenticating(true);

      try {
        const cleanInput = employeeId.trim();
        const registry = getOfficialRegistry();
        const matched = recognizedOfficial || registry[cleanInput.toUpperCase()] || registry[cleanInput.toLowerCase()];

        // If matched in local or backend registry
        if (matched) {
          if (matched.pin && matched.pin !== securityPin && securityPin !== '1234' && securityPin !== '123456') {
            setIsAuthenticating(false);
            setErrorMessage('Invalid security PIN. Please enter your correct PIN or test code 1234.');
            return;
          }

          setSuccessMessage(`Clearance confirmed. Welcome, ${matched.name}.`);

          setTimeout(() => {
            setIsAuthenticating(false);
            onOfficialLogin(matched.department || department, {
              id: matched.id,
              name: matched.name,
              designation: matched.designation || 'Official Administrator',
            });
          }, 600);
          return;
        }

        // If not matched, query backend login
        const res = await JanRakshakAPI.loginOfficial({
          department,
          identifier: cleanInput,
          pin: securityPin,
        });

        if (res?.success && res.officer) {
          const resolvedName = res.officer.name;
          const resolvedId = res.officer.id;
          const resolvedDesignation = res.officer.designation;

          // Cache in local registry
          saveOfficialToRegistry({
            id: resolvedId,
            name: resolvedName,
            department,
            email: res.officer.email || cleanInput,
            designation: resolvedDesignation,
            pin: securityPin,
          });

          setSuccessMessage(`Clearance confirmed for ${resolvedName}.`);

          setTimeout(() => {
            setIsAuthenticating(false);
            onOfficialLogin(department, {
              id: resolvedId,
              name: resolvedName,
              designation: resolvedDesignation,
            });
          }, 600);
        } else {
          setIsAuthenticating(false);
          setErrorMessage('Officer credentials not recognized. Please create an admin account or use test code 1234.');
        }
      } catch (err: any) {
        setIsAuthenticating(false);
        setErrorMessage(err?.message || 'Authentication error. Please check your credentials.');
      }
    }
  };

  // Evaluator Demo Quick Access
  const handleDemoLogin = (role: 'GVMC_ADMIN' | 'NDRF_ADMIN') => {
    if (role === 'GVMC_ADMIN') {
      onOfficialLogin('GVMC_ADMIN', {
        id: 'GVMC-ENG-402',
        name: 'Er. Ramesh Naidu',
        designation: 'GVMC Superintending Engineer (Works)',
      });
    } else {
      onOfficialLogin('NDRF_ADMIN', {
        id: 'NDRF-CMD-10',
        name: 'Col. Vikram Singh',
        designation: '10th Battalion Commander, NDRF Coastal Andhra',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-amber-500/10 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Top Warning Banner */}
      <div className="bg-amber-950/80 border-b border-amber-600/30 px-4 py-2 text-center text-[11px] font-mono text-amber-300 flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5 text-amber-400" />
        <span>RESTRICTED ACCESS: Official government and emergency services terminal only. Unauthorized entry is strictly prohibited under IT Act.</span>
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onReturnToPublic}
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-800 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Return to Public Citizen Portal</span>
        </button>

        <span className="font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          SECURE DISASTER COMMAND SUITE
        </span>
      </header>

      {/* Main Official Terminal Card */}
      <main className="relative z-10 max-w-md w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="text-center space-y-2">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-inner transition-colors ${
                department === 'GVMC_ADMIN'
                  ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              }`}
            >
              {department === 'GVMC_ADMIN' ? (
                <Building2 className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              {authMode === 'REGISTER' ? 'Create Official Account' : 'Official Personnel Terminal'}
            </h1>
            <p className="text-xs text-slate-400">
              {authMode === 'REGISTER'
                ? 'Enroll authorized administrative credentials for GVMC Municipal Works or NDRF War Room.'
                : 'Departmental login for Greater Visakhapatnam Municipal Corporation & NDRF Tactical Command.'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign In vs Register Admin) */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleSwitchMode('LOGIN')}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'LOGIN'
                  ? 'bg-slate-800 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Officer Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('REGISTER')}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'REGISTER'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Admin Account</span>
            </button>
          </div>

          {/* Department Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setDepartment('GVMC_ADMIN');
                setErrorMessage('');
                if (authMode === 'REGISTER') {
                  setDesignation('GVMC Executive Engineer (Works)');
                }
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                department === 'GVMC_ADMIN'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>GVMC Works</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDepartment('NDRF_ADMIN');
                setErrorMessage('');
                if (authMode === 'REGISTER') {
                  setDesignation('10th Battalion Tactical Commander');
                }
              }}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                department === 'NDRF_ADMIN'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>NDRF 10th Bn</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Recognized Officer Badge on Login */}
          {authMode === 'LOGIN' && recognizedOfficial && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{recognizedOfficial.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {recognizedOfficial.designation} ({recognizedOfficial.id})
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                Registered
              </span>
            </div>
          )}

          {/* Official Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {/* REGISTER MODE: Officer Full Name */}
            {authMode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Officer Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Satya Teja Chukka"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Officer Badge / Service ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                {authMode === 'REGISTER' ? 'Officer Service / Badge ID' : 'Badge ID or Official Email'} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder={
                    authMode === 'REGISTER'
                      ? department === 'GVMC_ADMIN' ? 'GVMC-ADM-101' : 'NDRF-CMD-08'
                      : department === 'GVMC_ADMIN' ? 'GVMC-ENG-402 or ramesh.naidu@gvmc.gov.in' : 'NDRF-CMD-10 or vikram.singh@ndrf.gov.in'
                  }
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* REGISTER MODE: Departmental Email */}
            {authMode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Departmental Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder={department === 'GVMC_ADMIN' ? 'satya.teja@gvmc.gov.in' : 'satya.teja@ndrf.gov.in'}
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* REGISTER MODE: Official Designation */}
            {authMode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Official Designation / Rank
                </label>
                <div className="relative">
                  <HardHat className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder={
                      department === 'GVMC_ADMIN'
                        ? 'Superintending Engineer (Works)'
                        : '10th Battalion Commander'
                    }
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Security Clearance PIN */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {authMode === 'REGISTER' ? 'Set Clearance PIN / Password' : 'Clearance PIN / Password'} <span className="text-red-400">*</span>
                </label>
                {authMode === 'LOGIN' && (
                  <span className="text-[10px] text-slate-400 font-mono">Test PIN: 1234</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  maxLength={12}
                  placeholder="••••••"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* REGISTER MODE: Confirm PIN */}
            {authMode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Confirm Clearance PIN <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    maxLength={12}
                    placeholder="••••••"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                department === 'GVMC_ADMIN'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              }`}
            >
              <span>
                {isAuthenticating
                  ? 'Validating Clearance...'
                  : authMode === 'REGISTER'
                  ? 'Create Admin Account & Enter Console'
                  : 'Authenticate Official Terminal'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons for Evaluators */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-center">
              Evaluator One-Click Bypass (Demo Hackathon Personas)
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('GVMC_ADMIN')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-400">Demo Persona: GVMC Works Admin</div>
                  <div className="text-[10px] text-slate-400 font-mono">Er. Ramesh Naidu (Zone 2 Works · GVMC-ENG-402)</div>
                </div>
                <BadgeCheck className="w-4 h-4 text-blue-400" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('NDRF_ADMIN')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-amber-400">Demo Persona: NDRF 10th Battalion Commander</div>
                  <div className="text-[10px] text-slate-400 font-mono">Col. Vikram Singh (Coastal Andhra · NDRF-CMD-10)</div>
                </div>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 py-3 text-center text-xs text-slate-600 font-mono">
        Official Government Portal · Andhra Pradesh Disaster Management Authority & GVMC
      </footer>
    </div>
  );
};
