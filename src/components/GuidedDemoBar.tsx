import React from "react";
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Clock,
  DollarSign,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  HomeownerProfile,
  MAYA_PETWORTH_BASE_CASE,
  calculateHostingFinancials,
  evaluateDcLegalCompliance,
  applyStressScenario,
  hostingDecision,
  money,
  displayNumber,
} from "../utils/calculator";
import { DC_CITY_SUMMARY, profileComparables } from "../data/dcMarketData";

export interface DemoStep {
  id: number;
  timecode: string;
  title: string;
  headline: string;
  presenterScript: string;
  focusSection:
    | "intro"
    | "profile"
    | "compliance"
    | "market"
    | "financials"
    | "stress"
    | "recommendation";
  keyStatLabel: string;
  keyStatValue: string;
  keyStatNote: string;
  actionHint: string;
}

export function buildDemoTimeline(profile: HomeownerProfile): DemoStep[] {
  const fin = calculateHostingFinancials(profile),
    legal = evaluateDcLegalCompliance(profile),
    comps = profileComparables(profile),
    stress = calculateHostingFinancials(
      applyStressScenario(profile, "demand_drop_25"),
    ),
    decision = hostingDecision(profile);
  const step = (
    id: number,
    timecode: string,
    title: string,
    focusSection: DemoStep["focusSection"],
    presenterScript: string,
    keyStatLabel: string,
    keyStatValue: string,
    keyStatNote: string,
  ): DemoStep => ({
    id,
    timecode,
    title,
    headline: title,
    focusSection,
    presenterScript,
    keyStatLabel,
    keyStatValue,
    keyStatNote,
    actionHint:
      "Review the current assumptions and calculated results on this tab.",
  });
  return [
    step(
      1,
      "0:00–0:20",
      "The Problem",
      "intro",
      "Advertised nightly prices do not show what a homeowner keeps. StayWise DC combines asking-price comparisons, legal screening, costs, taxes and host labor.",
      "City median asking price",
      money(DC_CITY_SUMMARY.medianAdvertisedPrice!),
      "Historical asking prices; no realized occupancy is inferred.",
    ),
    step(
      2,
      "0:20–0:45",
      "Sample Homeowner",
      "profile",
      profile.name +
        " models " +
        profile.rentalScope.replaceAll("_", " ") +
        " in " +
        profile.neighborhood +
        ", offering " +
        profile.annualAvailableNights +
        " nights at " +
        money(profile.nightlyPrice) +
        " with " +
        (profile.expectedOccupancyRate * 100).toFixed(1) +
        "% assumed occupancy.",
      "Modeled booked nights",
      String(fin.actualBookedNightsProjected),
      "This is a projection, not observed bookings.",
    ),
    step(
      3,
      "0:45–1:10",
      "Legal & Market Comps",
      "compliance",
      "Screening classification: " +
        legal.licenseCategory +
        ". " +
        legal.capReason +
        " Matching " +
        comps.roomType +
        " comparisons have " +
        comps.pricedListings +
        " valid prices and a median of " +
        (comps.medianAdvertisedPrice === null
          ? "no data"
          : money(comps.medianAdvertisedPrice)) +
        ". No residence or license has been independently verified.",
      "Screening",
      legal.licenseCategory,
      "User declarations require independent DLCP verification.",
    ),
    step(
      4,
      "1:10–1:40",
      "Financial Analysis",
      "financials",
      fin.actualBookedNightsProjected +
        " booked nights produce " +
        money(fin.grossNightlyRevenue) +
        " lodging revenue plus " +
        money(fin.cleaningFeesCollected) +
        " cleaning receipts, or " +
        money(fin.grossGuestTurnover) +
        " turnover. Cash operating costs are " +
        money(fin.totalCashOperatingCosts) +
        ". Pre-tax cash flow is " +
        money(fin.netOperatingCashFlow) +
        ". After " +
        money(fin.annualSetupAmortization) +
        " setup amortization and " +
        money(fin.estimatedIncomeTaxLiability) +
        " modeled tax, profit is " +
        money(fin.economicProfitAfterSetupAndTax) +
        ", before valuing host labor.",
      "Profit after setup & tax",
      money(fin.economicProfitAfterSetupAndTax),
      "Modeled tax and amortization assumptions are editable.",
    ),
    step(
      5,
      "1:40–2:05",
      "Risk & Demand Stress Test",
      "stress",
      "A relative 25% demand reduction gives " +
        stress.actualBookedNightsProjected +
        " projected nights, " +
        money(stress.netOperatingCashFlow) +
        " pre-tax cash flow and " +
        money(stress.economicProfitAfterSetupAndTax) +
        " profit after setup and modeled tax. Baseline operating-cost break-even is " +
        displayNumber(fin.breakEvenBookedNights) +
        " nights.",
      "Break-even",
      displayNumber(fin.breakEvenBookedNights) + " nights",
      "Average contribution method; excludes income tax and imputed labor.",
    ),
    step(
      6,
      "2:05–2:30",
      "Recommendation & Decision",
      "recommendation",
      "Recommendation: " +
        decision.verdict +
        ". " +
        decision.reason +
        " Profit before labor is " +
        money(fin.economicProfitAfterSetupAndTax) +
        ", over " +
        displayNumber(fin.totalHostLaborHoursPerYear) +
        " hours. Effective hourly return is " +
        money(fin.effectiveHourlyWageEarned) +
        ". Surplus after imputed labor is " +
        money(fin.trueEconomicSurplusAfterLabor) +
        ".",
      "Recommendation",
      decision.verdict,
      "No long-term rental comparison is assumed.",
    ),
    step(
      7,
      "2:30–2:45",
      "Close & Summary",
      "intro",
      "Review assumptions, compare matching listings and complete the legal verification checklist. Copy or print the current report; add the public app and Zoom links only after verifying them.",
      "Deliverables",
      "Review and record",
      "Public URL and recording remain unverified placeholders.",
    ),
  ];
}
export const DEMO_TIMELINE = buildDemoTimeline(MAYA_PETWORTH_BASE_CASE);

interface GuidedDemoBarProps {
  profile: HomeownerProfile;
  isDemoActive: boolean;
  currentStepIndex: number;
  onStartDemo: () => void;
  onExitDemo: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (index: number) => void;
  onResetToBaseline: () => void;
}

export const GuidedDemoBar: React.FC<GuidedDemoBarProps> = ({
  profile,
  isDemoActive,
  currentStepIndex,
  onStartDemo,
  onExitDemo,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onResetToBaseline,
}) => {
  const timeline = buildDemoTimeline(profile);
  const currentStep = timeline[currentStepIndex] || timeline[0];

  const handleNext = () => {
    if (currentStepIndex === timeline.length - 2) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
    onNextStep();
  };

  if (!isDemoActive) {
    return (
      <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-indigo-950 border-b border-amber-500/30 text-white px-4 py-2.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                MBA Assignment Mode
              </span>
              <p className="text-xs md:text-sm text-slate-200">
                Primary Case:{" "}
                <strong className="text-white font-medium">
                  Maya&apos;s Petworth Spare Bedroom
                </strong>{" "}
                (2–3 Min Zoom Presentation Ready)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetToBaseline}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Restore standard illustrative assumptions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Baseline
            </button>
            <button
              onClick={onStartDemo}
              id="start-guided-demo-btn"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-4 py-1.5 rounded-md text-xs md:text-sm shadow-md hover:shadow-amber-500/25 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Guided Demo (2:45 Walkthrough)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b-2 border-amber-500 text-white shadow-2xl transition-all">
      {/* Top status bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold tracking-wide uppercase border border-amber-500/30">
            Guided Demo Mode Active
          </span>
          <span className="text-slate-400 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {currentStep.timecode}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-medium">
            Step {currentStep.id} of {timeline.length}: {currentStep.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {timeline.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => onJumpToStep(idx)}
                className={`w-6 h-6 rounded-full text-[11px] font-bold transition-all ${
                  idx === currentStepIndex
                    ? "bg-amber-500 text-slate-950 ring-2 ring-amber-300"
                    : idx < currentStepIndex
                      ? "bg-emerald-700 text-white hover:bg-emerald-600"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
                title={`${step.timecode} - ${step.title}`}
              >
                {step.id}
              </button>
            ))}
          </div>

          <button
            onClick={onExitDemo}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition-colors ml-2"
            title="Exit guided presentation mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main script and metric prompt */}
      <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wide">
              Presenter Script
            </span>
            <span className="text-slate-500 text-[10px]">
              ({currentStep.timecode})
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-sans bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            &ldquo;{currentStep.presenterScript}&rdquo;
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-2 bg-gradient-to-br from-slate-900 to-indigo-950/70 p-2.5 rounded-lg border border-indigo-900/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              {currentStep.keyStatLabel}
            </span>
            <span className="text-sm md:text-base font-extrabold text-amber-300 font-mono">
              {currentStep.keyStatValue}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            {currentStep.keyStatNote}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <button
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              {currentStepIndex + 1} / {timeline.length}
            </span>

            {currentStepIndex < timeline.length - 1 ? (
              <button
                onClick={handleNext}
                className="text-xs px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold flex items-center gap-1 shadow"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onExitDemo}
                className="text-xs px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 shadow"
              >
                Complete <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
