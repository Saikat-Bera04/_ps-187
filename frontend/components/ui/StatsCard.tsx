"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof LucideIcons | React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  indicatorColor?: string; // hex or tailwind color
  isCritical?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  indicatorColor = '#37B9FF',
  isCritical = false,
  onClick,
  className = '',
}: StatsCardProps) {
  // Render icon
  let iconElement: React.ReactNode = null;
  if (typeof icon === 'string') {
    // @ts-ignore
    const IconComponent = LucideIcons[icon] || LucideIcons.Activity;
    iconElement = <IconComponent className="w-4 h-4" style={{ color: indicatorColor }} />;
  } else {
    iconElement = icon;
  }

  return (
    <div
      onClick={onClick}
      className={`relative bg-[#141C24] border border-[#263442] rounded-[10px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 ${
        isCritical ? 'border-t-2 border-t-[#FF5C67]' : ''
      } ${onClick ? 'cursor-pointer hover:border-[#344454] hover:bg-[#18222C]' : ''} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#A7B2BD] truncate">
          {title}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#263442] bg-[#0F151C]"
          style={{ borderColor: `${indicatorColor}25` }}
        >
          {iconElement}
        </div>
      </div>

      <div className="flex items-baseline gap-2 my-1">
        <span
          className={`text-[28px] sm:text-[32px] font-bold tracking-tight text-[#F3F6F8] leading-none ${
            isCritical ? 'text-[#FF5C67]' : ''
          }`}
        >
          {value}
        </span>
      </div>

      {(trend || subtitle) && (
        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[#263442]/50">
          {trend && (
            <span
              className={`font-medium ${
                trend.isPositive ? 'text-[#39D98A]' : 'text-[#FF8A4C]'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-[#6E7B87] truncate text-[11px]">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
