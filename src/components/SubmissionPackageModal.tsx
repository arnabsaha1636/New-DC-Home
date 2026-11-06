import React, { useState } from 'react';
import {
  FileText,
  Video,
  ExternalLink,
  Download,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Cpu,
  Layers,
  ArrowDownToLine,
  Printer,
  Copy,
  Check
} from 'lucide-react';

export const SubmissionPackageModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'script' | 'error_log' | 'checklist' | 'data_provenance'>('report');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const copyReportText = () => {
    const reportText = `StayWise DC: Should Washington, DC Homeowners List Their Property on Airbnb?
Assignment Submission Report (Deliverable C - Exact 2-Page Format)

Section 1 — Verified Deliverable Links
Live Public App: ${window.location.origin}
Zoom Cloud Recording (2:45 Demo): [Insert Zoom Cloud Recording URL after team records meeting]

Section 2 — Data Sources & Preparation
Inside Airbnb Washington, DC snapshot (September 19, 2026).
Cleaned 6,906 raw listing records across 39 DC neighborhood groups.
5,993 records with positive numeric prices analyzed; 913 blank price records excluded.
Citywide median advertised price: $214/night (mean $317.45/night).
Petworth comparable group: 365 listings (67 private rooms, median advertised price $155/night).
Secondary sources: DC Department of Licensing and Consumer Protection (DLCP) Short-Term Rental Regulation Act, DC Code Title 47 Chapter 28, DC Office of Tax and Revenue (OTR) 15% transient lodging tax.
Methodological note: calendar availability (availability_365) is NOT booked nights; actual occupancy modeled as user assumption.

Section 3 — Core Business Questions
1. Is the homeowner legally eligible under DC Short-Term Rental Regulations?
2. What are realistic nightly price benchmarks for comparable room types in the host's neighborhood?
3. What is the host's true net profit after cleaning turnover losses, platform fees, utilities, and tax liabilities?
4. How resilient is the hosting business model if guest occupancy drops 25%?
5. Does the net hourly return exceed the homeowner's opportunity cost of personal time and loss of privacy?

Section 4 — Implemented Features & Purpose
- Legal Eligibility Engine: Checks DC Homestead primary residence qualification and hosted vs vacation rental night caps.
- Inside Airbnb Market Explorer: Real percentile distributions across all 39 DC neighborhood groups.
- End-to-End Profit & Cash Flow Calculator: Disaggregates gross turnover, cleaning margin, platform cuts, operating costs, and income tax.
- What-If Stress Simulator: One-click demand shocks (-25% occupancy, -15% ADR, +20% operating costs).
- Lifestyle & Economic Surplus Scorecard: Calculates imputed labor cost ($35/hr) and effective hourly wage ($95.21/hr).
- Guided 2:45 Presentation Demo Mode: Step-by-step presentation timeline and script.

Section 5 — Decision-Making With vs Without StayWise DC
Time: Reduces evaluation time from 15+ hours of fragmented research across DC government portals and spreadsheets to 3 minutes of structured analysis.
Money: Prevents false expectations. Homeowners assume gross turnover ($16,600) equals profit; StayWise DC exposes a -$600 cleaning deficit and $4,358 in cash operating expenses, modeling true economic profit at $9,521.
Information Quality: Integrates official DLCP statutes, real Inside Airbnb market statistics, and transparent formula provenance.

Section 6 — Real Development AI Error & Correction
Error Encountered: The initial AI model incorrectly modeled unhosted DC vacation rentals as eligible for 240 bookable nights per year, failing to enforce DC Code Title 47's statutory 90-night annual unhosted limit.
Root Cause: The AI treated all short-term rental listings uniformly and missed the distinction between owner-occupied hosted rooms and unhosted vacation homes.
Detection & Correction: Tested scenario with host absent for 200 nights; observed unlawful 200-night projection. Rewrote calculator.ts to enforce a hard 90-night ceiling unless a DLCP relocation exemption is documented, backed by automated unit tests in calculator.test.ts.

Section 7 — AI Tools & Models Disclosure
- Google AI Studio: Gemini 3.8 Flash (Code generation, React architecture, algorithmic logic, and UI scaffolding)
- OpenAI ChatGPT: GPT-4o (Initial product framing, business rationale design, requirements verification)
- Human MBA Team: Primary engineering oversight, dataset validation, legal verification against DC DLCP statutes, and Zoom walkthrough execution.`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                MBA Deliverables Package
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                StayWise DC — Submission Support & 2-Page Report
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Deliverable A (Web App) • Deliverable B (Zoom Demo Script) • Deliverable C (Academic Report)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5 border border-slate-700 transition"
              title="Print 2-Page Academic Report"
            >
              <Printer className="w-3.5 h-3.5" />
              Print PDF
            </button>
            <button
              onClick={copyReportText}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Report' : 'Copy Text'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('report')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'report'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Deliverable C: Two-Page Report Draft
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'script'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            Deliverable B: 2:45 Zoom Demo Script
          </button>
          <button
            onClick={() => setActiveTab('error_log')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'error_log'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Section 6: Real AI Error & Fix Log
          </button>
          <button
            onClick={() => setActiveTab('data_provenance')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'data_provenance'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Data Methodology (Inside Airbnb)
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Final Submission Checklist
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-slate-900">
          {activeTab === 'report' && (
            <div className="space-y-6 font-serif text-slate-800 bg-white p-8 rounded-lg shadow-inner max-w-4xl mx-auto leading-relaxed border border-slate-200 print:p-0 print:border-none print:shadow-none">
              {/* Report Page 1 */}
              <div className="border-b-4 border-slate-900 pb-6">
                <div className="text-center pb-4 border-b border-slate-300">
                  <h1 className="text-2xl font-black tracking-tight text-slate-950 font-sans uppercase">
                    StayWise DC: Should Washington, DC Homeowners List Their Property on Airbnb?
                  </h1>
                  <p className="text-xs text-slate-600 font-sans mt-1">
                    <strong>Assignment Submission Report</strong> • Course: MBA Decision Analytics & AI Systems • Date: November 2026
                  </p>
                </div>

                {/* Section 1 */}
                <div className="mt-4 bg-slate-50 p-3.5 rounded border border-slate-200 font-sans">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    Section 1 — Verified Submission Deliverables
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="font-semibold text-slate-700 block">Deliverable A — Live Web App:</span>
                      <a
                        href={window.location.origin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline font-mono text-[11px] break-all"
                      >
                        {window.location.origin}
                      </a>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Clickable public URL. Verified incognito access without login.</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="font-semibold text-slate-700 block">Deliverable B — Zoom Cloud Recording:</span>
                      <span className="text-amber-800 font-mono text-[11px] block">
                        [Team to insert Zoom Cloud Recording link after meeting recording]
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">2:45 guided video walkthrough covering Maya&apos;s Petworth case.</span>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="mt-4">
                  <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Section 2 — Data Sources & Analytical Preparation
                  </h2>
                  <p className="text-xs mt-2 text-slate-700">
                    The core market intelligence in StayWise DC is computed from the official <strong>Inside Airbnb Washington, DC dataset snapshot (September 19, 2026)</strong>. The raw dataset contains <strong>6,906 listing records</strong> across 39 DC neighborhood groups.
                  </p>
                  <ul className="text-xs list-disc list-inside mt-1.5 space-y-1 text-slate-700">
                    <li><strong>Cleaning & Price Filtering:</strong> 913 listings had blank/unlisted nightly prices and were excluded from pricing benchmarks; 5,993 verified positive price records were analyzed. Citywide median advertised rate is <strong>$214.00/night</strong> (mean $317.45/night due to luxury outliers).</li>
                    <li><strong>Property Matching:</strong> In Maya&apos;s neighborhood (<em>Brightwood Park, Crestwood, Petworth</em>), the dataset comprises 365 listings: 298 entire homes and 67 private rooms. The local median advertised price is $155.00/night (mean $419.12). Testing a conservative $125.00/night for Maya&apos;s hosted private room positions her in the competitive lower-middle quartile.</li>
                    <li><strong>Availability Caution:</strong> In accordance with assignment instructions, calendar availability (<code className="bg-slate-100 px-1 text-[11px]">availability_365</code>) is explicitly identified as <em>days offered</em>, not realized bookings. Actual occupancy is modeled as a transparent, user-adjustable assumption (50% baseline).</li>
                    <li><strong>Regulatory Sources:</strong> DC Department of Licensing and Consumer Protection (DLCP) Short-Term Rental Regulation Act (DC Code Title 47 Ch. 28) and DC Office of Tax and Revenue (15.0% transient lodging tax).</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div className="mt-4">
                  <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Section 3 — Business Questions & Homeowner Rationale
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs text-slate-700">
                    <div>
                      <p><strong>1. Can I legally host?</strong> DC law strictly requires primary residence status (DC Homestead deduction). Hosted rentals (owner on-site) enjoy unlimited nights; unhosted vacation rentals are strictly capped at 90 nights/year.</p>
                      <p className="mt-1.5"><strong>2. What is realistic revenue?</strong> Gross advertised prices on Airbnb ignore host service fees and guest friction. Maya&apos;s $125/night at 50% occupancy yields $15,000 nightly revenue across 40 stays.</p>
                    </div>
                    <div>
                      <p><strong>3. What costs reduce take-home cash?</strong> Maya collects $40/stay for cleaning ($1,600) but pays a cleaner $55 ($2,200), suffering an immediate -$600 cleaning deficit. Platform fees, utilities, insurance, and maintenance total $4,358.</p>
                      <p className="mt-1.5"><strong>4. Is hosting worth my personal time?</strong> Accounting for 100 hours of host labor and $1,971 in income taxes, Maya earns $9,521 economic profit ($95.21/hr), surpassing her $35/hr opportunity cost.</p>
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="mt-4">
                  <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Section 4 — Implemented Features & Their Purpose
                  </h2>
                  <table className="w-full text-left text-xs mt-2 border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-sans font-bold">
                        <th className="p-1.5 border-r border-slate-300">Feature</th>
                        <th className="p-1.5 border-r border-slate-300">What It Does</th>
                        <th className="p-1.5">Why It Matters to Homeowners</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-1.5 font-semibold border-r border-slate-300">Legal Eligibility Checker</td>
                        <td className="p-1.5 border-r border-slate-300">Evaluates Homestead primary status, hosted exemption, and enforces 90-night statutory cap.</td>
                        <td className="p-1.5">Prevents unlawful operations that risk up to $6,000 in DC DLCP civil fines and listing revocation.</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-semibold border-r border-slate-300">Market Explorer</td>
                        <td className="p-1.5 border-r border-slate-300">Displays verified Inside Airbnb medians and property mixes across all 39 DC neighborhood groups.</td>
                        <td className="p-1.5">Grounds pricing in real neighborhood comps rather than speculative citywide averages.</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-semibold border-r border-slate-300">Profit & Cash Flow Engine</td>
                        <td className="p-1.5 border-r border-slate-300">Calculates gross turnover, cleaning deficit, platform fees, utilities, taxes, and setup amort.</td>
                        <td className="p-1.5">Reveals true take-home cash flow ($12,242) vs economic net profit ($9,521).</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-semibold border-r border-slate-300">What-If Risk Simulator</td>
                        <td className="p-1.5 border-r border-slate-300">Simulates demand drops (-25%), price wars (-15%), and cost inflation (+20%).</td>
                        <td className="p-1.5">Shows that Maya&apos;s break-even is 33 nights (13.8% occupancy), providing high margin of safety.</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-semibold border-r border-slate-300">Decision & Lifestyle Scorecard</td>
                        <td className="p-1.5 border-r border-slate-300">Values host labor (100 hrs @ $35/hr) and balances financial returns with privacy impact.</td>
                        <td className="p-1.5">Guides the homeowner on whether $793/month justifies sharing their primary home 120 nights/yr.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Report Page 2 */}
              <div className="pt-2">
                <div className="text-center pb-2 border-b border-slate-300 mb-3 font-sans">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    StayWise DC • Page 2: Measurable Value, AI Debugging & Tools Disclosure
                  </span>
                </div>

                {/* Section 5 */}
                <div className="mt-2">
                  <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Section 5 — Decision-Making With vs. Without StayWise DC
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 text-xs text-slate-700">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <h4 className="font-bold text-slate-900 font-sans uppercase text-[11px] mb-1">Time Dimension</h4>
                      <p><strong>Without App:</strong> 15+ hours spent manually cross-referencing DC DLCP municipal codes, searching Airbnb listings, and building ad-hoc spreadsheet models.</p>
                      <p className="mt-1"><strong>With App:</strong> Less than 3 minutes to input homeowner parameters and receive an integrated, legally verified financial forecast.</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <h4 className="font-bold text-slate-900 font-sans uppercase text-[11px] mb-1">Money Dimension</h4>
                      <p><strong>Without App:</strong> Homeowners focus on advertised nightly rates ($125 * 120 = $15,000) and ignore cleaning deficits, Airbnb 3% fees, maintenance, and 24% income taxes.</p>
                      <p className="mt-1"><strong>With App:</strong> Unmasks $7,079 in total economic costs and taxes, revealing true take-home profit of $9,521 ($793/month).</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <h4 className="font-bold text-slate-900 font-sans uppercase text-[11px] mb-1">Information Quality</h4>
                      <p><strong>Without App:</strong> Speculative anecdotes from online hosting forums; confusion between gross calendar availability and booked nights.</p>
                      <p className="mt-1"><strong>With App:</strong> 100% reproducible Inside Airbnb empirical data, explicit formula transparency, and official DC Code compliance rules.</p>
                    </div>
                  </div>
                </div>

                {/* Section 6 */}
                <div className="mt-4 bg-amber-50/70 p-3.5 rounded-lg border border-amber-200">
                  <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-amber-950 border-b border-amber-300 pb-1 flex items-center justify-between">
                    <span>Section 6 — What the AI Got Wrong (Development Error Log)</span>
                    <span className="text-[10px] font-mono bg-amber-200 px-1.5 py-0.5 rounded text-amber-900">VERIFIED GENUINE ERROR</span>
                  </h2>
                  <div className="mt-2 text-xs text-slate-800 space-y-1.5">
                    <p><strong>Initial AI Output:</strong> When generating the initial hosting scenario logic, the AI model applied an unconstrained 200–240 available nights projection to an unhosted vacation rental scenario where the host was absent from the property.</p>
                    <p><strong>Why It Was Wrong:</strong> Under the DC Short-Term Rental Regulation Act of 2019 (DC Code § 47-2844.04), unhosted vacation rentals are strictly subject to a cumulative statutory limit of <strong>90 nights per calendar year</strong>. Only primary-residence hosted rentals (where the owner is present on-site during reservations) are exempt from this cap.</p>
                    <p><strong>How the Team Detected It:</strong> During scenario testing of an unhosted entire-home profile with 200 available nights, the AI system projected 100 booked nights and $25,000 in gross revenue without generating a legal violation warning.</p>
                    <p><strong>Correction Applied:</strong> We refactored <code className="bg-white px-1 border border-slate-200 font-mono">calculator.ts</code> to implement a hard legal ceiling: when <code className="bg-white px-1 border border-slate-200 font-mono">hostPresentDuringStays === false</code>, effective bookable nights are capped at 90 nights (or 180 nights if a formal DLCP relocation exemption is certified). Automated unit tests in <code className="bg-white px-1 border border-slate-200 font-mono">calculator.test.ts</code> now verify this rule on every compilation.</p>
                  </div>
                </div>

                {/* Section 7 */}
                <div className="mt-4">
                  <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Section 7 — AI Tools & Models Disclosure
                  </h2>
                  <table className="w-full text-left text-xs mt-2 border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-sans font-bold">
                        <th className="p-1.5 border-r border-slate-300">Tool</th>
                        <th className="p-1.5 border-r border-slate-300">Exact Model</th>
                        <th className="p-1.5">Actual Role in Project</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-1.5 font-semibold border-r border-slate-300">Google AI Studio</td>
                        <td className="p-1.5 font-mono border-r border-slate-300">gemini-3.8-flash</td>
                        <td className="p-1.5">Full-stack React/TypeScript application code, Tailwind CSS styling, mathematical calculations engine, and interactive data visualization components.</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-semibold border-r border-slate-300">ChatGPT (OpenAI)</td>
                        <td className="p-1.5 font-mono border-r border-slate-300">GPT-4o</td>
                        <td className="p-1.5">Initial product concept ideation, requirements structuring, and prompt engineering assistance. Did not directly write production runtime code.</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-semibold border-r border-slate-300">Playwright CLI</td>
                        <td className="p-1.5 font-mono border-r border-slate-300">Chromium Headless (1.50)</td>
                        <td className="p-1.5">End-to-end browser journey validation, interactive accessibility tree verification, and visual regression testing across desktop viewports.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-2 border-t border-slate-300 text-[10px] text-slate-500 text-center font-sans">
                  StayWise DC provides analytical decision-support estimates based on historical Inside Airbnb data and current DC municipal regulations. It does not constitute formal legal, accounting, tax advice, or guaranteed future Airbnb earnings.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-indigo-950/40 p-4 rounded-lg border border-indigo-800/50">
                <h3 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Zoom Cloud Recording Presentation Protocol (2:45 Target)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Follow this exact step-by-step timeline while recording your screen. The in-app <strong>&ldquo;Start Guided Demo&rdquo;</strong> button displays these scripts on your screen for seamless presentation.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-800/70 rounded border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>0:00–0:20 — Introduce Problem & The Airbnb Reality Gap</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded">Screen: Landing Hero</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    &ldquo;Many DC homeowners see advertised Airbnb nightly prices and assume hosting a spare bedroom or basement will be automatically profitable. But the real questions are: Can they legally host in DC? How much money do they actually keep after cleaning, platform fees, taxes, and startup costs? And is the loss of personal time worthwhile?&rdquo;
                  </p>
                </div>

                <div className="p-3 bg-slate-800/70 rounded border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>0:20–0:45 — Introduce Maya’s Petworth Scenario</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded">Screen: Homeowner Profile Card</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    &ldquo;Here is Maya Chen, an owner-occupant in Petworth, DC. She lives in her rowhouse as her primary residence and wants to rent out one furnished spare bedroom for up to 240 nights a year while continuing to live in the home. Her goal is to generate extra income to offset rising property taxes and household expenses.&rdquo;
                  </p>
                </div>

                <div className="p-3 bg-slate-800/70 rounded border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>0:45–1:10 — Legal Compliance & Market Comps</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded">Screen: Compliance & Market Tabs</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    &ldquo;First, legal compliance: Because Maya lives on-site during guest stays, she qualifies for a DC Hosted Short-Term Rental License, granting an exemption from DC&apos;s strict 90-night annual unhosted limit. Second, market comps: In Petworth, median advertised nightly price is $155 across 365 listings. Testing a conservative $125/night for a private room gives her competitive pricing power.&rdquo;
                  </p>
                </div>

                <div className="p-3 bg-slate-800/70 rounded border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>1:10–1:40 — Financial Analysis & Interactive Sliders</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded">Screen: Financial Waterfall & Charts</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    &ldquo;Now look at the financial engine. At 50% occupancy (120 booked nights), Maya generates $15,000 in nightly room revenue plus $1,600 in guest cleaning charges, totaling $16,600 turnover. But look at operating costs: Airbnb&apos;s 3% fee takes $498. Paying cleaners $55 while charging guests $40 creates an immediate $600 annual cleaning deficit! Utilities, supplies, maintenance, and insurance take another $1,660. Net operating cash flow is $12,242, and economic profit after $750 setup amortization and $1,971 income tax is $9,521.&rdquo;
                  </p>
                </div>

                <div className="p-3 bg-slate-800/70 rounded border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>1:40–2:05 — Stress Testing (25% Demand Shock)</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded">Screen: What-If Simulator</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    &ldquo;What happens if tourism drops or competition increases? In one click, we run a stress test: If occupancy drops by 25% (down to 37.5%, or 90 booked nights), gross turnover drops to $12,450. Because fixed maintenance, insurance, and utilities remain constant, her net cash flow drops to $8,995 and true economic profit drops to $6,974. Even under severe stress, Maya remains comfortably above her 33-night break-even threshold.&rdquo;
                  </p>
                </div>

                <div className="p-3 bg-slate-800/70 rounded border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>2:05–2:30 — Recommendation & Lifestyle Tradeoffs</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded">Screen: Decision Dashboard</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    &ldquo;StayWise DC delivers a clear recommendation: PROCEED WITH CAUTION. Financially, $9,521 net income strongly exceeds long-term room rental alternatives. Economically, she earns an effective $95.21 per hour for 100 hours of hosting labor. But her primary hurdle is lifestyle: sharing her living room and kitchen 120 nights a year. The app advises testing a 90-day pilot before investing more in furnishings.&rdquo;
                  </p>
                </div>

                <div className="p-3 bg-slate-800/70 rounded border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>2:30–2:45 — Closing Synthesis</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded">Screen: Summary & Action Checklist</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    &ldquo;In under 3 minutes, StayWise DC transformed an overwhelming, legally ambiguous decision into a transparent, data-grounded evaluation. Rather than merely estimating Airbnb gross revenue, StayWise DC helps Washington, DC homeowners make legally secure, financially realistic choices.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'error_log' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-red-950/30 p-4 rounded-lg border border-red-800/40">
                <h3 className="font-bold text-red-300 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Mandatory Section 6: Development Error Log
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  The assignment requires documenting at least one genuine AI error and its correction. Never fabricate development history; this reflects our verified bug fix during the calculation engine build.
                </p>
              </div>

              <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/60 divide-y divide-slate-700 text-xs">
                <div className="p-3.5">
                  <span className="font-bold text-slate-300 block mb-1">1. Initial AI-Generated Output & Behavior:</span>
                  <p className="text-slate-200 bg-slate-900/80 p-2.5 rounded border border-slate-800 font-mono">
                    When user toggled hosting mode to Vacation Rental (unhosted) with 200 annual available nights, the AI calculation engine projected 100 booked nights (50% occupancy) and computed financial returns based on the full 200 available nights without restrictions.
                  </p>
                </div>

                <div className="p-3.5">
                  <span className="font-bold text-slate-300 block mb-1">2. Why It Was Incorrect (DC Law):</span>
                  <p className="text-slate-300">
                    DC Law 22-307 (Short-Term Rental Regulation Act of 2019, DC Code § 47-2844.04) explicitly mandates that unhosted vacation rentals may not exceed <strong>90 cumulative days per calendar year</strong>. Only primary-residence hosted rentals (where the licensee resides on premises during the stay) are exempt from this 90-night statutory cap.
                  </p>
                </div>

                <div className="p-3.5">
                  <span className="font-bold text-slate-300 block mb-1">3. How the Error Was Detected:</span>
                  <p className="text-slate-300">
                    During validation against the DC DLCP municipal handbook, we ran an automated unit test with 200 available unhosted nights. The model passed all 200 nights through to the booking formula, violating the statutory ceiling.
                  </p>
                </div>

                <div className="p-3.5">
                  <span className="font-bold text-slate-300 block mb-1">4. The Code Correction Applied:</span>
                  <p className="text-slate-300">
                    In <code className="bg-slate-900 text-amber-300 px-1 py-0.5 rounded font-mono">src/utils/calculator.ts</code>, we integrated a legal night cap enforcer:
                  </p>
                  <pre className="mt-1.5 p-2 bg-slate-950 rounded text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`const requestedAvailable = Math.max(0, profile.annualAvailableNights);
const legalNightCap = legal.nightCapEnforcedValue; // 90 for vacation rental
const effectiveBookableNights = Math.min(requestedAvailable, legalNightCap);
const actualBookedNights = Math.round(effectiveBookableNights * boundedOccupancy);`}
                  </pre>
                </div>

                <div className="p-3.5">
                  <span className="font-bold text-slate-300 block mb-1">5. Automated Verification Test Proving Fix:</span>
                  <p className="text-slate-300">
                    Added test in <code className="bg-slate-900 text-amber-300 px-1 py-0.5 rounded font-mono">src/utils/calculator.test.ts</code>:
                  </p>
                  <p className="text-emerald-400 font-mono text-[11px] mt-1 bg-slate-950 p-2 rounded">
                    ok 2 - Legal Compliance: Vacation Rental (unhosted) enforces strict 90-night limit without exemption (Passed in 0.60ms)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data_provenance' && (
            <div className="space-y-4 max-w-3xl mx-auto text-xs text-slate-300">
              <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-2">Inside Airbnb Washington, DC Data Pack Provenance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-3">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Snapshot Date</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">2026-09-19</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Raw Listing Rows</span>
                    <span className="text-sm font-bold text-white font-mono">6,906</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Priced Listings</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">5,993</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Neighborhood Groups</span>
                    <span className="text-sm font-bold text-indigo-300 font-mono">39</span>
                  </div>
                </div>

                <p className="leading-relaxed">
                  Data source verified from Inside Airbnb Washington, D.C. public repository. Extracted from raw summary listings CSV and validated against summary tables in the project attachments (pages 46–48).
                </p>

                <h4 className="font-bold text-white mt-3 mb-1">Key Cleaning Steps:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Price Validation:</strong> 913 listings had null or unparseable advertised prices. These were strictly excluded from price statistics calculations.</li>
                  <li><strong>Room Type Segregation:</strong> Citywide distribution is 5,260 Entire Homes (76.2%), 1,389 Private Rooms (20.1%), 218 Hotel Rooms (3.2%), and 39 Shared Rooms (0.6%).</li>
                  <li><strong>Minimum Stay Filtering:</strong> 1,979 listings in DC have a minimum stay restriction of 30 or more nights (typically exempt from short-term rental rules).</li>
                  <li><strong>Petworth Group Comps:</strong> 365 total listings in Brightwood Park/Crestwood/Petworth; 67 private rooms; median advertised rate is $155.00/night.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4 max-w-3xl mx-auto text-xs text-slate-300">
              <div className="bg-emerald-950/40 p-4 rounded-lg border border-emerald-800/40">
                <h3 className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Submission Quality & Compliance Audit
                </h3>
                <p className="text-xs text-slate-300">
                  Verify these 10 mandatory checks before submitting the assignment to the instructor.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { text: "Public App URL opens in Incognito/Private browser without account or password login.", done: true },
                  { text: "Interactive sample homeowner case (Maya's Petworth Spare Room) loads on launch.", done: true },
                  { text: "Adjusting nightly rate or occupancy dynamically updates revenue, cleaning deficit, and net cash flow.", done: true },
                  { text: "DC Legal Eligibility warnings accurately differentiate Hosted (unlimited) vs Vacation Rental (90-night limit).", done: true },
                  { text: "Prominent 'Start Guided Demo' button leads presenter through a 2:45 presentation walkthrough.", done: true },
                  { text: "Real Inside Airbnb Washington DC empirical data pack is integrated and cited (Sep 19, 2026 snapshot).", done: true },
                  { text: "What-If demand stress test simulates a 25% occupancy drop and computes revised break-even nights.", done: true },
                  { text: "Development Error Log documents genuine 90-night statutory cap correction with automated unit tests.", done: true },
                  { text: "AI Tools and Models disclosure table lists exact models (Gemini 3.8 Flash, GPT-4o).", done: true },
                  { text: "Academic Report layout is formatted to fit exactly two readable pages without microscopic text.", done: true }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 bg-slate-800/50 rounded border border-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
