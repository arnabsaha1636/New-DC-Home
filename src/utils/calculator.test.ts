import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateDcLegalCompliance,
  calculateHostingFinancials,
  MAYA_PETWORTH_BASE_CASE,
  HomeownerProfile,
} from "./calculator";

test("Legal Compliance: Hosted license allows unlimited nights for primary residence", () => {
  const result = evaluateDcLegalCompliance(MAYA_PETWORTH_BASE_CASE);
  assert.equal(result.isEligible, true);
  assert.equal(result.licenseCategory, "Hosted License");
  assert.equal(result.annualNightCap, "Unlimited");
  assert.equal(result.nightCapEnforcedValue, 365);
});

test("Legal Compliance: Vacation Rental (unhosted) enforces strict 90-night limit without exemption", () => {
  const unhostedProfile: HomeownerProfile = {
    ...MAYA_PETWORTH_BASE_CASE,
    hostPresentDuringStays: false,
    rentalScope: "entire_home",
    annualAvailableNights: 200,
  };

  const result = evaluateDcLegalCompliance(unhostedProfile);
  assert.equal(result.licenseCategory, "Vacation Rental License");
  assert.equal(result.annualNightCap, 90);
  assert.equal(result.nightCapEnforcedValue, 90);

  // Financials must cap at 90 nights even if 200 requested!
  const fin = calculateHostingFinancials(unhostedProfile);
  assert.equal(fin.legalNightCapApplied, 90);
  // at 50% occupancy of 90 nights = 45 nights
  assert.equal(fin.actualBookedNightsProjected, 45);
});

test("Legal Compliance: Non-primary residence is strictly ineligible for DC STR", () => {
  const investorProfile: HomeownerProfile = {
    ...MAYA_PETWORTH_BASE_CASE,
    isPrimaryResidence: false,
  };
  const result = evaluateDcLegalCompliance(investorProfile);
  assert.equal(result.isEligible, false);
  assert.equal(result.licenseCategory, "Ineligible");
  assert.equal(result.nightCapEnforcedValue, 0);

  const fin = calculateHostingFinancials(investorProfile);
  assert.equal(fin.actualBookedNightsProjected, 0);
  assert.equal(fin.grossGuestTurnover, 0);
});

test("Maya Petworth Case: Calculates exact revenue, cleaning deficit, and net cash flow", () => {
  const fin = calculateHostingFinancials(MAYA_PETWORTH_BASE_CASE);

  // 240 nights * 50% = 120 nights
  assert.equal(fin.actualBookedNightsProjected, 120);
  // 120 nights / 3 nights stay = 40 reservations
  assert.equal(fin.totalReservationsCount, 40);
  // 120 * $125 = $15,000 nightly revenue
  assert.equal(fin.grossNightlyRevenue, 15000);
  // 40 stays * $40 cleaning fee = $1,600 collected
  assert.equal(fin.cleaningFeesCollected, 1600);
  // Gross turnover = 15,000 + 1,600 = $16,600
  assert.equal(fin.grossGuestTurnover, 16600);

  // Airbnb 3% fee on $16,600 = $498
  assert.equal(fin.airbnbPlatformFee, 498);
  // Cleaning paid: 40 * $55 = $2,200
  assert.equal(fin.cleaningServiceExpenses, 2200);
  // Net cleaning margin: 1600 - 2200 = -$600 loss! (Key insight: cleaning is a loss, not profit)
  assert.equal(fin.netCleaningMargin, -600);

  // Operating costs: utilities $540 + supplies $420 + insurance $300 + maintenance $400 + cleaning $2200 + platform $498
  // Total cash operating = 498 + 2200 + 540 + 420 + 300 + 400 = 4358
  assert.equal(fin.totalCashOperatingCosts, 4358);
  // Net operating cash flow before tax = 16,600 - 4,358 = $12,242
  assert.equal(fin.netOperatingCashFlow, 12242);

  // Setup amortization: $1500 / 2 = $750/year
  assert.equal(fin.annualSetupAmortization, 750);

  // Labor: 40 * 2.5 hrs = 100 hours
  assert.equal(fin.totalHostLaborHoursPerYear, 100);
  // Host time imputed at $35/hr = $3,500
  assert.equal(fin.valueHostTimeImputed, 3500);

  // Effective hourly wage is positive and calculated
  assert.ok(fin.effectiveHourlyWageEarned > 50);
});
