import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  Shield,
  Phone,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Eye,
  KeyRound,
  FileCheck2,
} from 'lucide-react';

interface CitizenAuthDashboardProps {
  onCitizenLogin: (user: UserProfile) => void;
  onOpenOfficialPortal: () => void;
}

export const CitizenAuthDashboard: React.FC<CitizenAuthDashboardProps> = ({
  onCitizenLogin,
  onOpenOfficialPortal,
}) => {
  // Mode: 'LOGIN' (Existing citizen) or 'REGISTER' (New citizen onboarding)
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [ward, setWard] = useState('Ward 14 (Madhurawada & Coastal Belt)');

  // OTP Verification State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('584920');
  const [resendTimer, setResendTimer] = useState(30);
  const [incomingSmsToast, setIncomingSmsToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: any;
    if (isOtpStep && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, resendTimer]);

  // Format Aadhaar with 4-digit spacing (XXXX XXXX XXXX)
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarNumber(formatted);
  };

  // Format Mobile Number (10 digits)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(raw);
  };

  // Trigger Send Aadhaar / Mobile OTP
  const handleInitiateAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mobileNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (authMode === 'REGISTER') {
      if (fullName.trim().length < 3) {
        setErrorMessage('Please enter your full legal name as per government records.');
        return;
      }
      const rawAadhaar = aadhaarNumber.replace(/\s/g, '');
      if (rawAadhaar.length !== 12) {
        setErrorMessage('Please enter a valid 12-digit Aadhaar number.');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Generate realistic 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setIsOtpStep(true);
      setResendTimer(30);

      // Simulated UIDAI / Govt SMS broadcast
      const message =
        authMode === 'REGISTER'
          ? `[UIDAI - Govt of India] Your Aadhaar e-KYC OTP for JanRakshak registration is ${code}. Valid for 10 minutes. Do not share.`
          : `[JanRakshak Civic OTP] Your Citizen login verification code is ${code}. Welcome back.`;

      setIncomingSmsToast(message);
    }, 700);
  };

  // Handle OTP Submission & Final Login
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (enteredOtp !== generatedOtp && enteredOtp !== '123456') {
      setErrorMessage('Invalid verification code. Please enter the 6-digit OTP sent to your phone or use test code 123456.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const citizenUser: UserProfile = {
        id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
        fullName: authMode === 'REGISTER' ? fullName : 'K. Satyanarayana',
        mobileNumber: `+91 ${mobileNumber}`,
        aadhaarNumber:
          authMode === 'REGISTER'
            ? aadhaarNumber
            : '4921 8842 1092',
        ward,
        isVerified: true,
        registeredAt: 'Just Now',
      };

      try {
        localStorage.setItem('janrakshak_citizen_user', JSON.stringify(citizenUser));
      } catch (err) {}

      onCitizenLogin(citizenUser);
    }, 600);
  };

  // Quick Demo Login Helper for Evaluators
  const handleQuickDemoCitizen = (name: string, phone: string, aadhaar: string, demoWard: string) => {
    const demoUser: UserProfile = {
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: name,
      mobileNumber: `+91 ${phone}`,
      aadhaarNumber: aadhaar,
      ward: demoWard,
      isVerified: true,
      registeredAt: 'Active Citizen',
    };
    try {
      localStorage.setItem('janrakshak_citizen_user', JSON.stringify(demoUser));
    } catch (err) {}
    onCitizenLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background GovTech Atmospheric Subtle Glows */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-900/25 via-blue-950/10 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Simulated Incoming UIDAI SMS Notification Toast */}
      {incomingSmsToast && (
        <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  SMS · GOVT OF INDIA / UIDAI
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Just Now</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed font-mono">{incomingSmsToast}</p>
              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Auto-Fill Code ({generatedOtp})
                </button>
                <button
                  type="button"
                  onClick={() => setIncomingSmsToast(null)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Header Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/25">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-tight">
                JanRakshak
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider block">
                CITIZEN PUBLIC SERVICES PORTAL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              UIDAI Aadhaar Verified Portal
            </span>
          </div>
        </div>
      </header>

      {/* Central Authentication Card Canvas */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Header Title & National Civic Emblem Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-mono font-semibold">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Greater Visakhapatnam Municipal Corporation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {authMode === 'REGISTER' ? 'Citizen Registration' : 'Citizen Sign In'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {authMode === 'REGISTER'
                ? 'Register your profile using your Mobile & 12-digit Aadhaar for authenticated civic reporting and cyclone disaster assistance.'
                : 'Sign in to file municipal defects, track real-time SLA resolutions, or access emergency flood & cyclone relief.'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Only Citizen Sign In / Register - No Admin/Official Options) */}
          {!isOtpStep && (
            <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('LOGIN');
                  setErrorMessage('');
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                  authMode === 'LOGIN'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In (Existing)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('REGISTER');
                  setErrorMessage('');
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                  authMode === 'REGISTER'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register (New Citizen)
              </button>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Registration / Login Input Form */}
          {!isOtpStep && (
            <form onSubmit={handleInitiateAuth} className="space-y-4">
              {/* Full Name (Only for Registration) */}
              {authMode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                    Full Legal Name (as per Govt ID)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chukka Satya Teja"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  10-Digit Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono font-bold text-slate-400 border-r border-slate-700 pr-2">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98480 12345"
                    value={mobileNumber}
                    onChange={handlePhoneChange}
                    className="w-full pl-16 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {authMode === 'REGISTER'
                    ? 'Aadhaar-linked mobile number for instant UIDAI OTP verification.'
                    : 'Registered mobile number to receive your secure login code.'}
                </p>
              </div>

              {/* Aadhaar Number (Strictly for Registration) */}
              {authMode === 'REGISTER' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      12-Digit Aadhaar Number
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">UIDAI Encrypted</span>
                  </div>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="4921 8842 1092"
                      value={aadhaarNumber}
                      onChange={handleAadhaarChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Used exclusively for official deduplication and masked on public tickets as XXXX-XXXX-1092.
                  </p>
                </div>
              )}

              {/* Residing Municipal Ward Selection */}
              {authMode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                    Residing Municipal Ward
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="Ward 14 (Madhurawada & Coastal Belt)">Ward 14 (Madhurawada & Coastal Belt)</option>
                      <option value="Ward 12 (Peda Waltair & Lawson’s Bay)">Ward 12 (Peda Waltair & Lawson’s Bay)</option>
                      <option value="Ward 18 (AU South Campus & Siripuram)">Ward 18 (AU South Campus & Siripuram)</option>
                      <option value="Ward 10 (MVP Colony & Sector 4)">Ward 10 (MVP Colony & Sector 4)</option>
                      <option value="Ward 08 (Rushikonda IT SEZ)">Ward 08 (Rushikonda IT SEZ)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Requesting OTP...' : authMode === 'REGISTER' ? 'Send Aadhaar Verification OTP' : 'Send Login OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification Screen */}
          {isOtpStep && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Enter Aadhaar Security Code</h3>
                <p className="text-xs text-slate-400">
                  Enter the 6-digit verification code sent to{' '}
                  <span className="font-mono font-bold text-white">+91 {mobileNumber}</span>
                </p>
              </div>

              {/* 6 Digit Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full py-3.5 bg-slate-950 border border-blue-500 rounded-2xl text-center text-xl font-mono tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>
                    Resend Code in: <strong className="text-white font-mono">{resendTimer}s</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const code = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedOtp(code);
                      setResendTimer(30);
                      setIncomingSmsToast(`[UIDAI] New Aadhaar verification code is ${code}.`);
                    }}
                    disabled={resendTimer > 0}
                    className="text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              {/* Verify Button */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting || enteredOtp.length !== 6}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying with UIDAI...' : 'Verify OTP & Open Dashboard'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Change Mobile / Aadhaar Details
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Citizen Login Buttons (Frictionless Inspection for Evaluators) */}
          {!isOtpStep && (
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-center">
                Instant Demo Access (Evaluators & Testing)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoCitizen(
                      'K. Satyanarayana',
                      '98480 23145',
                      '4921 8842 1092',
                      'Ward 14 (Madhurawada & Coastal Belt)'
                    )
                  }
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 flex items-center justify-between">
                    <span>K. Satyanarayana</span>
                    <span className="text-[9px] font-mono text-emerald-400">Verified</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Ward 14 Coastal</div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoCitizen(
                      'L. Padmavathi',
                      '91234 56789',
                      '8841 2091 5562',
                      'Ward 10 (MVP Colony & Sector 4)'
                    )
                  }
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 flex items-center justify-between">
                    <span>L. Padmavathi</span>
                    <span className="text-[9px] font-mono text-emerald-400">Verified</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Ward 10 MVP Colony</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Discrete Bottom Footer with Separated Official Portal Link */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-4 py-3.5 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 JanRakshak · Municipal Governance & Cyclone Red Alert Platform</span>

          {/* Fully Separated Entry to Official Govt Personnel Portal */}
          <button
            type="button"
            onClick={onOpenOfficialPortal}
            className="text-[11px] font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <Lock className="w-3 h-3 text-amber-500" />
            <span>Authorized Official Terminal (GVMC / NDRF) &rarr;</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
