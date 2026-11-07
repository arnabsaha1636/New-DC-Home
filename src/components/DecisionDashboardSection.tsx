import React from "react";
import { Award, ArrowRight } from "lucide-react";
import {
  HomeownerProfile,
  calculateHostingFinancials,
  evaluateDcLegalCompliance,
  hostingDecision,
  money,
  displayNumber,
} from "../utils/calculator";
export const DecisionDashboardSection: React.FC<{
  profile: HomeownerProfile;
  onOpenReportModal: () => void;
}> = ({ profile, onOpenReportModal }) => {
  const fin = calculateHostingFinancials(profile),
    legal = evaluateDcLegalCompliance(profile),
    decision = hostingDecision(profile);
  const color =
    decision.verdict === "STOP"
      ? "border-red-500"
      : decision.verdict === "RECONSIDER"
        ? "border-orange-500"
        : "border-emerald-500";
  const pillars = [
    [
      "Legal screening",
      `${decision.legalScore}/100`,
      `${legal.licenseCategory}. User declarations only; licensing and residence remain unverified.`,
    ],
    [
      "Financial attractiveness",
      `${decision.financialScore}/100`,
      `${money(fin.economicProfitAfterSetupAndTax)} after setup amortization and modeled income tax.`,
    ],
    [
      "Labor return",
      `${decision.laborScore}/100`,
      `${money(fin.effectiveHourlyWageEarned)}/hour over ${displayNumber(fin.totalHostLaborHoursPerYear)} hours. Opportunity cost: ${money(profile.ownerOpportunityCostHourlyRate)}/hour.`,
    ],
    [
      "Lifestyle capacity",
      `${decision.lifestyleScore}/100`,
      `${fin.actualBookedNightsProjected} modeled guest nights per year; discuss privacy and hosting burden.`,
    ],
  ];
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap justify-between gap-3 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex gap-2">
          <Award className="text-amber-400" />
          Personalized Hosting Recommendation & Scorecard
        </h2>
        <button
          className="bg-indigo-600 text-xs p-2 rounded flex gap-2"
          onClick={onOpenReportModal}
        >
          View Full Submission Package
          <ArrowRight size={14} />
        </button>
      </div>
      <div
        className={`p-5 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950 border ${color}`}
      >
        <p className="text-xs text-slate-400">
          {profile.name} · {profile.neighborhood}
        </p>
        <h3
          className="text-xl font-bold text-amber-300 mt-2"
          data-testid="recommendation"
        >
          Final Recommendation: {decision.verdict}
        </h3>
        <p className="text-sm mt-3">{decision.reason}</p>
        <p className="text-xs text-slate-400 mt-3">
          Weighted index: {decision.score}/100. Estimated monthly profit before
          valuing labor: {money(fin.economicProfitAfterSetupAndTax / 12)}.
          Annual surplus after imputed labor:{" "}
          {money(fin.trueEconomicSurplusAfterLabor)}.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pillars.map(([label, score, detail]) => (
          <div
            className="bg-slate-950 p-4 border border-slate-800 rounded-lg text-xs"
            key={label}
          >
            <h4 className="font-bold text-amber-300">
              {label}: {score}
            </h4>
            <p className="text-slate-300 mt-3">{detail}</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-950 p-4 rounded-lg text-xs space-y-2">
        <h4 className="font-bold">Transparent decision rules</h4>
        <p>
          STOP: primary residence screening fails. RECONSIDER: no bookings,
          nonpositive profit, bookings below break-even, uncompensated labor, or
          stays outside this short-term model. PILOT: bookings below twice
          break-even, more than 90 guest nights, or an unverified exemption
          declaration. PROCEED: the remaining positive-surplus cases, subject to
          independent legal verification.
        </p>
        <p className="text-slate-400">
          Break-even: {displayNumber(fin.breakEvenBookedNights)} booked nights;{" "}
          {displayNumber(fin.breakEvenOccupancyPct)}% of legally usable
          availability. Score weights: 35% modeled financial return, 30% legal
          screening, 20% break-even occupancy, 15% nights shared. Screening
          scores are model heuristics, not probabilities of approval or success.
        </p>
      </div>
      <div className="bg-slate-950 p-4 rounded-lg text-xs space-y-3">
        <h4 className="font-bold">Action roadmap</h4>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            {legal.isEligible
              ? "Independently confirm primary residence, Homestead eligibility, restrictions and insurance."
              : "Resolve the primary residence eligibility issue before considering a short-term listing."}
          </li>
          <li>
            Confirm the applicable {legal.licenseCategory} requirements with
            DLCP before listing.
          </li>
          <li>
            Review the setup budget of{" "}
            {money(profile.initialFurnishingSetupCost)} and incremental
            insurance of {money(profile.monthlyInsuranceAddon)}/month.
          </li>
          <li>
            Validate asking price {money(profile.nightlyPrice)} and occupancy{" "}
            {(profile.expectedOccupancyRate * 100).toFixed(1)}% using actual
            pilot observations.
          </li>
          <li>
            {decision.verdict === "STOP" || decision.verdict === "RECONSIDER"
              ? "Rework the assumptions and assess alternatives before committing capital."
              : "Track realized receipts, all expenses, host hours and privacy impact during a limited pilot."}
          </li>
        </ol>
        <p className="text-slate-400">
          No long-term rental comparison is modeled here; no claim of
          outperformance is made.
        </p>
      </div>
    </section>
  );
};
