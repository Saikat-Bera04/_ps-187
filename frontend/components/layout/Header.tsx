"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { Search, Bell, Wifi, CheckCircle2, Shield, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine current page title
  let pageTitle = 'Dashboard';
  Object.values(NAV_ITEMS)
    .flat()
    .forEach((item) => {
      if (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) {
        pageTitle = item.label;
      }
    });

  if (pathname.startsWith('/cameras/')) pageTitle = 'Camera Inspection';
  if (pathname.startsWith('/events/')) pageTitle = 'Event Forensic Details';
  if (pathname.startsWith('/evidence/')) pageTitle = 'Blockchain Evidence Verification';

  return (
    <header className="h-16 flex-shrink-0 bg-[#0A0F14] border-b border-[#263442] flex items-center justify-between px-6 z-20">
      {/* Left: Current Page / Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-base sm:text-lg font-semibold text-[#F3F6F8] tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Center: Operational System Status (Section 10) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#141C24] border border-[#263442] rounded-full">
        <span className="w-2 h-2 rounded-full bg-[#39D98A] animate-pulse" />
        <span className="text-xs font-semibold text-[#A7B2BD]">System Status</span>
        <span className="text-xs font-bold text-[#39D98A]">Operational</span>
        <span className="text-[#6E7B87] text-xs">|</span>
        <span className="text-[11px] font-mono text-[#6E7B87]">{currentTime}</span>
      </div>

      {/* Right side: Search, Notifications, Connection, Profile */}
      <div className="flex items-center gap-3">
        {/* Global Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0F151C] hover:bg-[#18222C] border border-[#263442] rounded-[7px] text-xs text-[#A7B2BD] transition-colors"
          title="Search (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#37B9FF]" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#6E7B87] bg-[#141C24] border border-[#263442] rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-[7px] bg-[#141C24] hover:bg-[#18222C] border border-[#263442] text-[#A7B2BD] hover:text-[#F3F6F8] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5C67] animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#141C24] border border-[#344454] rounded-[10px] shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="p-3 border-b border-[#263442] bg-[#18222C] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F3F6F8]">Recent Security Alerts</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#6E7B87] hover:text-[#F3F6F8]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-[#263442] max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-[#18222C] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#FF5C67]">CRITICAL INTRUSION</span>
                    <span className="text-[10px] text-[#6E7B87] font-mono">02:31 IST</span>
                  </div>
                  <p className="text-xs text-[#F3F6F8] mt-1">Person crossed North Fence boundary at BOP-12.</p>
                  <Link
                    href="/events/EVT-10001"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-[#37B9FF] font-medium flex items-center gap-1 mt-1.5 hover:underline"
                  >
                    View Forensic Event <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="p-3 hover:bg-[#18222C] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#FF8A4C]">ANPR WATCHLIST MATCH</span>
                    <span className="text-[10px] text-[#6E7B87] font-mono">04:55 IST</span>
                  </div>
                  <p className="text-xs text-[#F3F6F8] mt-1">Vehicle RJ-14-AB-1234 matched at NE Gate BOP-33.</p>
                  <Link
                    href="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-[#37B9FF] font-medium flex items-center gap-1 mt-1.5 hover:underline"
                  >
                    Review in Alert Center <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <div className="p-2 border-t border-[#263442] bg-[#0F151C] text-center">
                <Link
                  href="/alerts"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#37B9FF] hover:underline"
                >
                  View All Alerts
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Live Network Indicator */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] bg-[#141C24] border border-[#263442]"
          title="Edge AI C2 Mesh Active"
        >
          <Wifi className="w-3.5 h-3.5 text-[#39D98A]" />
          <span className="text-[11px] font-mono text-[#A7B2BD]">12ms</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#263442]">
          <div className="w-7 h-7 rounded-full bg-[#18222C] border border-[#37B9FF]/40 flex items-center justify-center font-bold text-[11px] text-[#37B9FF]">
            SB
          </div>
          <div className="hidden xl:block">
            <span className="text-xs font-semibold text-[#F3F6F8] block leading-none">Saikat Bera</span>
            <span className="text-[10px] text-[#6E7B87] font-mono leading-tight">Operator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
