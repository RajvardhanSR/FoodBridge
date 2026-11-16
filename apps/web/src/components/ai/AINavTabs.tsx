'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { Cpu, Brain, Network, Sparkles } from 'lucide-react';

export function AINavTabs() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || 'DONOR';

  const tabs = [
    {
      href: '/dashboard/ai/surplus',
      label: 'AI Surplus Forecast',
      sublabel: 'Donor & Kitchen Waste Regressor',
      icon: Cpu,
      primaryFor: 'DONOR',
      color: 'emerald'
    },
    {
      href: '/dashboard/ai/demand',
      label: 'AI Demand Forecast',
      sublabel: 'Agentic NGO & Shelter Demand Engine',
      icon: Brain,
      primaryFor: 'NGO',
      color: 'blue'
    },
    {
      href: '/dashboard/ai/platform',
      label: 'AI Platform Forecast',
      sublabel: 'City-Wide Deficit & Operations Radar',
      icon: Network,
      primaryFor: 'ADMIN',
      color: 'purple'
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (pathname === '/dashboard/ai' && role === tab.primaryFor);
          const isUserPrimary = role === tab.primaryFor;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isActive
                  ? tab.color === 'emerald'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : tab.color === 'blue'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {isUserPrimary && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  Your View
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="text-[11px] font-medium text-slate-500 hidden md:flex items-center gap-1.5 self-end sm:self-auto">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>3 Specialized AI Forecast Models Active</span>
      </div>
    </div>
  );
}
