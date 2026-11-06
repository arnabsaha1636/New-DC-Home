import React from 'react';
import {
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Heart,
  Shield,
  ThumbsUp,
  ArrowRight,
  ListOrdered
} from 'lucide-react';
import { HomeownerProfile, FinancialBreakdown, calculateHostingFinancials, evaluateDcLegalCompliance } from '../utils/calculator';

interface DecisionDashboardProps {
  profile: HomeownerProfile;
  onOpenReportModal: () => void;
}

export const DecisionDashboardSection: React.FC<DecisionDashboardProps> = ({
  profile,
  onOpenReportModal,
}) => {
  const fin = calculateHostingFinancials(profile);
  const legal = evaluateDcLegalCompliance(profile);

  // Decision Scorecard Weights
  const financialScore = Math.min(100, Math.round((fin.economicProfitAfterSetupAndTax / 10000) * 100));
  const legalScore = legal.isEligible ? (legal.licenseCategory === 'Hosted License' ? 95 : 80) : 0;
  const breakEvenScore = Math.max(0, Math.min(100, Math.round((1 - fin.breakEvenOccupancyPct / 50) * 100)));
  const lifestyleFrictionScore = Math.max(0, Math.round(100 - (fin.actualBookedNightsProjected / 240) * 80));

  const compositeScore = Math.round(
    financialScore * 0.35 +
    legalScore * 0.30 +
    breakEvenScore * 0.20 +
    lifestyleFrictionScore * 0.15
  );

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Personalized Hosting Recommendation & Scorecard
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesizing regulatory readiness, financial yield, safety margins, and owner lifestyle friction
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow transition"
        >
          View Full Submission Package
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Verdict Card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/60 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
              Final Recommendation: PROCEED WITH CAUTION (PILOT)
            </span>
            <span className="text-xs text-slate-400 font-mono">Index Score: {compositeScore}/100</span>
          </div>
          <h3 className="text-base md:text-lg font-bold text-white">
            Maya Chen Should Test a 90-Day Hosted Pilot in Petworth
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Financially, hosting generates <strong>${Math.round(fin.economicProfitAfterSetupAndTax).toLocaleString()} in net profit</strong> after taxes and furnishing amortization ($793/month), yielding an effective <strong>${fin.effectiveHourlyWageEarned.toFixed(2)}/hour</strong> for Maya&apos;s personal time. Her 13.8% break-even occupancy provides a strong buffer against travel downturns.
          </p>
        </div>

        <div className="text-center bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0 w-full md:w-auto">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            Net Monthly Extra Income
          </span>
          <span className="text-2xl font-black text-amber-300 font-mono block mt-0.5">
            +${Math.round(fin.economicProfitAfterSetupAndTax / 12).toLocaleString()} / mo
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">
            vs $0 baseline spare room
          </span>
        </div>
      </div>

      {/* 4 Multi-Dimensional Decision Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Legal Readiness
            </span>
            <span className="font-mono text-slate-400">95%</span>
          </div>
          <p className="text-slate-300">
            Qualifies for hosted license. Homestead confirmed. Exempt from 90-night cap. Must obtain BBL endorsement ($104.50).
          </p>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Financial Attractiveness
            </span>
            <span className="font-mono text-slate-400">88%</span>
          </div>
          <p className="text-slate-300">
            $9,521 economic profit after $750 setup amort and taxes. Substantially outperforms long-term room sublets.
          </p>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-indigo-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Labor & Effort Return
            </span>
            <span className="font-mono text-slate-400">82%</span>
          </div>
          <p className="text-slate-300">
            Maya earns an effective $95.21/hour across 100 hosting hours per year, nearly triple her $35/hour opportunity cost.
          </p>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> Lifestyle Friction
            </span>
            <span className="font-mono text-slate-400">Moderate</span>
          </div>
          <p className="text-slate-300">
            Sharing common areas 120 nights/yr. Key mitigation: minimum 3-night stay rule eliminates high-turnover churn.
          </p>
        </div>
      </div>

      {/* Action Roadmap for Maya Before Listing */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        <h4 className="font-bold text-slate-200 text-xs md:text-sm mb-3 flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-amber-400" />
          Recommended 5-Step Action Roadmap for Maya Before Publishing
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 block mb-1">STEP 1</span>
            <h5 className="font-bold text-white mb-1">Verify Homestead</h5>
            <p className="text-slate-400 text-[11px]">
              Confirm property Homestead tax deduction is active on DC OTR portal.
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 block mb-1">STEP 2</span>
            <h5 className="font-bold text-white mb-1">Apply for DLCP BBL</h5>
            <p className="text-slate-400 text-[11px]">
              Submit Basic Business License application with Short-Term Rental endorsement ($104.50).
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 block mb-1">STEP 3</span>
            <h5 className="font-bold text-white mb-1">Insurance STR Rider</h5>
            <p className="text-slate-400 text-[11px]">
              Add commercial hosting endorsement to homeowner insurance policy ($25/mo).
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 block mb-1">STEP 4</span>
            <h5 className="font-bold text-white mb-1">Setup Room ($1,500)</h5>
            <p className="text-slate-400 text-[11px]">
              Install keypad lock, smoke/CO detectors, hotel-grade mattress, and dedicated workspace.
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 block mb-1">STEP 5</span>
            <h5 className="font-bold text-white mb-1">Launch 90-Day Pilot</h5>
            <p className="text-slate-400 text-[11px]">
              List at $125/night with 3-night minimum. Evaluate privacy impact after 10 reservations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
