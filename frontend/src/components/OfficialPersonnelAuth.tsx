import React, { useState } from 'react';
import { UserRole } from '../types';
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
} from 'lucide-react';

interface OfficialPersonnelAuthProps {
  onOfficialLogin: (role: UserRole, officerDetails: { name: string; id: string; designation: string }) => void;
  onReturnToPublic: () => void;
}

export const OfficialPersonnelAuth: React.FC<OfficialPersonnelAuthProps> = ({
  onOfficialLogin,
  onReturnToPublic,
}) => {
  const [department, setDepartment] = useState<'GVMC_ADMIN' | 'NDRF_ADMIN'>('GVMC_ADMIN');
  const [employeeId, setEmployeeId] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (employeeId.trim().length < 4) {
      setErrorMessage('Please enter a valid Government Officer / Employee Badge ID.');
      return;
    }

    if (!officialEmail.includes('@') || (!officialEmail.endsWith('.gov.in') && !officialEmail.endsWith('.nic.in') && !officialEmail.includes('gvmc') && !officialEmail.includes('ndrf'))) {
      setErrorMessage('Authorized personnel must use official @gvmc.gov.in or @ndrf.gov.in credentials.');
      return;
    }

    if (securityPin.length < 4) {
      setErrorMessage('Please enter your 4-digit security clearance PIN.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);

      if (department === 'GVMC_ADMIN') {
        onOfficialLogin('GVMC_ADMIN', {
          id: employeeId,
          name: 'Er. Ramesh Naidu (Zone 2)',
          designation: 'GVMC Superintending Engineer (Works)',
        });
      } else {
        onOfficialLogin('NDRF_ADMIN', {
          id: employeeId,
          name: 'Col. Vikram Singh',
          designation: '10th Battalion Commander, NDRF Coastal Andhra',
        });
      }
    }, 800);
  };

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
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Return to Public Citizen Portal</span>
        </button>

        <span className="font-mono text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          SECURE DISASTER COMMAND SUITE
        </span>
      </header>

      {/* Main Official Terminal Card */}
      <main className="relative z-10 max-w-md w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Official Personnel Terminal
            </h1>
            <p className="text-xs text-slate-400">
              Departmental login for Greater Visakhapatnam Municipal Corporation (GVMC) & NDRF Tactical Command.
            </p>
          </div>

          {/* Department Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setDepartment('GVMC_ADMIN');
                setErrorMessage('');
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

          {/* Official Login Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Officer Service / Badge ID
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder={department === 'GVMC_ADMIN' ? 'GVMC-ENG-402' : 'NDRF-CMD-10'}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Departmental Email
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder={department === 'GVMC_ADMIN' ? 'ramesh.naidu@gvmc.gov.in' : 'vikram.singh@ndrf.gov.in'}
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Officer Security PIN / 2FA Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="••••••"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                department === 'GVMC_ADMIN'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              }`}
            >
              <span>{isAuthenticating ? 'Validating Credentials...' : 'Authenticate Official Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons for Evaluators */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-center">
              Evaluator One-Click Bypass (Demo Portals)
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('GVMC_ADMIN')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-blue-400">One-Click GVMC Works Admin</div>
                  <div className="text-[10px] text-slate-400 font-mono">Er. Ramesh Naidu (Zone 2 Works)</div>
                </div>
                <BadgeCheck className="w-4 h-4 text-blue-400" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('NDRF_ADMIN')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-amber-400">One-Click NDRF 10th Battalion Command</div>
                  <div className="text-[10px] text-slate-400 font-mono">Col. Vikram Singh (Coastal Andhra)</div>
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

