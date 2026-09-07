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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-[#0A0F14] text-[#F3F6F8] antialiased overflow-hidden`}>
        <CommandCenterShell>{children}</CommandCenterShell>
      </body>
    </html>
  );
}
