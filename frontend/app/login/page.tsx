"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { FaceScanner } from '@/components/ui/FaceScanner';

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

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Please provide valid credentials.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Authentication failed');
      }

      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('ibvap_token', data.data.accessToken);
      }

      setIsLoading(false);
      setStep('FACE_VERIFICATION');
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Connection to server failed.');
    }
  };

  const handleFaceVerificationComplete = (success: boolean) => {
    if (success) {
      showToast({
        title: 'Authentication Successful',
        message: 'Welcome to IBVAP Command & Control Center.',
        type: 'success',
      });
      router.push('/dashboard');
    } else {
      setError('Face verification failed. Please try again.');
      setStep('CREDENTIALS'); // Reset on failure
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0F14] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Subtle background radar pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#263442_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Centered Login Card */}
      <div className="w-full max-w-[420px] bg-[#141C24] border border-[#263442] rounded-[12px] shadow-2xl p-7 relative z-10 transition-all duration-300">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#37B9FF]/15 border border-[#37B9FF]/30 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-[#37B9FF]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#F3F6F8]">
            IBVAP COMMAND & CONTROL
          </h1>
          <p className="text-[11px] uppercase tracking-[0.06em] text-[#A7B2BD] font-semibold mt-1">
            Intelligent Border Surveillance Operations
          </p>
          <div className="mt-3 px-2.5 py-1 rounded bg-[#FF5C67]/15 border border-[#FF5C67]/30 text-[10px] font-mono font-bold text-[#FF5C67] tracking-wider">
            AUTHORIZED PERSONNEL ONLY
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-[7px] bg-[#FF5C67]/10 border border-[#FF5C67]/30 text-xs text-[#FF7A83] flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'CREDENTIALS' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-[#A7B2BD] block mb-1.5">
                Username or Official Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7B87]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="operator@ibvap.gov.in"
                  className="w-full bg-[#0F151C] border border-[#2B3947] rounded-[7px] pl-9 pr-3 h-10 text-sm text-[#F3F6F8] placeholder:text-[#677480] focus:border-[#37B9FF] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#A7B2BD] block mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7B87]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0F151C] border border-[#2B3947] rounded-[7px] pl-9 pr-10 h-10 text-sm text-[#F3F6F8] placeholder:text-[#677480] focus:border-[#37B9FF] focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7B87] hover:text-[#F3F6F8]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#A7B2BD] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded bg-[#0F151C] border-[#2B3947] text-[#37B9FF] focus:ring-0 cursor-pointer"
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
                className="text-[#37B9FF] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#37B9FF] hover:bg-[#37B9FF]/90 text-[#071018] font-bold text-sm rounded-[7px] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#071018] border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Credentials <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'FACE_VERIFICATION' && (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2 text-[#39D98A]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">Credentials Verified</span>
              </div>
              <div className="text-xs text-[#A7B2BD] font-mono">Step 2 of 2</div>
            </div>

            <FaceScanner onVerificationComplete={handleFaceVerificationComplete} />
            
            <button
              onClick={() => setStep('CREDENTIALS')}
              className="mt-6 text-xs text-[#6E7B87] hover:text-[#F3F6F8] transition-colors"
            >
              Cancel and go back
            </button>
          </div>
        )}

        {/* Security notice footer */}
        <div className="mt-6 pt-4 border-t border-[#263442] text-center">
          <p className="text-[10px] text-[#6E7B87] uppercase tracking-[0.04em] leading-normal">
            National Border Security Grid • All Terminal Operations Are Cryptographically Logged
          </p>
        </div>
      </div>
    </div>
  );
}
