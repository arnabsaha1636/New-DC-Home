import React, { useState } from "react";
import { Activity, RotateCcw } from "lucide-react";
import {
  HomeownerProfile,
  ScenarioId,
  applyStressScenario,
  calculateHostingFinancials,
  money,
  displayNumber,
} from "../utils/calculator";
const scenarios: { id: ScenarioId; label: string; detail: string }[] = [
  {
    id: "demand_drop_25",
    label: "Demand Falls 25%",
    detail: "Baseline occupancy × 0.75.",
  },
  {
    id: "price_war_15",
    label: "Price Compression 15%",
    detail: "Baseline nightly asking price × 0.85.",
  },
  {
    id: "cost_spike_20",
    label: "Cost & Cleaning Spike 20%",
    detail: "Cleaning, utilities, supplies, insurance and maintenance × 1.20.",
  },
  {
    id: "severe_compound",
    label: "Compound Stress Test",
    detail: "Combine all three baseline shocks.",
  },
];
export const StressSimulatorSection: React.FC<{
  profile: HomeownerProfile;
  onChangeProfile: (p: Partial<HomeownerProfile>) => void;
}> = ({ profile }) => {
  const [baseline, setBaseline] = useState(() => ({ ...profile }));
  const [scenario, setScenario] = useState<ScenarioId>("baseline");
  const stressed = applyStressScenario(baseline, scenario),
    base = calculateHostingFinancials(baseline),
    current = calculateHostingFinancials(stressed);
  const metrics: [string, number, number][] = [
    ["Gross turnover", base.grossGuestTurnover, current.grossGuestTurnover],
    [
      "Cash flow before income tax",
      base.netOperatingCashFlow,
      current.netOperatingCashFlow,
    ],
    [
      "Cash flow after modeled tax",
      base.netCashFlowAfterIncomeTax,
      current.netCashFlowAfterIncomeTax,
    ],
    [
      "Profit after setup and modeled tax",
      base.economicProfitAfterSetupAndTax,
      current.economicProfitAfterSetupAndTax,
    ],
    [
      "Surplus after imputed labor",
      base.trueEconomicSurplusAfterLabor,
      current.trueEconomicSurplusAfterLabor,
    ],
  ];
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 space-y-6">
      <div className="flex flex-wrap justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold flex gap-2">
            <Activity className="text-rose-400" />
            What-If Risk & Market Stress Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Scenarios preview the homeowner baseline captured when this tab
            opened. They do not change your saved assumptions.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            className="bg-slate-800 p-2 rounded"
            onClick={() => {
              setBaseline({ ...profile });
              setScenario("baseline");
            }}
          >
            Capture current profile
          </button>
          <button
            className="bg-slate-800 p-2 rounded flex gap-1"
            onClick={() => setScenario("baseline")}
          >
            <RotateCcw size={14} />
            Reset Baseline
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((s) => (
          <button
            id={
              s.id === "demand_drop_25" ? "stress-test-demand-btn" : undefined
            }
            key={s.id}
            onClick={() => setScenario(s.id)}
            aria-pressed={scenario === s.id}
            className={`p-4 rounded-xl border text-left ${scenario === s.id ? "bg-rose-950 border-rose-500" : "bg-slate-950 border-slate-800"}`}
          >
            <p className="text-sm font-bold text-rose-300">{s.label}</p>
            <p className="text-xs text-slate-400 mt-2">{s.detail}</p>
          </button>
        ))}
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm" data-testid="stress-results">
          <thead className="text-slate-400">
            <tr>
              {[
                "Annual metric",
                "Baseline",
                "Scenario",
                "Dollar difference",
                "% difference",
              ].map((h) => (
                <th className="p-3 text-left" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map(([label, b, c]) => (
              <tr key={label} className="border-t border-slate-800">
                <td className="p-3">{label}</td>
                <td className="p-3">{money(b)}</td>
                <td className="p-3 text-amber-300">{money(c)}</td>
                <td className="p-3">{money(c - b)}</td>
                <td className="p-3">
                  {b === 0
                    ? c === 0
                      ? "0%"
                      : "N/A (zero baseline)"
                    : `${(((c - b) / Math.abs(b)) * 100).toFixed(1)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-300">
        Occupancy: {(baseline.expectedOccupancyRate * 100).toFixed(1)}% →{" "}
        {(stressed.expectedOccupancyRate * 100).toFixed(1)}%; modeled booked
        nights: {base.actualBookedNightsProjected} →{" "}
        {current.actualBookedNightsProjected}; nightly asking price:{" "}
        {money(baseline.nightlyPrice)} → {money(stressed.nightlyPrice)}.
        Break-even: {displayNumber(base.breakEvenBookedNights)} →{" "}
        {displayNumber(current.breakEvenBookedNights)} nights.
      </p>
      <p className="bg-slate-950 p-4 rounded-lg text-xs text-slate-400">
        {current.trueEconomicSurplusAfterLabor > 0
          ? "Positive modeled surplus remains after valuing labor."
          : "This scenario does not compensate all modeled costs and host labor."}{" "}
        Switching buttons always starts from the captured baseline. Reset
        restores that exact baseline in the preview.
      </p>
    </section>
  );
};
