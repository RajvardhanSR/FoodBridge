'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../lib/authContext';
import { AINavTabs } from '../../../../components/ai/AINavTabs';
import { Cpu, Brain, Network, ArrowRight, Sparkles } from 'lucide-react';

export default function AIPredictionRouter() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/dashboard/ai/surplus');
      return;
    }

    switch (user.role) {
      case 'NGO':
        router.replace('/dashboard/ai/demand');
        break;
      case 'ADMIN':
        router.replace('/dashboard/ai/platform');
        break;
      case 'DONOR':
      case 'VOLUNTEER':
      default:
        router.replace('/dashboard/ai/surplus');
        break;
    }
  }, [user, loading, router]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AINavTabs />

      <div className="text-center py-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>FoodBridge AI Intelligence Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Forecasting & Decision Center
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          Routing you to your role-specialized AI forecast engine...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Donor Surplus */}
        <Link
          href="/dashboard/ai/surplus"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Primary for Donors & Kitchens
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">AI Surplus Forecast</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Predict commercial kitchen food surplus, excess meal risk factors, and cost-saving landfill diversions.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
            <span>Open Surplus Regressor</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        {/* NGO Demand */}
        <Link
          href="/dashboard/ai/demand"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
              Primary for NGOs & Shelters
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">AI Demand Forecast</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Cognitive multi-agent engine forecasting daily beneficiary meal requirements, weather shocks, and safety buffers.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>Open Demand Agent</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        {/* Admin Platform */}
        <Link
          href="/dashboard/ai/platform"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
              Primary for Admins & Operations
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">AI Platform Forecast</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              City-wide macro supply vs demand balance, regional deficit heatmaps, and network stress simulations.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
            <span>Open Platform Radar</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
