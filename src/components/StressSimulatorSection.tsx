import React, { useState } from 'react';
import {
  TrendingDown,
  Activity,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { HomeownerProfile, calculateHostingFinancials } from '../utils/calculator';

interface StressSimulatorProps {
  profile: HomeownerProfile;
  onChangeProfile: (updates: Partial<HomeownerProfile>) => void;
}

export const StressSimulatorSection: React.FC<StressSimulatorProps> = ({
  profile,
  onChangeProfile,
}) => {
  const [activeScenario, setActiveScenario] = useState<string>('baseline');

  // Baseline calculation
  const baselineFin = calculateHostingFinancials(profile);

  // Apply one-step stress test scenario
  const handleApplyScenario = (type: 'baseline' | 'demand_drop_25' | 'price_war_15' | 'cost_spike_20' | 'severe_compound') => {
    setActiveScenario(type);
    if (type === 'baseline') {
      onChangeProfile({
        expectedOccupancyRate: 0.50,
        nightlyPrice: 125,
        cleaningCostPaidPerStay: 55,
      });
    } else if (type === 'demand_drop_25') {
      // 50% * 0.75 = 37.5% occupancy
      onChangeProfile({
        expectedOccupancyRate: 0.375,
      });
    } else if (type === 'price_war_15') {
      // $125 * 0.85 = $106.25 -> 106
      onChangeProfile({
        nightlyPrice: 106,
      });
    } else if (type === 'cost_spike_20') {
      // Cleaning $55 -> $66
      onChangeProfile({
        cleaningCostPaidPerStay: 66,
        annualMaintenanceBudget: 500,
      });
    } else if (type === 'severe_compound') {
      // Demand -25% AND Price -15%
      onChangeProfile({
        expectedOccupancyRate: 0.375,
        nightlyPrice: 106,
        cleaningCostPaidPerStay: 65,
      });
    }
  };

  const currentFin = calculateHostingFinancials(profile);

  // Delta calculations
  const turnoverDelta = currentFin.grossGuestTurnover - 16600;
  const profitDelta = currentFin.economicProfitAfterSetupAndTax - 9521;
  const cashDelta = currentFin.netOperatingCashFlow - 12242;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white">
              What-If Risk & Market Stress Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate market shocks: tourist downturns, price competition from new supply, or cleaning inflation
          </p>
        </div>

        <button
          onClick={() => handleApplyScenario('baseline')}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Baseline
        </button>
      </div>

      {/* Quick Scenario Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => handleApplyScenario('demand_drop_25')}
          id="stress-test-demand-btn"
          className={`p-3.5 rounded-xl border text-left transition-all relative ${
            activeScenario === 'demand_drop_25'
              ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-400'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-400 mb-1">
            <span>Demand Falls 25%</span>
            <span className="text-[10px] bg-rose-950 px-1.5 py-0.5 rounded font-mono">-25% Nights</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Occupancy drops from 50% to 37.5% (90 booked nights). Tests local tourism slowdown.
          </p>
        </button>

        <button
          onClick={() => handleApplyScenario('price_war_15')}
          className={`p-3.5 rounded-xl border text-left transition-all relative ${
            activeScenario === 'price_war_15'
              ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-400'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
            <span>Price Compression 15%</span>
            <span className="text-[10px] bg-amber-950 px-1.5 py-0.5 rounded font-mono">$106 ADR</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Nightly price forced down from $125 to $106 due to neighborhood room competition.
          </p>
        </button>

        <button
          onClick={() => handleApplyScenario('cost_spike_20')}
          className={`p-3.5 rounded-xl border text-left transition-all relative ${
            activeScenario === 'cost_spike_20'
              ? 'bg-orange-950/40 border-orange-500 ring-1 ring-orange-400'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-orange-400 mb-1">
            <span>Cost & Cleaning Spike 20%</span>
            <span className="text-[10px] bg-orange-950 px-1.5 py-0.5 rounded font-mono">+$11/turn</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Cleaner fee jumps from $55 to $66; maintenance reserves increase by $100.
          </p>
        </button>

        <button
          onClick={() => handleApplyScenario('severe_compound')}
          className={`p-3.5 rounded-xl border text-left transition-all relative ${
            activeScenario === 'severe_compound'
              ? 'bg-red-950/50 border-red-500 ring-1 ring-red-400'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-red-400 mb-1">
            <span>Compound Stress Test</span>
            <span className="text-[10px] bg-red-950 px-1.5 py-0.5 rounded font-mono">Worst Case</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Demand drops 25%, rate drops to $106, and cleaning fees jump to $65 per turnover.
          </p>
        </button>
      </div>

      {/* Stress Results Comparison Panel */}
      <div className="bg-slate-950 p-4 md:p-5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] block">
            Stressed Gross Turnover
          </span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            ${currentFin.grossGuestTurnover.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 font-mono text-xs">
            {turnoverDelta < 0 ? (
              <span className="text-rose-400 font-bold flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                -${Math.abs(turnoverDelta).toLocaleString()} ({Math.round((turnoverDelta / 16600) * 100)}%)
              </span>
            ) : (
              <span className="text-emerald-400 font-bold">Baseline ($16,600)</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] block">
            Stressed Net Operating Cash
          </span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            ${currentFin.netOperatingCashFlow.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 font-mono text-xs">
            {cashDelta < 0 ? (
              <span className="text-rose-400 font-bold flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                -${Math.abs(cashDelta).toLocaleString()} vs base
              </span>
            ) : (
              <span className="text-emerald-400 font-bold">Baseline ($12,242)</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] block">
            Stressed True Economic Profit
          </span>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            ${Math.round(currentFin.economicProfitAfterSetupAndTax).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 font-mono text-xs">
            {profitDelta < 0 ? (
              <span className="text-rose-400 font-bold flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                -${Math.abs(profitDelta).toLocaleString()} vs base
              </span>
            ) : (
              <span className="text-emerald-400 font-bold">Baseline ($9,521)</span>
            )}
          </div>
        </div>
      </div>

      {/* Stress Narrative Summary */}
      <div className="p-3.5 bg-slate-950/70 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
        <h4 className="font-bold text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Stress Test Takeaway for Maya Chen:
        </h4>
        <p className="text-slate-400 leading-relaxed">
          Under the <strong>25% demand drop scenario</strong>, Maya still generates <strong>${currentFin.netOperatingCashFlow.toLocaleString()} in net pre-tax cash flow</strong> and <strong>${Math.round(currentFin.economicProfitAfterSetupAndTax).toLocaleString()} in true economic profit</strong>. Because her fixed cash overhead is minimal (only $1,660 in annual utilities, insurance, maintenance, and supplies), her business remains cash-positive even if booked nights contract to 33 nights a year.
        </p>
      </div>
    </section>
  );
};
