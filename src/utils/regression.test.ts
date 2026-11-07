import test from "node:test";
import assert from "node:assert/strict";
import {
  MAYA_PETWORTH_BASE_CASE as base,
  calculateHostingFinancials as calculate,
  evaluateDcLegalCompliance as legal,
  applyStressScenario,
  hostingDecision,
  HomeownerProfile,
} from "./calculator";
import { buildReport } from "./report";
const close = (a: number, b: number) =>
  assert.ok(Math.abs(a - b) < 0.000001, `${a} != ${b}`);
test("Specified baseline reconciles cash, tax, profit, labor and 21-night break-even", () => {
  const f = calculate(base);
  assert.equal(f.actualBookedNightsProjected, 120);
  assert.equal(f.totalReservationsCount, 40);
  assert.equal(f.grossNightlyRevenue, 15000);
  assert.equal(f.cleaningFeesCollected, 1600);
  assert.equal(f.grossGuestTurnover, 16600);
  assert.equal(f.totalCashOperatingCosts, 4358);
  assert.equal(f.netOperatingCashFlow, 12242);
  assert.equal(f.annualSetupAmortization, 750);
  close(f.estimatedIncomeTaxLiability, 2758.08);
  close(f.economicProfitAfterSetupAndTax, 8733.92);
  close(f.netCashFlowAfterIncomeTax, 9483.92);
  close(f.trueEconomicSurplusAfterLabor, 5233.92);
  close(f.effectiveHourlyWageEarned, 87.3392);
  assert.equal(f.breakEvenBookedNights, 21);
});
test("Zero occupancy has zero reservations and receipts but retains fixed losses", () => {
  const f = calculate({ ...base, expectedOccupancyRate: 0 });
  assert.equal(f.grossGuestTurnover, 0);
  assert.equal(f.totalReservationsCount, 0);
  assert.equal(f.cleaningServiceExpenses, 0);
  assert.equal(f.estimatedIncomeTaxLiability, 0);
  assert.equal(f.economicProfitAfterSetupAndTax, -2410);
  assert.equal(f.effectiveHourlyWageEarned, 0);
});
test("Ineligibility blocks all short-term receipts and cannot recommend proceeding", () => {
  const p = { ...base, isPrimaryResidence: false };
  assert.equal(calculate(p).actualBookedNightsProjected, 0);
  assert.equal(hostingDecision(p).verdict, "STOP");
});
test("User-declared exemption cannot silently expand the standard unhosted cap", () => {
  const p = {
    ...base,
    hostPresentDuringStays: false,
    hasExemptionFor90NightLimit: true,
    annualAvailableNights: 365,
    expectedOccupancyRate: 1,
  };
  assert.equal(legal(p).nightCapEnforcedValue, 90);
  assert.equal(calculate(p).actualBookedNightsProjected, 90);
  assert.ok(legal(p).warnings.some((w) => w.includes("unverified")));
});
test("Nonfinite, negative and extreme inputs are bounded without NaN or illegal bookings", () => {
  for (const change of [
    { expectedOccupancyRate: NaN, nightlyPrice: Infinity },
    { annualAvailableNights: 1e20, expectedOccupancyRate: 8 },
    { annualAvailableNights: -5, cleaningCostPaidPerStay: -100 },
    { averageStayLengthNights: 0, setupCostAmortizationYears: 0 },
    { airbnbHostServiceFeePct: 1000, homeownerTaxRateIncomePct: 1000 },
  ]) {
    const f = calculate({ ...base, ...change });
    for (const [key, v] of Object.entries(f)) assert.ok(!Number.isNaN(v), key);
    assert.ok(
      f.actualBookedNightsProjected >= 0 &&
        f.actualBookedNightsProjected <= 365,
    );
    assert.ok(f.estimatedIncomeTaxLiability >= 0);
  }
});
test("Nonpositive unit contribution reports unreachable break-even instead of a false 100% ceiling", () => {
  const f = calculate({
    ...base,
    nightlyPrice: 0,
    cleaningFeeChargedToGuest: 0,
  });
  assert.equal(f.breakEvenBookedNights, Infinity);
  assert.equal(f.breakEvenOccupancyPct, Infinity);
  const expensive = calculate({ ...base, annualMaintenanceBudget: 1e6 });
  assert.ok(expensive.breakEvenOccupancyPct > 100);
});
test("Ceiling reservations includes partial stays and cleaning fees in platform fee base", () => {
  const f = calculate({
    ...base,
    annualAvailableNights: 5,
    expectedOccupancyRate: 1,
  });
  assert.equal(f.totalReservationsCount, 2);
  assert.equal(f.cleaningFeesCollected, 80);
  close(f.airbnbPlatformFee, (625 + 80) * 0.03);
});
test("Shocks use actual customized baseline, do not mutate it, and reset exactly", () => {
  const p = {
    ...base,
    nightlyPrice: 200,
    expectedOccupancyRate: 0.8,
    annualMaintenanceBudget: 700,
  };
  const saved = structuredClone(p);
  const demand = applyStressScenario(p, "demand_drop_25");
  close(demand.expectedOccupancyRate, 0.6);
  assert.equal(demand.nightlyPrice, 200);
  const price = applyStressScenario(p, "price_war_15");
  assert.equal(price.nightlyPrice, 170);
  assert.equal(price.expectedOccupancyRate, 0.8);
  const cost = applyStressScenario(p, "cost_spike_20");
  assert.equal(cost.annualMaintenanceBudget, 840);
  assert.equal(cost.cleaningCostPaidPerStay, 66);
  assert.equal(cost.monthlySuppliesAndConsumables, 42);
  const compound = applyStressScenario(p, "severe_compound");
  assert.equal(compound.nightlyPrice, 170);
  close(compound.expectedOccupancyRate, 0.6);
  assert.equal(compound.annualMaintenanceBudget, 840);
  assert.deepEqual(applyStressScenario(p, "baseline"), saved);
  assert.deepEqual(p, saved);
});
test("Recommendation changes for losses, uncompensated labor, pilot and robust small case", () => {
  assert.equal(
    hostingDecision({ ...base, expectedOccupancyRate: 0 }).verdict,
    "RECONSIDER",
  );
  assert.equal(
    hostingDecision({ ...base, ownerOpportunityCostHourlyRate: 500 }).verdict,
    "RECONSIDER",
  );
  assert.equal(hostingDecision(base).verdict, "PILOT");
  assert.equal(
    hostingDecision({
      ...base,
      annualAvailableNights: 80,
      expectedOccupancyRate: 1,
    }).verdict,
    "PROCEED",
  );
  for (const p of [
    base,
    { ...base, nightlyPrice: 0 },
    { ...base, isPrimaryResidence: false },
  ]) {
    const d = hostingDecision(p);
    for (const key of [
      "score",
      "financialScore",
      "legalScore",
      "laborScore",
      "lifestyleScore",
    ] as const)
      assert.ok(d[key] >= 0 && d[key] <= 100);
  }
});
test("Report recalculates figures and keeps unverified links as placeholders", () => {
  const a = buildReport(base).text,
    b = buildReport({ ...base, nightlyPrice: 200 }).text;
  assert.ok(a.includes("$8,733.92"));
  assert.notEqual(a, b);
  assert.ok(!a.includes("profit at $9,521"));
  assert.ok(
    a.includes("[Add only after independently verifying public access]"),
  );
  assert.ok(!a.includes("Verified incognito"));
});
