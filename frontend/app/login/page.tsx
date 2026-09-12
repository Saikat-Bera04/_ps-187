"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { FaceScanner } from '@/components/ui/FaceScanner';
import { login as apiLogin } from '@/lib/api';

type LoginStep = 'CREDENTIALS' | 'FACE_VERIFICATION';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [step, setStep] = useState<LoginStep>('CREDENTIALS');
  const [username, setUsername] = useState('operator12@ibvap.gov');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Please provide valid credentials.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiLogin(username, password);
      setAccessToken(result.accessToken);
      setIsLoading(false);
      setStep('FACE_VERIFICATION');
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Connection to server failed.');
    }
  };

  const handleFaceVerificationComplete = (success: boolean, result?: { status: 'enrolled' | 'verified'; message: string }) => {
    if (success) {
      const isEnrollment = result?.status === 'enrolled';
      showToast({
        title: isEnrollment ? 'Face Enrolled & Authenticated' : 'Authentication Successful',
        message: isEnrollment
          ? 'Your face has been registered for future logins. Welcome!'
          : 'Welcome to IBVAP Command & Control Center.',
        type: 'success',
      });
      router.push('/dashboard');
    } else {
      setError('Face verification failed. Please try again.');
      setStep('CREDENTIALS');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05080C] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none">
      {/* Background ambient lighting and tactical radar grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1A2633_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Dual-Column Command Portal */}
      <div className="w-full max-w-4xl bg-[#0B1017] border border-[#1E2B3A] rounded-none shadow-2xl overflow-hidden relative z-10 flex flex-col lg:flex-row transition-all duration-300">
        
        {/* LEFT COLUMN: Tactical Operations Panel with signin.jpg */}
        <div className="lg:w-1/2 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[580px] bg-[#000] overflow-hidden flex flex-col justify-between p-6 sm:p-8">
          {/* Background Image: signin.jpg */}
          <img
            src="/signin.jpg"
            alt="Siachen Border Security Forces Salute"
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
          />
          
          {/* Tactical Vignette & Grid Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1017] via-black/40 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B1017]/80 pointer-events-none hidden lg:block" />

          {/* Tactical Corner HUD Target Marks */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-accent pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-accent pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-accent pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-accent pointer-events-none" />

          {/* Top Panel Header Info */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/70 backdrop-blur border border-white/20 text-accent text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SIACHEN BORDER GRID • C2 SECURE
            </div>
            <h2 className="text-white font-[family-name:var(--font-display)] text-2xl sm:text-3xl tracking-tight drop-shadow-md">
              National Border Security Grid
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-sm drop-shadow">
              Siachen Forward Observation Base • Elevation 18,800 FT
            </p>
          </div>

          {/* Center Tactical Reticle (Desktop only) */}
          <div className="relative z-10 hidden lg:flex flex-col items-center justify-center my-auto py-6 pointer-events-none">
            <div className="w-28 h-28 rounded-full border border-white/20 flex items-center justify-center relative">
              <div className="w-20 h-20 rounded-full border border-dashed border-accent/40 animate-spin-slow" />
              <Shield className="w-8 h-8 text-accent absolute" />
              <div className="absolute -top-1 w-2 h-0.5 bg-accent" />
              <div className="absolute -bottom-1 w-2 h-0.5 bg-accent" />
              <div className="absolute -left-1 w-0.5 h-2 bg-accent" />
              <div className="absolute -right-1 w-0.5 h-2 bg-accent" />
            </div>
            <div className="text-[10px] font-mono text-gray-300 tracking-widest uppercase mt-3">
              LAT: 35°25'12"N • LONG: 77°06'34"E
            </div>
          </div>

          {/* Bottom Telemetry Info */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex flex-col gap-2 text-[11px] font-mono text-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-[#8e8e8e]">ACTIVE PROTOCOL:</span>
              <span className="text-white font-bold">
                {step === 'CREDENTIALS' ? 'STEP 1: OPERATOR LOGIN' : 'STEP 2: BIOMETRIC RECOGNITION'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8e8e8e]">CRYPTOGRAPHIC AUDIT:</span>
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> FABRIC VALIDATED
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Terminal & Interactive Authentication */}
        <div className="lg:w-1/2 p-7 sm:p-9 flex flex-col justify-between bg-[#0B1017]">
          <div>
            {/* Header Branding */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-accent/15 border border-[#37B9FF]/30 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-foreground">
                    IBVAP COMMAND PORTAL
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground font-semibold">
                    Authorized Personnel Terminal
                  </p>
                </div>
              </div>
              <div className="px-2 py-0.5 rounded bg-red-500/15 border border-[#FF5C67]/30 text-[9px] font-mono font-bold text-red-500 tracking-wider">
                RESTRICTED
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-none bg-red-500/10 border border-[#FF5C67]/30 text-xs text-[#FF7A83] flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: CREDENTIALS (SIGN IN) */}
            {step === 'CREDENTIALS' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Username or Official Email
                    </label>
                    <span className="text-[10px] font-mono text-accent">STEP 1 OF 2</span>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="operator@ibvap.gov.in"
                      className="w-full bg-[#0F151C] border border-[#2B3947] rounded-none pl-9 pr-3 h-10 text-sm text-foreground placeholder:text-[#677480] focus:border-[#37B9FF] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0F151C] border border-[#2B3947] rounded-none pl-9 pr-10 h-10 text-sm text-foreground placeholder:text-[#677480] focus:border-[#37B9FF] focus:outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="rounded bg-[#0F151C] border-[#2B3947] text-accent focus:ring-0 cursor-pointer"
                    />
                    Remember session
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      showToast({
                        title: 'Passcode Recovery',
                        message: 'Please contact Border Sector Command Post (BSF Ops Room) for credential reset.',
                        type: 'info',
                      })
                    }
                    className="text-accent hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-accent hover:bg-accent/90 text-[#071018] font-bold text-sm rounded-none transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 shadow-lg shadow-accent/20"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#071018] border-t-transparent rounded-full animate-spin" />
                      Verifying Security Clearance...
                    </>
                  ) : (
                    <>
                      Verify Credentials & Proceed <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: FACE RECOGNITION (BIOMETRIC VERIFICATION) */}
            {step === 'FACE_VERIFICATION' && (
              <div className="animate-fade-in flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4 px-1 pb-3 border-b border-border">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-semibold">Passcode Authenticated</span>
                  </div>
                  <div className="text-xs text-accent font-mono font-bold">
                    BIOMETRIC SCAN (2 OF 2)
                  </div>
                </div>

                {/* Face Scanner with authorized insignia badge */}
                <div className="w-full mb-3 flex items-center gap-3 p-2 bg-[#0F151C] border border-[#2B3947]">
                  <img
                    src="/signin.jpg"
                    alt="Authorized Badge"
                    className="w-10 h-10 object-cover border border-white/20"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-white truncate">
                      FACE BIOMETRIC RECOGNITION
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      Look directly into the sensor frame below
                    </div>
                  </div>
                </div>

                <FaceScanner onVerificationComplete={handleFaceVerificationComplete} accessToken={accessToken} />
                
                <button
                  onClick={() => setStep('CREDENTIALS')}
                  className="mt-5 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  ← Return to Passcode Login
                </button>
              </div>
            )}
          </div>

          {/* Security notice footer */}
          <div className="mt-8 pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.04em] leading-normal font-mono">
              National Border Security Grid • Terminal Operations Cryptographically Logged
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
