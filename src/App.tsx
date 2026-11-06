import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  HelpCircle,
  Video,
  Award,
  Layers,
  Activity,
  Sliders,
  DollarSign,
  Download,
  Info
} from 'lucide-react';
import { MAYA_PETWORTH_BASE_CASE, HomeownerProfile } from './utils/calculator';
import { GuidedDemoBar, DEMO_TIMELINE } from './components/GuidedDemoBar';
import { LegalEligibilitySection } from './components/LegalEligibilitySection';
import { MarketExplorerSection } from './components/MarketExplorerSection';
import { FinancialDashboardSection } from './components/FinancialDashboardSection';
import { StressSimulatorSection } from './components/StressSimulatorSection';
import { DecisionDashboardSection } from './components/DecisionDashboardSection';
import { SubmissionPackageModal } from './components/SubmissionPackageModal';

export default function App() {
  const [profile, setProfile] = useState<HomeownerProfile>(MAYA_PETWORTH_BASE_CASE);
  const [activeTab, setActiveTab] = useState<'overview' | 'legal' | 'market' | 'financials' | 'stress' | 'recommendation'>('overview');
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [currentDemoStepIndex, setCurrentDemoStepIndex] = useState<number>(0);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState<boolean>(false);

  // Profile update handler
  const handleUpdateProfile = (updates: Partial<HomeownerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  // Restore Maya Chen baseline
  const handleResetToBaseline = () => {
    setProfile(MAYA_PETWORTH_BASE_CASE);
  };

  // Start guided demo
  const handleStartDemo = () => {
    setIsDemoActive(true);
    setCurrentDemoStepIndex(0);
    handleResetToBaseline();
    setActiveTab('overview');
  };

  // Exit demo
  const handleExitDemo = () => {
    setIsDemoActive(false);
  };

  // Next / Prev demo step
  const handleNextDemoStep = () => {
    if (currentDemoStepIndex < DEMO_TIMELINE.length - 1) {
      const nextIndex = currentDemoStepIndex + 1;
      setCurrentDemoStepIndex(nextIndex);
      syncTabWithDemoStep(nextIndex);
    } else {
      setIsDemoActive(false);
    }
  };

  const handlePrevDemoStep = () => {
    if (currentDemoStepIndex > 0) {
      const prevIndex = currentDemoStepIndex - 1;
      setCurrentDemoStepIndex(prevIndex);
      syncTabWithDemoStep(prevIndex);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentDemoStepIndex(index);
    syncTabWithDemoStep(index);
  };

  const syncTabWithDemoStep = (index: number) => {
    const step = DEMO_TIMELINE[index];
    if (!step) return;
    if (step.focusSection === 'intro' || step.focusSection === 'profile') {
      setActiveTab('overview');
    } else if (step.focusSection === 'compliance') {
      setActiveTab('legal');
    } else if (step.focusSection === 'market') {
      setActiveTab('market');
    } else if (step.focusSection === 'financials') {
      setActiveTab('financials');
    } else if (step.focusSection === 'stress') {
      setActiveTab('stress');
    } else if (step.focusSection === 'recommendation') {
      setActiveTab('recommendation');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* MBA Guided Demo Controller Banner */}
      <GuidedDemoBar
        isDemoActive={isDemoActive}
        currentStepIndex={currentDemoStepIndex}
        onStartDemo={handleStartDemo}
        onExitDemo={handleExitDemo}
        onNextStep={handleNextDemoStep}
        onPrevStep={handlePrevDemoStep}
        onJumpToStep={handleJumpToStep}
        onResetToBaseline={handleResetToBaseline}
      />

      {/* Main Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              SW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                  StayWise DC
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                  Inside Airbnb DC (Sep 2026)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Washington, DC Short-Term Rental Decision & Net Profit System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              id="open-submission-modal-btn"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">2-Page Report & Deliverables</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>

        {/* Primary View Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto text-xs font-medium border-t border-slate-800/60 pt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Overview & Maya&apos;s Case
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'legal'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            DC Legal Eligibility
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'market'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Market Comps (39 Neighborhoods)
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'financials'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Revenue & Profit Calculator
          </button>
          <button
            onClick={() => setActiveTab('stress')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'stress'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            What-If Simulator
          </button>
          <button
            onClick={() => setActiveTab('recommendation')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'recommendation'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Decision Scorecard
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Tab 1: Overview & Maya Case Profile */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Landing Hero */}
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="max-w-3xl space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Evidence-Based Decision Support for District Property Owners
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Should a Washington, DC Homeowner List on Airbnb?
                </h2>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Moving DC residents from vague guesses about advertised Airbnb nightly rates to an explainable, legally compliant, financially realistic decision.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('financials')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs md:text-sm shadow-md transition"
                  >
                    Explore Profit Waterfall
                  </button>
                  <button
                    onClick={() => setIsSubmissionModalOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-lg text-xs md:text-sm border border-slate-700 transition"
                  >
                    View Academic Report & Deliverables
                  </button>
                </div>
              </div>
            </div>

            {/* Maya Chen Primary Case Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                    M
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Primary Demo Case: Maya Chen&apos;s Petworth Rowhouse
                    </h3>
                    <p className="text-xs text-slate-400">
                      Fictional owner-occupant in Petworth, Washington, DC • Hosted Spare Bedroom
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Qualifies for DC Hosted License
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 uppercase text-[10px] block font-medium">Homeowner Goal</span>
                  <p className="text-slate-200 mt-1 font-medium">
                    Generate supplemental monthly cash flow to offset rising property taxes and living expenses without giving up her home.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 uppercase text-[10px] block font-medium">Hosting Strategy</span>
                  <p className="text-slate-200 mt-1 font-medium">
                    Rent 1 furnished spare bedroom (2 guests max, 3-night avg stay) for up to 240 nights/year while living on-site.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 uppercase text-[10px] block font-medium">Key Concerns</span>
                  <p className="text-slate-200 mt-1 font-medium">
                    Personal privacy in shared spaces, cleaner turnover quality, wear and tear, and time spent on guest management.
                  </p>
                </div>
              </div>

              {/* 10 Demonstration Questions Answered */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  10 Key Decision Questions Addressed by StayWise DC:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="space-y-1.5">
                    <p>1. <strong>Is Maya eligible?</strong> Yes, under DC Hosted STR rules (Homestead primary residence).</p>
                    <p>2. <strong>Comparable listing rates?</strong> Petworth median asking rate is $155; Maya tests $125.</p>
                    <p>3. <strong>What rate should she test?</strong> $125/night to secure high booking momentum.</p>
                    <p>4. <strong>Earnings at 50% occupancy?</strong> $16,600 gross turnover ($15,000 nightly + $1,600 cleaning).</p>
                    <p>5. <strong>What does she actually keep?</strong> $12,242 net cash flow; $9,521 economic profit after taxes.</p>
                  </div>
                  <div className="space-y-1.5">
                    <p>6. <strong>If demand drops 25%?</strong> Profit drops to $6,974; still well above her 33-night break-even.</p>
                    <p>7. <strong>Work required?</strong> 100 hours per year (2.5 hours per stay across 40 stays).</p>
                    <p>8. <strong>Is it worth the privacy loss?</strong> Yes: effectively $95.21/hour, surpassing her $35/hour threshold.</p>
                    <p>9. <strong>What to do before listing?</strong> Complete DLCP BBL registration ($104.50) and insurance rider.</p>
                    <p>10. <strong>Final verdict?</strong> Proceed with a 90-day pilot before investing further capital.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('legal')}
                className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-xl text-left transition"
              >
                <ShieldCheck className="w-5 h-5 text-indigo-400 mb-2" />
                <h4 className="text-sm font-bold text-white">DC Legal Rules</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Examine the DLCP 90-night limit, Homestead deduction checks, and fine structures.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('market')}
                className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-xl text-left transition"
              >
                <MapPin className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Inside Airbnb Comps</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Browse real data across 39 DC neighborhood groups from the September 2026 snapshot.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('stress')}
                className="p-4 bg-slate-900 border border-slate-800 hover:border-rose-500 rounded-xl text-left transition"
              >
                <Activity className="w-5 h-5 text-rose-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Demand Stress Test</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Simulate -25% occupancy and evaluate break-even resilience.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: DC Legal Eligibility */}
        {activeTab === 'legal' && (
          <LegalEligibilitySection profile={profile} onChangeProfile={handleUpdateProfile} />
        )}

        {/* Tab 3: Inside Airbnb Market Explorer */}
        {activeTab === 'market' && (
          <MarketExplorerSection
            profile={profile}
            onSelectNeighborhood={(neighborhood, medianPrice) => {
              handleUpdateProfile({
                neighborhood,
                nightlyPrice: Math.round(medianPrice * 0.8), // Competitive 20% discount for private room
              });
            }}
          />
        )}

        {/* Tab 4: Financial Waterfall & Profit Engine */}
        {activeTab === 'financials' && (
          <FinancialDashboardSection profile={profile} onChangeProfile={handleUpdateProfile} />
        )}

        {/* Tab 5: What-If Risk Simulator */}
        {activeTab === 'stress' && (
          <StressSimulatorSection profile={profile} onChangeProfile={handleUpdateProfile} />
        )}

        {/* Tab 6: Decision Scorecard */}
        {activeTab === 'recommendation' && (
          <DecisionDashboardSection
            profile={profile}
            onOpenReportModal={() => setIsSubmissionModalOpen(true)}
          />
        )}
      </main>

      {/* Submission Support Package & 2-Page PDF Modal */}
      <SubmissionPackageModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
      />

      {/* Clean Academic Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>StayWise DC • Decision Analytics for Washington, DC Homeowners</span>
          <span>Data Source: Inside Airbnb DC Snapshot (Sep 19, 2026) • DC Law 22-307</span>
          <button
            onClick={() => setIsSubmissionModalOpen(true)}
            className="text-indigo-400 hover:underline"
          >
            Academic Submission Package
          </button>
        </div>
      </footer>
    </div>
  );
}
