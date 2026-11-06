import React from 'react';
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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface DemoStep {
  id: number;
  timecode: string;
  title: string;
  headline: string;
  presenterScript: string;
  focusSection: 'intro' | 'profile' | 'compliance' | 'market' | 'financials' | 'stress' | 'recommendation';
  keyStatLabel: string;
  keyStatValue: string;
  keyStatNote: string;
  actionHint: string;
}

export const DEMO_TIMELINE: DemoStep[] = [
  {
    id: 1,
    timecode: "0:00–0:20",
    title: "The Problem",
    headline: "The Airbnb Reality Gap in Washington, DC",
    presenterScript:
      "Many DC homeowners see advertised Airbnb nightly prices and assume hosting a spare bedroom or basement will be automatically profitable. But the real questions are: Can they legally host in DC? How much money do they actually keep after cleaning, platform fees, taxes, and startup costs? And is the loss of personal time worthwhile?",
    focusSection: "intro",
    keyStatLabel: "Advertised DC Mean Rate",
    keyStatValue: "$317.45",
    keyStatNote: "Gross advertised asking price across 6,906 Inside Airbnb listings (Sep 2026)",
    actionHint: "Notice how advertised listing prices obscure host expenses and legal hurdles."
  },
  {
    id: 2,
    timecode: "0:20–0:45",
    title: "Sample Homeowner",
    headline: "Meet Maya: Petworth Rowhouse Spare Room",
    presenterScript:
      "Here is Maya Chen, an owner-occupant in Petworth, DC. She lives in her rowhouse as her primary residence and wants to rent out one furnished spare bedroom for up to 240 nights a year while continuing to live in the home. Her goal is to generate extra income to offset rising property taxes and household expenses.",
    focusSection: "profile",
    keyStatLabel: "Target Hosting Scope",
    keyStatValue: "Hosted Spare Bedroom",
    keyStatNote: "Primary residence owner-occupant, 2 guests max, 240 nights available",
    actionHint: "The app immediately tailors legal rules and market comps to Maya's exact scenario."
  },
  {
    id: 3,
    timecode: "0:45–1:10",
    title: "Legal & Market Comps",
    headline: "DLCP Short-Term Rental Act & Inside Airbnb Comps",
    presenterScript:
      "First, legal compliance: Because Maya lives on-site during guest stays, she qualifies for a DC Hosted Short-Term Rental License, granting an exemption from DC's strict 90-night annual unhosted limit. Second, market comps: In Petworth, median advertised nightly price is $155 across 365 listings. Testing a conservative $125/night for a private room gives her competitive pricing power.",
    focusSection: "compliance",
    keyStatLabel: "Legal Classification",
    keyStatValue: "Hosted (Unlimited)",
    keyStatNote: "Primary residence confirmed; exempt from the DC 90-night unhosted cap",
    actionHint: "Notice how unhosted vacation rentals are strictly capped at 90 nights under DC Law Title 47."
  },
  {
    id: 4,
    timecode: "1:10–1:40",
    title: "Financial Analysis",
    headline: "From $16,600 Turnover to Real Net Cash Flow",
    presenterScript:
      "Now look at the financial engine. At 50% occupancy (120 booked nights), Maya generates $15,000 in nightly room revenue plus $1,600 in guest cleaning charges, totaling $16,600 turnover. But look at operating costs: Airbnb's 3% fee takes $498. Paying cleaners $55 while charging guests $40 creates an immediate $600 annual cleaning deficit! Utilities, supplies, maintenance, and insurance take another $1,660. Net operating cash flow is $12,242, and economic profit after $750 setup amortization and $1,971 income tax is $9,521.",
    focusSection: "financials",
    keyStatLabel: "Economic Net Profit",
    keyStatValue: "$9,521 / yr",
    keyStatNote: "$793/month true profit after setup amortization and income taxes",
    actionHint: "Use the interactive nightly rate slider to see revenue, costs, and profit update dynamically."
  },
  {
    id: 5,
    timecode: "1:40–2:05",
    title: "Risk & Demand Stress Test",
    headline: "What If Demand Falls 25%?",
    presenterScript:
      "What happens if tourism drops or competition increases? In one click, we run a stress test: If occupancy drops by 25% (down to 37.5%, or 90 booked nights), gross turnover drops to $12,450. Because fixed maintenance, insurance, and utilities remain constant, her net cash flow drops to $8,995 and true economic profit drops to $6,974. Even under severe stress, Maya remains comfortably above her 33-night break-even threshold.",
    focusSection: "stress",
    keyStatLabel: "Break-Even Occupancy",
    keyStatValue: "13.8% (33 nights)",
    keyStatNote: "Low fixed overhead ensures high resilience even during demand contractions",
    actionHint: "Click the 25% demand drop stress test to simulate a downturn."
  },
  {
    id: 6,
    timecode: "2:05–2:30",
    title: "Recommendation & Decision",
    headline: "Holistic Host Decision: Economic & Lifestyle Scorecard",
    presenterScript:
      "StayWise DC delivers a clear recommendation: PROCEED WITH CAUTION. Financially, $9,521 net income strongly exceeds long-term room rental alternatives. Economically, she earns an effective $95.21 per hour for 100 hours of hosting labor. But her primary hurdle is lifestyle: sharing her living room and kitchen 120 nights a year. The app advises testing a 90-day pilot before investing more in furnishings.",
    focusSection: "recommendation",
    keyStatLabel: "Effective Hourly Wage",
    keyStatValue: "$95.21 / hr",
    keyStatNote: "100 hours annual labor ($9,521 profit / 100 hrs); exceeds $35/hr opportunity cost",
    actionHint: "Look at the final scorecard comparing financial gains with lifestyle impact."
  },
  {
    id: 7,
    timecode: "2:30–2:45",
    title: "Close & Summary",
    headline: "Transforming Guesses into Actionable Decisions",
    presenterScript:
      "In under 3 minutes, StayWise DC transformed an overwhelming, legally ambiguous decision into a transparent, data-grounded evaluation. Rather than merely estimating Airbnb gross revenue, StayWise DC helps Washington, DC homeowners make legally secure, financially realistic choices.",
    focusSection: "intro",
    keyStatLabel: "Submission Deliverables",
    keyStatValue: "Ready for Zoom & PDF",
    keyStatNote: "100% compliant with Deliverables A, B, and C requirements",
    actionHint: "Guided demo completed. Presenters can exit demo mode anytime."
  }
];

interface GuidedDemoBarProps {
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
  isDemoActive,
  currentStepIndex,
  onStartDemo,
  onExitDemo,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onResetToBaseline,
}) => {
  const currentStep = DEMO_TIMELINE[currentStepIndex] || DEMO_TIMELINE[0];

  const handleNext = () => {
    if (currentStepIndex === DEMO_TIMELINE.length - 2) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
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
                Primary Case: <strong className="text-white font-medium">Maya&apos;s Petworth Spare Bedroom</strong> (2–3 Min Zoom Presentation Ready)
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
            Step {currentStep.id} of {DEMO_TIMELINE.length}: {currentStep.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {DEMO_TIMELINE.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => onJumpToStep(idx)}
                className={`w-6 h-6 rounded-full text-[11px] font-bold transition-all ${
                  idx === currentStepIndex
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    : idx < currentStepIndex
                    ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
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
            <span className="text-slate-500 text-[10px]">({currentStep.timecode})</span>
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
              {currentStepIndex + 1} / {DEMO_TIMELINE.length}
            </span>

            {currentStepIndex < DEMO_TIMELINE.length - 1 ? (
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
