import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CommandCenterShell } from '@/components/layout/CommandCenterShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IBVAP — Intelligent Border Video Analytics Platform | Command & Control',
  description:
    'Government-grade AI-powered border surveillance operations platform with real-time video analytics, virtual fence intrusion detection, and blockchain evidence integrity verification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0A0F14] text-[#F3F6F8] antialiased overflow-hidden`}>
        <CommandCenterShell>{children}</CommandCenterShell>
      </body>
    </html>
  );
}
