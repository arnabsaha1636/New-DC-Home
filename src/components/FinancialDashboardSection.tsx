import React from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Sliders,
  HelpCircle,
  AlertTriangle,
  Receipt,
  Sparkles,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { HomeownerProfile, FinancialBreakdown, calculateHostingFinancials } from '../utils/calculator';

interface FinancialDashboardProps {
  profile: HomeownerProfile;
  onChangeProfile: (updates: Partial<HomeownerProfile>) => void;
}

export const FinancialDashboardSection: React.FC<FinancialDashboardProps> = ({
  profile,
  onChangeProfile,
}) => {
  const fin = calculateHostingFinancials(profile);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Revenue & Transparent Profit Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculates gross turnover, cleaning deficit, platform fees, utilities, taxes, and net economic profit
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Modeled Booked Nights:</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-bold font-mono border border-slate-700">
            {fin.actualBookedNightsProjected} nights ({profile.expectedOccupancyRate * 100}% of {fin.effectiveBookableNightsRequested})
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Metric 1: Gross Turnover */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
            Gross Guest Turnover
          </span>
          <div className="text-xl md:text-2xl font-black text-white font-mono mt-1">
            ${fin.grossGuestTurnover.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            ${fin.grossNightlyRevenue.toLocaleString()} room + ${fin.cleaningFeesCollected} cleaning
          </p>
        </div>

        {/* Metric 2: Cash Operating Expenses */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
            Operating Outflow
          </span>
          <div className="text-xl md:text-2xl font-black text-rose-400 font-mono mt-1">
            -${fin.totalCashOperatingCosts.toLocaleString()}
          </div>
          <p className="text-[11px] text-rose-300/80 mt-1">
            Fees, utilities, cleaning & maintenance
          </p>
        </div>

        {/* Metric 3: Net Operating Cash Flow */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
            Net Cash Flow (Pre-Tax)
          </span>
          <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono mt-1">
            ${fin.netOperatingCashFlow.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">
            ${Math.round(fin.netOperatingCashFlow / 12).toLocaleString()}/month cash in pocket
          </p>
        </div>

        {/* Metric 4: True Economic Profit */}
        <div className="bg-gradient-to-br from-slate-950 to-indigo-950/80 p-4 rounded-xl border border-indigo-500/40">
          <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold block">
            True Economic Profit
          </span>
          <div className="text-xl md:text-2xl font-black text-amber-300 font-mono mt-1">
            ${Math.round(fin.economicProfitAfterSetupAndTax).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            After $750 setup amort & tax liability
          </p>
        </div>
      </div>

      {/* Interactive Assumption Sliders Grid */}
      <div className="bg-slate-950/70 p-4 md:p-5 rounded-xl border border-slate-800">
        <h3 className="text-xs md:text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Live Homeowner Property & Financial Assumption Controls
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            Move sliders to observe real-time profit and cash flow reconciliation
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Slider 1: Nightly Asking Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <label htmlFor="nightly-price-input" className="font-medium">Nightly Asking Price</label>
              <span className="font-mono font-bold text-amber-300">${profile.nightlyPrice} / night</span>
            </div>
            <input
              id="nightly-price-input"
              type="range"
              min={60}
              max={350}
              step={5}
              value={profile.nightlyPrice}
              onChange={(e) => onChangeProfile({ nightlyPrice: Number(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$60 (Budget)</span>
              <span>$155 (Petworth Med)</span>
              <span>$350 (Luxury)</span>
            </div>
          </div>

          {/* Slider 2: Annual Available Nights */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <label htmlFor="available-nights-input" className="font-medium">Available Nights Offered</label>
              <span className="font-mono font-bold text-indigo-300">{profile.annualAvailableNights} nights / yr</span>
            </div>
            <input
              id="available-nights-input"
              type="range"
              min={30}
              max={365}
              step={10}
              value={profile.annualAvailableNights}
              onChange={(e) => onChangeProfile({ annualAvailableNights: Number(e.target.value) })}
              className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>30 nts</span>
              <span>90 nts (DC Unhosted Cap)</span>
              <span>365 nts (Full Yr)</span>
            </div>
          </div>

          {/* Slider 3: Expected Occupancy Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <label htmlFor="occupancy-rate-input" className="font-medium">Expected Occupancy Rate</label>
              <span className="font-mono font-bold text-emerald-300">
                {Math.round(profile.expectedOccupancyRate * 100)}% ({fin.actualBookedNightsProjected} nights)
              </span>
            </div>
            <input
              id="occupancy-rate-input"
              type="range"
              min={0.15}
              max={0.85}
              step={0.05}
              value={profile.expectedOccupancyRate}
              onChange={(e) => onChangeProfile({ expectedOccupancyRate: Number(e.target.value) })}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>15% (Low)</span>
              <span>50% (Baseline Model)</span>
              <span>85% (Peak)</span>
            </div>
          </div>

          {/* Slider 4: Guest Cleaning Fee Charged */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <label htmlFor="cleaning-charged-input" className="font-medium">Cleaning Charged to Guest</label>
              <span className="font-mono font-bold text-slate-200">${profile.cleaningFeeChargedToGuest} / stay</span>
            </div>
            <input
              id="cleaning-charged-input"
              type="range"
              min={0}
              max={120}
              step={5}
              value={profile.cleaningFeeChargedToGuest}
              onChange={(e) => onChangeProfile({ cleaningFeeChargedToGuest: Number(e.target.value) })}
              className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$0 (Free turn)</span>
              <span>$40 (Maya Base)</span>
              <span>$120 (Deep clean)</span>
            </div>
          </div>

          {/* Slider 5: Cleaning Cost Paid to Service */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <label htmlFor="cleaner-cost-input" className="font-medium">Cleaner Cost Paid per Stay</label>
              <span className="font-mono font-bold text-rose-300">${profile.cleaningCostPaidPerStay} / stay</span>
            </div>
            <input
              id="cleaner-cost-input"
              type="range"
              min={0}
              max={140}
              step={5}
              value={profile.cleaningCostPaidPerStay}
              onChange={(e) => onChangeProfile({ cleaningCostPaidPerStay: Number(e.target.value) })}
              className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$0 (Self-clean)</span>
              <span>$55 (Standard turnover)</span>
              <span>$140 (Service)</span>
            </div>
          </div>

          {/* Slider 6: Owner Labor Hours per Reservation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <label htmlFor="owner-hours-input" className="font-medium">Host Labor Hours / Stay</label>
              <span className="font-mono font-bold text-amber-300">{profile.ownerHoursPerReservation} hrs ({fin.totalHostLaborHoursPerYear} hrs/yr)</span>
            </div>
            <input
              id="owner-hours-input"
              type="range"
              min={0.5}
              max={6.0}
              step={0.5}
              value={profile.ownerHoursPerReservation}
              onChange={(e) => onChangeProfile({ ownerHoursPerReservation: Number(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5 hr (Keylock)</span>
              <span>2.5 hrs (Greeting + laundry)</span>
              <span>6 hrs (Full turn)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Financial Waterfall Reconciler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
        {/* Column 1: Financial Waterfall Table */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-emerald-400" />
              Annual Cash Flow Breakdown
            </span>
            <span className="text-[11px] font-mono text-slate-400">40 Reservations (3-nt avg)</span>
          </h4>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between py-1 text-slate-300">
              <span>+ Lodging Nights ({fin.actualBookedNightsProjected} × ${profile.nightlyPrice}):</span>
              <span className="text-white font-bold">${fin.grossNightlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-300">
              <span>+ Cleaning Fees Collected ({fin.totalReservationsCount} × ${profile.cleaningFeeChargedToGuest}):</span>
              <span className="text-white font-bold">${fin.cleaningFeesCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 bg-slate-900/60 px-2 rounded font-bold text-amber-300 border border-slate-800">
              <span>= Gross Guest Turnover:</span>
              <span>${fin.grossGuestTurnover.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 text-rose-300/90 pt-2">
              <span>- Airbnb Host Fee ({profile.airbnbHostServiceFeePct}%):</span>
              <span>-${fin.airbnbPlatformFee.toFixed(0)}</span>
            </div>
            <div className="flex justify-between py-1 text-rose-300/90">
              <span>- Cleaner Paid ({fin.totalReservationsCount} × ${profile.cleaningCostPaidPerStay}):</span>
              <span>-${fin.cleaningServiceExpenses.toLocaleString()}</span>
            </div>

            {/* Crucial Cleaning Deficit Callout */}
            <div className="py-1 px-2 rounded bg-rose-950/40 border border-rose-900/50 flex justify-between text-[11px] text-rose-300">
              <span>⚠ Net Cleaning Deficit (Collected - Paid):</span>
              <span className="font-bold">-${Math.abs(fin.netCleaningMargin)}</span>
            </div>

            <div className="flex justify-between py-1 text-rose-300/90">
              <span>- Incremental Utilities ($45/mo):</span>
              <span>-${fin.annualIncrementalUtilities}</span>
            </div>
            <div className="flex justify-between py-1 text-rose-300/90">
              <span>- Guest Supplies ($35/mo):</span>
              <span>-${fin.annualSupplies}</span>
            </div>
            <div className="flex justify-between py-1 text-rose-300/90">
              <span>- Insurance STR Endorsement ($25/mo):</span>
              <span>-${fin.annualInsurance}</span>
            </div>
            <div className="flex justify-between py-1 text-rose-300/90">
              <span>- Maintenance Reserve:</span>
              <span>-${fin.annualMaintenance}</span>
            </div>

            <div className="flex justify-between py-2 bg-emerald-950/40 px-2 rounded font-bold text-emerald-400 border border-emerald-800/40 text-sm">
              <span>= Net Operating Cash Flow:</span>
              <span>${fin.netOperatingCashFlow.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 text-slate-400 pt-2 border-t border-slate-800">
              <span>- Furnishing Setup Amortization ($1500 / 2 yr):</span>
              <span>-${fin.annualSetupAmortization}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400">
              <span>- Estimated Income Tax Liability ({profile.homeownerTaxRateIncomePct}%):</span>
              <span>-${Math.round(fin.estimatedIncomeTaxLiability).toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-2 bg-amber-950/40 px-2 rounded font-bold text-amber-300 border border-amber-800/40 text-sm">
              <span>= True Economic Profit:</span>
              <span>${Math.round(fin.economicProfitAfterSetupAndTax).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Economic Labor & Break-Even Analysis */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3">
              Labor & Personal Free-Time Evaluation
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between items-center">
                <span>Total Host Labor Hours:</span>
                <span className="font-mono font-bold text-white">{fin.totalHostLaborHoursPerYear} hours / yr</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Maya&apos;s Time Opportunity Cost ($35/hr):</span>
                <span className="font-mono text-rose-300">-${fin.valueHostTimeImputed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="font-semibold text-amber-300">Economic Surplus After Personal Labor:</span>
                <span className="font-mono font-bold text-amber-300">
                  ${Math.round(fin.trueEconomicSurplusAfterLabor).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center bg-indigo-950/40 p-2 rounded border border-indigo-800/40 mt-2">
                <span className="text-indigo-200 font-medium">Effective Hourly Return on Effort:</span>
                <span className="text-base font-black text-indigo-300 font-mono">
                  ${fin.effectiveHourlyWageEarned.toFixed(2)} / hr
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3">
              Break-Even & Margin of Safety
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Break-Even Booked Nights</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {fin.breakEvenBookedNights} Nights
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  to cover all fixed expenses
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Break-Even Occupancy</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {fin.breakEvenOccupancyPct}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Safe buffer of {(profile.expectedOccupancyRate * 100 - fin.breakEvenOccupancyPct).toFixed(1)}%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              Maya only needs to achieve <strong>13.8% occupancy (33 booked nights)</strong> to cover all incremental hosting costs, utilities, insurance, maintenance, and furnish amortizations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
