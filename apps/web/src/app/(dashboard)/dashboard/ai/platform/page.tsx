'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../../../../lib/api';
import { AINavTabs } from '../../../../../components/ai/AINavTabs';
import { Button } from '../../../../../components/ui/Button';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Network,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Sliders,
  Truck,
  MapPin,
  Zap,
  Building2,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function AIPlatformForecastPage() {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forecasts, setForecasts] = useState<any>(null);

  // Platform Stress Simulator State
  const [shock, setShock] = useState('NORMAL');
  const [region, setRegion] = useState('ALL');
  const [donorParticipation, setDonorParticipation] = useState(75);
  const [volunteerCount, setVolunteerCount] = useState(180);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Load baseline forecast data
  const loadForecastData = async (daysCount: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/ai/forecasts?days=${daysCount}`);
      setForecasts(res);
    } catch (err: any) {
      console.error('Failed to load platform forecast:', err);
      setErrorMsg('Failed to load city-wide forecast trajectory.');
    } finally {
      setLoading(false);
    }
  };

  // Run platform simulation
  const runSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSimulating(true);
    setErrorMsg(null);
    try {
      const res = await api.post('/ai/simulate/platform', {
        shock,
        region,
        donorParticipation: Number(donorParticipation),
        volunteerCount: Number(volunteerCount)
      });
      setSimulationResult(res);
    } catch (err: any) {
      console.error('Failed to run simulation:', err);
      setErrorMsg(err.message || 'Simulation execution failed.');
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    loadForecastData(days);
    runSimulation();
  }, [days]);

  // Derived values from current simulation or defaults
  const totalSurplus = simulationResult?.totalSurplusKg ?? 1660;
  const totalDemand = simulationResult?.totalDemandKg ?? 1490;
  const netBalance = simulationResult?.netBalanceKg ?? 170;
  const equilibriumRatio = simulationResult?.equilibriumRatio ?? 111.4;
  const rescueRate = simulationResult?.rescueRate ?? 94.8;
  const dispatchVelocity = simulationResult?.avgDispatchMins ?? 24;
  const macroStatus = simulationResult?.macroStatus ?? 'OPTIMAL_CUSHION';
  const zones = simulationResult?.zones ?? [
    { id: 'central', name: 'Central Delhi', hubs: 'Connaught Place / Karol Bagh', donors: 28, ngos: 14, predictedSurplusKg: 340, predictedDemandKg: 280, netBalanceKg: 60, status: 'SURPLUS', directive: 'Staged for export to deficit corridors (+60 kg surplus cushion)' },
    { id: 'north', name: 'North Delhi', hubs: 'Kashmere Gate / Civil Lines', donors: 16, ngos: 24, predictedSurplusKg: 190, predictedDemandKg: 280, netBalanceKg: -90, status: 'DEFICIT', directive: 'Priority inter-zone food transfer required (90 kg deficit)' },
    { id: 'south', name: 'South Delhi', hubs: 'Hauz Khas / Saket / Okhla', donors: 42, ngos: 18, predictedSurplusKg: 490, predictedDemandKg: 310, netBalanceKg: 180, status: 'SURPLUS', directive: 'Staged for export to deficit corridors (+180 kg surplus cushion)' },
    { id: 'west', name: 'West Delhi', hubs: 'Rajouri Garden / Janakpuri', donors: 22, ngos: 19, predictedSurplusKg: 210, predictedDemandKg: 225, netBalanceKg: -15, status: 'BALANCED', directive: 'Local distribution balanced within standard cluster radius' },
    { id: 'east', name: 'East Delhi & Trans-Yamuna', hubs: 'Laxmi Nagar / Anand Vihar', donors: 14, ngos: 21, predictedSurplusKg: 130, predictedDemandKg: 185, netBalanceKg: -55, status: 'DEFICIT', directive: 'Priority inter-zone food transfer required (55 kg deficit)' },
    { id: 'noida', name: 'Noida Sector Hub', hubs: 'Sectors 18, 62 & 137', donors: 31, ngos: 15, predictedSurplusKg: 280, predictedDemandKg: 210, netBalanceKg: 70, status: 'SURPLUS', directive: 'Staged for export to deficit corridors (+70 kg surplus cushion)' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Universal Model Switcher */}
      <AINavTabs />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
          <Network className="w-3.5 h-3.5 text-purple-600" />
          <span>Admin & City Operations Command • Macro Supply/Demand Equilibrium Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Platform Forecast & Deficit Radar
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          City-wide aggregate supply/demand balancing, regional hunger deficit alerts, predictive volunteer routing, and multi-hub stress simulations.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-800">Operational Notice</h4>
            <p className="text-xs text-red-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Macro Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: City Equilibrium */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">City Equilibrium Ratio</span>
            <div className={`p-2 rounded-xl ${equilibriumRatio >= 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{equilibriumRatio}%</span>
            <span className={`text-xs font-bold flex items-center ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {netBalance >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {netBalance >= 0 ? `+${netBalance} kg surplus` : `${netBalance} kg deficit`}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            {totalSurplus} kg supply vs {totalDemand} kg demand
          </p>
        </div>

        {/* Card 2: Deficit Hotspots */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Regional Deficit</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">North Delhi</span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              -90 kg alert
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            3 shelter kitchens running under target food buffer
          </p>
        </div>

        {/* Card 3: Rescue Fulfillment Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Predictive Rescue Rate</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{rescueRate}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +3.2% vs manual
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            High-risk perishable food saved before expiration
          </p>
        </div>

        {/* Card 4: Dispatch Velocity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fleet Dispatch Velocity</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{dispatchVelocity}m</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Avg Turnaround
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            {volunteerCount} active volunteer couriers coordinated
          </p>
        </div>
      </div>

      {/* Main Grid: Equilibrium Trajectory & Stress Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: City-Wide Supply vs Demand Equilibrium Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  City-Wide Supply vs. Demand Trajectory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-agent aggregate forecast comparing commercial donor surplus vs NGO shelter demand.
                </p>
              </div>

              {/* Time Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      days === d ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-72 w-full mt-4">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                  <span className="text-xs font-medium">Calculating platform equilibrium trajectory...</span>
                </div>
              ) : forecasts?.forecast && forecasts.forecast.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecasts.forecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="surplusGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      unit="kg"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                        padding: '10px 14px'
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="predictedSurplusKg"
                      name="Predicted Surplus (Donors)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#surplusGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="predictedDemandKg"
                      name="Predicted Demand (NGOs)"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#demandGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No forecast data available.
                </div>
              )}
            </div>
          </div>

          {/* Operational Insights Pill Box */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>
                <strong>Friday/Saturday Peak:</strong> Banquets and dining hubs surge by +38%, creating large surplus export windows for South Delhi & Noida.
              </span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>
                <strong>North Delhi Deficit Alert:</strong> Winter season intake across Kashmere Gate requires daily inter-district transfer of ~90 kg cooked meals.
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Platform Stress Simulator Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">City Network Stress Simulator</h3>
                  <p className="text-[11px] text-slate-500">Model resilience under real-world shocks</p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            <form onSubmit={runSimulation} className="mt-4 space-y-4">
              {/* Shock Scenario */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Simulated Macro Shock</label>
                <select
                  value={shock}
                  onChange={(e) => setShock(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="NORMAL">Standard Baseline Operations</option>
                  <option value="WINTER_COLD_WAVE">Severe Winter Cold Wave (+42% Demand)</option>
                  <option value="MONSOON_FLOOD">Monsoon Road Inundation (+34% Need, -16m Delay)</option>
                  <option value="FESTIVAL_WEDDING_SURGE">Banquet & Wedding Season (+82% Surplus)</option>
                  <option value="FLEET_DISRUPTION">Volunteer Courier Shortage (-40% Fleet)</option>
                </select>
              </div>

              {/* Geographic Region */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Zone Corridor</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Delhi-NCR Metros (6 Monitored Hubs)</option>
                  <option value="CENTRAL">Central Delhi (Connaught Place / Karol Bagh)</option>
                  <option value="NORTH">North Delhi (Kashmere Gate / Civil Lines)</option>
                  <option value="SOUTH">South Delhi (Hauz Khas / Saket / Okhla)</option>
                  <option value="WEST">West Delhi (Rajouri Garden / Janakpuri)</option>
                  <option value="EAST">East Delhi (Laxmi Nagar / Anand Vihar)</option>
                  <option value="NOIDA">Noida Sector Hub (Sectors 18, 62, 137)</option>
                </select>
              </div>

              {/* Donor Participation Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Donor Commercial Participation</span>
                  <span className="text-purple-600 font-extrabold">{donorParticipation}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={donorParticipation}
                  onChange={(e) => setDonorParticipation(Number(e.target.value))}
                  className="w-full accent-purple-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Scale of commercial kitchens sharing live surplus</span>
              </div>

              {/* Volunteer Fleet Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Active Volunteer Couriers</span>
                  <span className="text-purple-600 font-extrabold">{volunteerCount} active</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="350"
                  step="10"
                  value={volunteerCount}
                  onChange={(e) => setVolunteerCount(Number(e.target.value))}
                  className="w-full accent-purple-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Logistics dispatch capacity across active corridors</span>
              </div>

              <Button
                type="submit"
                disabled={simulating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {simulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Simulation...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Run City Stress Simulation</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Simulation Status Card */}
          {simulationResult && (
            <div className="mt-4 p-3 rounded-xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-1">
                <span>Simulation Result</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold ${
                  macroStatus === 'OPTIMAL_CUSHION'
                    ? 'bg-emerald-100 text-emerald-800'
                    : macroStatus === 'CRITICAL_DEFICIT'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {macroStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] text-purple-800 leading-snug">
                {simulationResult.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Regional Zone Deficit & Surplus Radar Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Regional Zone Deficit & Surplus Radar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live zone-by-zone equilibrium balance identifying supply excess and hunger deficits.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Monitored: <span className="text-slate-900 font-bold">{zones.length} Zones</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Zone & Primary Hubs</th>
                <th className="py-3.5 px-4">Network Scale</th>
                <th className="py-3.5 px-4">Predicted Surplus</th>
                <th className="py-3.5 px-4">Predicted Demand</th>
                <th className="py-3.5 px-4">Net Equilibrium</th>
                <th className="py-3.5 px-4">AI Dispatch Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {zones.map((z: any) => (
                <tr key={z.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{z.name}</div>
                    <div className="text-[11px] text-slate-400">{z.hubs}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[11px]">
                    <span className="font-semibold text-slate-900">{z.donors}</span> Donors •{' '}
                    <span className="font-semibold text-slate-900">{z.ngos}</span> NGOs
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    {z.predictedSurplusKg} kg
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">
                    {z.predictedDemandKg} kg
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      z.status === 'SURPLUS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : z.status === 'DEFICIT'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {z.netBalanceKg > 0 ? `+${z.netBalanceKg} kg` : `${z.netBalanceKg} kg`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-600 max-w-xs">
                    {z.directive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Automated Inter-Zone Corridor Directives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full pointer-events-none -mr-4 -mt-4" />
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">
              Corridor Alpha
            </span>
            <span className="text-[11px] font-semibold text-slate-500">South → North Delhi</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-1">Inter-District Cooked Meal Rebalancing</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Auto-dispatch 14 refrigerated vans along the Ring Road to transfer 140 kg banquet surplus from Saket to Kashmere Gate community shelters.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-purple-700">
            <span>ETA: 34 mins</span>
            <span>Feeds 350 People</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none -mr-4 -mt-4" />
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
              Corridor Beta
            </span>
            <span className="text-[11px] font-semibold text-slate-500">Central → East Delhi</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-1">Bakery & Perishables Rapid Transfer</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Mobilize 6 two-wheeler couriers from Connaught Place cafes to Anand Vihar children's home for 60 kg fresh baked goods before 4:30 PM.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
            <span>ETA: 22 mins</span>
            <span>Zero Food Waste</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none -mr-4 -mt-4" />
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
              Corridor Gamma
            </span>
            <span className="text-[11px] font-semibold text-slate-500">Noida Tech Parks → Jamia</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-1">Institutional Cafeteria Redistribution</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Coordinate evening lunch excess from 4 corporate cafeterias (Sector 62) directly to unhoused families in South-East trans-border communities.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-blue-700">
            <span>ETA: 28 mins</span>
            <span>480 Meals Rescued</span>
          </div>
        </div>
      </div>
    </div>
  );
}
