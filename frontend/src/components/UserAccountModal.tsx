import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle,
  MessageSquare,
  Lock,
  ArrowRight,
  LogOut,
  Sparkles,
  Building2,
  RefreshCw,
} from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSaveUser: (user: UserProfile) => void;
  onLogout: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  onLogout,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [ward, setWard] = useState('Ward 14 (Madhurawada & Coastal)');

  // OTP Verification state
  const [step, setStep] = useState<'DETAILS' | 'OTP_VERIFICATION' | 'SUCCESS'>('DETAILS');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [incomingSms, setIncomingSms] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setStep('SUCCESS');
      } else {
        setStep('DETAILS');
        setFullName('');
        setMobileNumber('');
        setAadhaarNumber('');
        setEnteredOtp('');
        setIncomingSms(null);
        setErrorMessage('');
      }
    }
  }, [isOpen, currentUser]);

  // Countdown for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'OTP_VERIFICATION' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  // Format Aadhaar with spaces (XXXX XXXX XXXX)
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarNumber(formatted);
  };

  // Format phone number
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(raw);
  };

  // Trigger Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (fullName.trim().length < 3) {
      setErrorMessage('Please enter your full legal name (minimum 3 characters).');
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number for identity verification.');
      return;
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setEnteredOtp('');
    setStep('OTP_VERIFICATION');
    setResendTimer(30);

    // Simulate instant incoming SMS notification
    const smsMessage = `DM-JANRAKSHAK: Your OTP for JanRakshak Citizen Account registration is ${otp}. Valid for 10 minutes. Do not share this OTP with anyone. - Govt of AP`;
    setIncomingSms(smsMessage);
  };

  // Resend OTP
  const handleResendOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setEnteredOtp('');
    setResendTimer(30);
    const smsMessage = `DM-JANRAKSHAK: New OTP for citizen account verification is ${otp}. Valid for 10 minutes.`;
    setIncomingSms(smsMessage);
  };

  // Verify OTP and Save User
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (enteredOtp.trim() !== generatedOtp) {
      setErrorMessage('Incorrect OTP entered. Please check the simulated SMS alert or enter the exact 6 digits.');
      return;
    }

    const newUser: UserProfile = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      fullName: fullName.trim(),
      mobileNumber: `+91 ${mobileNumber}`,
      aadhaarNumber: aadhaarNumber,
      ward: ward,
      isVerified: true,
      registeredAt: 'Just now',
    };

    onSaveUser(newUser);
    setStep('SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {currentUser || step === 'SUCCESS' ? 'Citizen Account Profile' : 'Open JanRakshak Citizen Account'}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentUser || step === 'SUCCESS'
                  ? 'Aadhaar Verified · Visakhapatnam GVMC'
                  : 'New User Registration with Aadhaar & Mobile OTP'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realistic Simulated Incoming SMS Notification Toast */}
        {incomingSms && step === 'OTP_VERIFICATION' && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 px-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-200">
            <div className="p-1.5 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 font-mono">📱 Incoming SMS • DM-JANRAKSHAK</span>
                <span className="text-[10px] text-amber-700">Just now</span>
              </div>
              <p className="text-amber-900 mt-0.5 font-mono text-[11px] leading-relaxed">
                {incomingSms}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp)}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                >
                  ⚡ Auto-Fill OTP ({generatedOtp})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: Details Entry */}
          {step === 'DETAILS' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
                <span className="font-bold">Government of Andhra Pradesh Citizen Portal:</span> Enter your Aadhaar and mobile number to receive a secure one-time verification SMS. Verified citizens can file priority civic reports and access emergency flood rescue.
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (as per Aadhaar Card) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chukka Satya Teja"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (for SMS OTP) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold font-mono text-slate-500">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="98480 12345"
                    value={mobileNumber}
                    onChange={handlePhoneChange}
                    className="w-full pl-12 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">An instant 6-digit verification code will be sent via SMS.</p>
              </div>

              {/* Aadhaar Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aadhaar Number (12 Digits) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="4921 8842 1092"
                    value={aadhaarNumber}
                    onChange={handleAadhaarChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold tracking-wider focus:outline-blue-600 focus:bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Encrypted for UIDAI authentication; masked on public tickets.</p>
              </div>

              {/* Administrative Ward */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Residing Ward (GVMC Visakhapatnam)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-blue-600 focus:bg-white cursor-pointer"
                  >
                    <option value="Ward 14 (Madhurawada & Coastal)">Ward 14 (Madhurawada & Coastal Belt)</option>
                    <option value="Ward 12 (Peda Waltair & Lawson’s Bay)">Ward 12 (Peda Waltair & Lawson’s Bay)</option>
                    <option value="Ward 18 (AU South Campus & Siripuram)">Ward 18 (AU South Campus & Siripuram)</option>
                    <option value="Ward 10 (MVP Colony & Sector 4)">Ward 10 (MVP Colony & Sector 4)</option>
                    <option value="Ward 08 (Rushikonda IT SEZ)">Ward 08 (Rushikonda IT SEZ)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Send OTP via SMS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'OTP_VERIFICATION' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Enter Verification Code</h3>
                <p className="text-xs text-slate-500">
                  We sent a 6-digit SMS OTP to <span className="font-mono font-bold text-slate-800">+91 {mobileNumber}</span>
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 6 Digit OTP Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  6-Digit SMS OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full py-3 text-center text-xl font-mono font-black tracking-[0.5em] bg-slate-50 border-2 border-blue-500 rounded-xl focus:outline-none focus:bg-white focus:border-blue-700"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn&apos;t receive SMS?</span>
                {resendTimer > 0 ? (
                  <span className="font-mono text-slate-400">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-blue-600 hover:text-blue-800 font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend OTP
                  </button>
                )}
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Create Account</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 / EXISTING USER: Account Profile Card */}
          {(step === 'SUCCESS' || currentUser) && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase font-mono">
                    Citizen Account Verified
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your Aadhaar identity and mobile OTP are verified for Greater Visakhapatnam Municipal Corporation.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Citizen Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{currentUser?.fullName || fullName}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Registered Mobile:</span>
                  <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    {currentUser?.mobileNumber || `+91 ${mobileNumber}`}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Aadhaar Status:</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {currentUser?.aadhaarNumber
                      ? `XXXX-XXXX-${currentUser.aadhaarNumber.replace(/\D/g, '').slice(-4)}`
                      : `XXXX-XXXX-${aadhaarNumber.replace(/\D/g, '').slice(-4)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Assigned Ward:</span>
                  <span className="font-semibold text-slate-900">{currentUser?.ward || ward}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Citizen ID:</span>
                  <span className="font-mono text-slate-600">{currentUser?.id || 'USR-GVMC-9921'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setStep('DETAILS');
                    setFullName('');
                    setMobileNumber('');
                    setAadhaarNumber('');
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch / Sign Out</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
