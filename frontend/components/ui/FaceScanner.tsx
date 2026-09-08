import React, { useEffect, useRef, useState } from 'react';
import { Camera, ScanFace, CheckCircle2, AlertCircle } from 'lucide-react';

interface FaceScannerProps {
  onVerificationComplete: (success: boolean) => void;
}

type ScanState = 'initializing' | 'scanning' | 'verifying' | 'success' | 'error';

export function FaceScanner({ onVerificationComplete }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanState, setScanState] = useState<ScanState>('initializing');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    let active = true;
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 480, height: 480 },
        });
        if (!active) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setScanState('scanning');
        simulateVerification();
      } catch (err: any) {
        console.error('Error accessing camera:', err);
        setScanState('error');
        setErrorMsg('Camera access denied or unavailable. Please ensure permissions are granted.');
      }
    };

    startCamera();

    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const simulateVerification = () => {
    // Simulate liveness detection and scanning for 3 seconds
    setTimeout(() => {
      setScanState('verifying');
      // Simulate backend matching for 1.5 seconds
      setTimeout(() => {
        setScanState('success');
        setTimeout(() => {
          onVerificationComplete(true);
        }, 1000);
      }, 1500);
    }, 3000);
  };

  // Ensure stream is stopped when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanLine {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan-line {
          animation: scanLine 2s ease-in-out infinite;
        }
      `}} />
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-[#263442] bg-[#0F151C] shadow-inner flex items-center justify-center">
        {scanState === 'initializing' && (
          <div className="flex flex-col items-center justify-center text-[#6E7B87] space-y-2">
            <Camera className="w-8 h-8 animate-pulse" />
            <span className="text-xs font-semibold">Initializing Camera...</span>
          </div>
        )}

        {scanState === 'error' && (
          <div className="flex flex-col items-center justify-center text-[#FF5C67] space-y-2 p-4 text-center">
            <AlertCircle className="w-8 h-8" />
            <span className="text-xs font-semibold">{errorMsg}</span>
          </div>
        )}

        {(scanState === 'scanning' || scanState === 'verifying' || scanState === 'success') && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                scanState === 'success' ? 'opacity-50' : 'opacity-100'
              }`}
            />
            {/* Liveness Scanning Overlay */}
            {scanState === 'scanning' && (
              <>
                <div className="absolute inset-0 border-4 border-[#37B9FF] rounded-full animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#37B9FF] shadow-[0_0_8px_2px_rgba(55,185,255,0.8)] animate-scan-line" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80%] h-[80%] border border-dashed border-[#37B9FF]/50 rounded-full" />
                </div>
              </>
            )}
            {scanState === 'success' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141C24]/80 backdrop-blur-sm z-10 animate-fade-in">
                <CheckCircle2 className="w-16 h-16 text-[#39D98A] mb-2" />
                <span className="text-sm font-bold text-[#F3F6F8]">Match Confirmed</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="text-center h-12">
        {scanState === 'scanning' && (
          <div className="flex flex-col items-center animate-fade-in">
            <ScanFace className="w-5 h-5 text-[#37B9FF] mb-1 animate-bounce" />
            <p className="text-xs font-semibold text-[#A7B2BD]">Detecting liveness... Please look straight</p>
          </div>
        )}
        {scanState === 'verifying' && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-5 h-5 border-2 border-[#37B9FF] border-t-transparent rounded-full animate-spin mb-1" />
            <p className="text-xs font-semibold text-[#A7B2BD]">Verifying Identity (1:1)...</p>
          </div>
        )}
        {scanState === 'success' && (
          <div className="flex flex-col items-center animate-fade-in">
             <p className="text-xs font-bold text-[#39D98A]">Identity Verified</p>
             <p className="text-[10px] text-[#A7B2BD] mt-0.5">Authorized for access.</p>
          </div>
        )}
      </div>
    </div>
  );
}
