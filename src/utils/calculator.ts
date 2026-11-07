/**
 * Pure calculation logic and rules for StayWise DC.
 * Evaluates DC Legal Eligibility (Hosted vs Vacation Rental, 90-night limit, licensing)
 * and detailed homeowner financial profit models, tax, cleaning, startup amortizations,
 * and stress test scenarios.
 */
export type PropertyType = "rowhouse" | "condo" | "single_family" | "apartment";
export type RentalScope = "spare_room" | "entire_home" | "basement_suite";
export interface HomeownerProfile {
  name: string;
  neighborhood: string;
  propertyType: PropertyType;
  isPrimaryResidence: boolean;
  rentalScope: RentalScope;
  hostPresentDuringStays: boolean; // True = Hosted, False = Vacation Rental (unhosted)
  hasExemptionFor90NightLimit?: boolean; // DC DLCP exemption
  annualAvailableNights: number;
  expectedOccupancyRate: number; // e.g. 50% = 0.50
  nightlyPrice: number;
  averageStayLengthNights: number;
  cleaningFeeChargedToGuest: number;
  cleaningCostPaidPerStay: number;
  initialFurnishingSetupCost: number;
  setupCostAmortizationYears: number;
  monthlyUtilitiesIncremental: number;
  monthlySuppliesAndConsumables: number;
  monthlyInsuranceAddon: number;
  annualMaintenanceBudget: number;
  airbnbHostServiceFeePct: number; // typically 3%
  dcLodgingTaxPaidByGuestPct: number; // 15.95% DC Sales and Use Tax on Transient Lodging
  homeownerTaxRateIncomePct: number; // e.g., 25% marginal tax estimate
  ownerHoursPerReservation: number; // cleaning, guest comms, check-in
  ownerOpportunityCostHourlyRate: number; // e.g., $30/hr valuation of personal free time
}
export interface LegalComplianceResult {
  licenseCategory: "Hosted License" | "Vacation Rental License" | "Ineligible";
  isEligible: boolean;
  annualNightCap: number | "Unlimited";
  nightCapEnforcedValue: number;
  capReason: string;
  warnings: string[];
  mandatoryRequirements: string[];
  unresolvedVerificationItems: string[];
}
export interface FinancialBreakdown {
  effectiveBookableNightsRequested: number;
  legalNightCapApplied: number;
  actualBookedNightsProjected: number;
  totalReservationsCount: number;
  // Gross Inflow
  grossNightlyRevenue: number;
  cleaningFeesCollected: number;
  grossGuestTurnover: number; // lodging + cleaning
  // Operating Expenses
  airbnbPlatformFee: number;
  cleaningServiceExpenses: number;
  netCleaningMargin: number; // cleaning collected - cleaning paid (often negative!)
  annualIncrementalUtilities: number;
  annualSupplies: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualSetupAmortization: number;
  totalCashOperatingCosts: number;
  totalEconomicCostsWithAmortization: number;
  // Tax
  dcLodgingTaxRemittedByAirbnb: number; // Modeled guest tax; platform remittance is not verified.
  estimatedTaxableIncome: number;
  estimatedIncomeTaxLiability: number;
  // Net Returns
  netOperatingCashFlow: number; // Before setup amortization & before income tax
  netCashFlowAfterIncomeTax: number;
  economicProfitAfterSetupAndTax: number;
  // Labor & Opportunity Cost
  totalHostLaborHoursPerYear: number;
  valueHostTimeImputed: number;
  trueEconomicSurplusAfterLabor: number;
  effectiveHourlyWageEarned: number;
  // Break-even
  breakEvenBookedNights: number;
  breakEvenOccupancyPct: number;
}
export interface StressScenario {
  label: string;
  description: string;
  occupancyDeltaPct: number; // e.g. -25 means 50% -> 37.5%
  priceDeltaPct: number; // e.g. -15 means $125 -> $106.25
  costDeltaPct: number; // e.g. +20%
}
/**
 * DC Short-Term Rental Act Compliance Engine.
 * DC Code Title 30 Chapter 2 / DLCP STR screening:
 * - Hosted License: Owner must be present during stay, property must be owner's primary residence (Homestead deduction). Unlimited nights.
 * - Vacation Rental (Unhosted): Owner absent during stay. Primary residence required. STRICT 90-NIGHT CUMULATIVE CALENDAR YEAR CAP with exemptions requiring independent DLCP review; this model retains the standard cap.
 * - Non-primary residences: Ineligible under this primary-residence short-term rental screening.
 */
export const LEGAL_REVIEW_DATE = "2026-11-07";
export const LEGAL_SOURCE = "https://dlcp.dc.gov/service/short-term-rentals";
export const LEGAL_CODE_SOURCE =
  "https://code.dccouncil.gov/us/dc/council/code/sections/30-201.06";
export const TAX_SOURCE =
  "https://otr.cfo.dc.gov/release/notice-oct-1-2025-tax-changes";
export function evaluateDcLegalCompliance(
  profile: HomeownerProfile,
): LegalComplianceResult {
  const eligible = profile.isPrimaryResidence;
  const hosted = profile.hostPresentDuringStays;
  const cap = !eligible ? 0 : hosted ? 365 : 90;
  const warnings: string[] = [];
  if (!eligible)
    warnings.push(
      "Non-primary residences do not qualify for this short-term rental screening.",
    );
  if (!hosted && profile.annualAvailableNights > 90)
    warnings.push(
      "Unhosted projections are conservatively capped at 90 available nights per calendar year.",
    );
  if (profile.hasExemptionFor90NightLimit)
    warnings.push(
      "Exemption is user-declared and unverified. The model retains the standard 90-night cap; independently confirm the DLCP-approved dates and authorized nights.",
    );
  if (profile.averageStayLengthNights > 30)
    warnings.push(
      "Stays longer than 30 consecutive nights require a separate rental analysis.",
    );
  return {
    licenseCategory: !eligible
      ? "Ineligible"
      : hosted
        ? "Hosted License"
        : "Vacation Rental License",
    isEligible: eligible,
    annualNightCap: eligible && hosted ? "Unlimited" : cap,
    nightCapEnforcedValue: cap,
    capReason: !eligible
      ? "Primary residence eligibility is required."
      : hosted
        ? "Hosted rentals have no statutory annual cap; this annual model uses 365 days."
        : "Standard unhosted vacation rental cap: 90 cumulative nights/calendar year. Exemptions require a separate DLCP determination.",
    warnings,
    mandatoryRequirements: [
      "Obtain the applicable DLCP Short-Term Rental or Vacation Rental endorsement before listing.",
      "Confirm primary residence and Homestead eligibility with DC OTR.",
      "Meet fire safety, liability insurance, and emergency contact requirements.",
      "Confirm applicable lodging tax collection and remittance with the platform and DC OTR.",
    ],
    unresolvedVerificationItems: [
      "All residence, host-presence, license and exemption information is user-declared; no approval is independently verified.",
      "Check HOA, condominium, lease and mortgage restrictions.",
      "Review the official DLCP requirements and any approved exemption documentation.",
    ],
  };
}
/**
 * Computes complete financial outcomes based on property assumptions and legal constraints.
 */
export function calculateHostingFinancials(
  input: HomeownerProfile,
): FinancialBreakdown {
  const profile = normalizeProfile(input);
  const legal = evaluateDcLegalCompliance(profile);
  // Effective available nights bounded by legal restriction
  const requestedAvailable = Math.floor(profile.annualAvailableNights);
  const legalNightCap = legal.nightCapEnforcedValue;
  const effectiveBookableNights = Math.min(requestedAvailable, legalNightCap);
  // Projected booked nights based on expected occupancy
  const boundedOccupancy = Math.max(
    0,
    Math.min(1, profile.expectedOccupancyRate),
  );
  const actualBookedNights = Math.round(
    effectiveBookableNights * boundedOccupancy,
  );
  // Stay count
  const avgStay = Math.max(1, profile.averageStayLengthNights);
  const totalReservations =
    actualBookedNights > 0 ? Math.ceil(actualBookedNights / avgStay) : 0;
  // Inflows
  const grossNightlyRevenue = actualBookedNights * profile.nightlyPrice;
  const cleaningFeesCollected =
    totalReservations * profile.cleaningFeeChargedToGuest;
  const grossGuestTurnover = grossNightlyRevenue + cleaningFeesCollected;
  // Platform Fee (typically 3% of host payout subtotal: nightly + cleaning charged)
  const airbnbPlatformFee =
    grossGuestTurnover * (profile.airbnbHostServiceFeePct / 100);
  // Cleaning Outflow
  const cleaningServiceExpenses =
    totalReservations * profile.cleaningCostPaidPerStay;
  const netCleaningMargin = cleaningFeesCollected - cleaningServiceExpenses;
  // Annual Fixed & Operating Costs
  const annualIncrementalUtilities = profile.monthlyUtilitiesIncremental * 12;
  const annualSupplies = profile.monthlySuppliesAndConsumables * 12;
  const annualInsurance = profile.monthlyInsuranceAddon * 12;
  const annualMaintenance = profile.annualMaintenanceBudget;
  // Amortization of setup cost
  const amortYears = Math.max(1, profile.setupCostAmortizationYears || 1);
  const annualSetupAmortization =
    profile.initialFurnishingSetupCost / amortYears;
  // Cash operating costs (excluding setup amortization)
  const totalCashOperatingCosts =
    airbnbPlatformFee +
    cleaningServiceExpenses +
    annualIncrementalUtilities +
    annualSupplies +
    annualInsurance +
    annualMaintenance;
  const totalEconomicCostsWithAmortization =
    totalCashOperatingCosts + annualSetupAmortization;
  // DC Lodging Tax (15.95% - automatically collected from guest and remitted to DC OTR by Airbnb)
  const dcLodgingTaxRemittedByAirbnb =
    grossGuestTurnover * (profile.dcLodgingTaxPaidByGuestPct / 100);
  // Estimated Taxable Income (Gross Payout minus allowable ordinary hosting expenses)
  const hostNetPayout = grossGuestTurnover - airbnbPlatformFee;
  const allowableDeductions =
    cleaningServiceExpenses +
    annualIncrementalUtilities +
    annualSupplies +
    annualInsurance +
    annualMaintenance +
    annualSetupAmortization;
  const estimatedTaxableIncome = Math.max(
    0,
    hostNetPayout - allowableDeductions,
  );
  const estimatedIncomeTaxLiability =
    estimatedTaxableIncome * (profile.homeownerTaxRateIncomePct / 100);
  // Net Cash Flow Before and After Income Tax
  const netOperatingCashFlow = grossGuestTurnover - totalCashOperatingCosts;
  const netCashFlowAfterIncomeTax =
    netOperatingCashFlow - estimatedIncomeTaxLiability;
  const economicProfitAfterSetupAndTax =
    grossGuestTurnover -
    totalEconomicCostsWithAmortization -
    estimatedIncomeTaxLiability;
  // Labor & Opportunity Cost
  const totalHostLaborHoursPerYear =
    totalReservations * profile.ownerHoursPerReservation;
  const valueHostTimeImputed =
    totalHostLaborHoursPerYear * profile.ownerOpportunityCostHourlyRate;
  const trueEconomicSurplusAfterLabor =
    economicProfitAfterSetupAndTax - valueHostTimeImputed;
  const effectiveHourlyWageEarned =
    totalHostLaborHoursPerYear > 0
      ? economicProfitAfterSetupAndTax / totalHostLaborHoursPerYear
      : 0;
  // Break-even nights:
  // Fixed costs per year = utilities + supplies + insurance + maintenance + setupAmort
  const annualFixedCosts =
    annualIncrementalUtilities +
    annualSupplies +
    annualInsurance +
    annualMaintenance +
    annualSetupAmortization;
  // Per night contribution margin:
  // Nightly Price + (CleaningFeeCharged / avgStay) - (PlatformFee on nightly+cleaning) - (CleaningPaid / avgStay)
  const revenuePerNight =
    profile.nightlyPrice + profile.cleaningFeeChargedToGuest / avgStay;
  const variableCostPerNight =
    revenuePerNight * (profile.airbnbHostServiceFeePct / 100) +
    profile.cleaningCostPaidPerStay / avgStay;
  const contributionMarginPerNight = revenuePerNight - variableCostPerNight;
  let breakEvenBookedNights = 0;
  if (contributionMarginPerNight > 0) {
    breakEvenBookedNights = Math.ceil(
      annualFixedCosts / contributionMarginPerNight,
    );
  } else {
    breakEvenBookedNights = annualFixedCosts === 0 ? 0 : Infinity;
  }
  const breakEvenOccupancyPct =
    effectiveBookableNights > 0
      ? Math.round((breakEvenBookedNights / effectiveBookableNights) * 1000) /
        10
      : breakEvenBookedNights === 0
        ? 0
        : Infinity;
  return {
    effectiveBookableNightsRequested: requestedAvailable,
    legalNightCapApplied: legalNightCap,
    actualBookedNightsProjected: actualBookedNights,
    totalReservationsCount: totalReservations,
    grossNightlyRevenue,
    cleaningFeesCollected,
    grossGuestTurnover,
    airbnbPlatformFee,
    cleaningServiceExpenses,
    netCleaningMargin,
    annualIncrementalUtilities,
    annualSupplies,
    annualInsurance,
    annualMaintenance,
    annualSetupAmortization,
    totalCashOperatingCosts,
    totalEconomicCostsWithAmortization,
    dcLodgingTaxRemittedByAirbnb,
    estimatedTaxableIncome,
    estimatedIncomeTaxLiability,
    netOperatingCashFlow,
    netCashFlowAfterIncomeTax,
    economicProfitAfterSetupAndTax,
    totalHostLaborHoursPerYear,
    valueHostTimeImputed,
    trueEconomicSurplusAfterLabor,
    effectiveHourlyWageEarned,
    breakEvenBookedNights,
    breakEvenOccupancyPct,
  };
}
/**
 * Standard Maya Petworth Demo Case baseline profile.
 */
export const MAYA_PETWORTH_BASE_CASE: HomeownerProfile = {
  name: "Maya Chen",
  neighborhood: "Brightwood Park, Crestwood, Petworth",
  propertyType: "rowhouse",
  isPrimaryResidence: true,
  rentalScope: "spare_room",
  hostPresentDuringStays: true, // Hosted short-term rental
  hasExemptionFor90NightLimit: false,
  annualAvailableNights: 240,
  expectedOccupancyRate: 0.5, // 50%
  nightlyPrice: 125,
  averageStayLengthNights: 3,
  cleaningFeeChargedToGuest: 40,
  cleaningCostPaidPerStay: 55, // Owner pays a professional cleaner $55, takes a $15 loss per turn!
  initialFurnishingSetupCost: 1500,
  setupCostAmortizationYears: 2, // $750/year
  monthlyUtilitiesIncremental: 45, // $540/year
  monthlySuppliesAndConsumables: 35, // $420/year
  monthlyInsuranceAddon: 25, // $300/year specialized STR rider
  annualMaintenanceBudget: 400, // Touch-ups, linen wear
  airbnbHostServiceFeePct: 3.0,
  dcLodgingTaxPaidByGuestPct: 15.95,
  homeownerTaxRateIncomePct: 24.0, // Illustrative combined income tax assumption; not personal tax advice
  ownerHoursPerReservation: 2.5, // Check-in greeting, messaging, linen wash
  ownerOpportunityCostHourlyRate: 35, // Maya values her free time at $35/hr
};
/** Bound untrusted form values before arithmetic; preserve legitimate negative outcomes. */
export function normalizeProfile(input: HomeownerProfile): HomeownerProfile {
  const p = { ...input };
  const nonnegative: (keyof HomeownerProfile)[] = [
    "annualAvailableNights",
    "expectedOccupancyRate",
    "nightlyPrice",
    "averageStayLengthNights",
    "cleaningFeeChargedToGuest",
    "cleaningCostPaidPerStay",
    "initialFurnishingSetupCost",
    "setupCostAmortizationYears",
    "monthlyUtilitiesIncremental",
    "monthlySuppliesAndConsumables",
    "monthlyInsuranceAddon",
    "annualMaintenanceBudget",
    "airbnbHostServiceFeePct",
    "dcLodgingTaxPaidByGuestPct",
    "homeownerTaxRateIncomePct",
    "ownerHoursPerReservation",
    "ownerOpportunityCostHourlyRate",
  ];
  for (const key of nonnegative) {
    const value = Number(input[key]);
    (p as unknown as Record<string, unknown>)[key] = Number.isFinite(value)
      ? Math.max(0, Math.min(1e9, value))
      : 0;
  }
  p.annualAvailableNights = Math.min(365, p.annualAvailableNights);
  p.expectedOccupancyRate = Math.min(1, p.expectedOccupancyRate);
  p.averageStayLengthNights = Math.max(
    1,
    Math.min(365, p.averageStayLengthNights),
  );
  p.setupCostAmortizationYears = Math.max(1, p.setupCostAmortizationYears);
  p.airbnbHostServiceFeePct = Math.min(100, p.airbnbHostServiceFeePct);
  p.homeownerTaxRateIncomePct = Math.min(100, p.homeownerTaxRateIncomePct);
  p.dcLodgingTaxPaidByGuestPct = Math.min(100, p.dcLodgingTaxPaidByGuestPct);
  return p;
}
export type ScenarioId =
  | "baseline"
  | "demand_drop_25"
  | "price_war_15"
  | "cost_spike_20"
  | "severe_compound";
export function applyStressScenario(
  baseline: HomeownerProfile,
  scenario: ScenarioId,
): HomeownerProfile {
  const p = { ...baseline };
  if (scenario === "demand_drop_25" || scenario === "severe_compound")
    p.expectedOccupancyRate = baseline.expectedOccupancyRate * 0.75;
  if (scenario === "price_war_15" || scenario === "severe_compound")
    p.nightlyPrice = baseline.nightlyPrice * 0.85;
  if (scenario === "cost_spike_20" || scenario === "severe_compound") {
    p.cleaningCostPaidPerStay = baseline.cleaningCostPaidPerStay * 1.2;
    p.monthlyUtilitiesIncremental = baseline.monthlyUtilitiesIncremental * 1.2;
    p.monthlySuppliesAndConsumables =
      baseline.monthlySuppliesAndConsumables * 1.2;
    p.monthlyInsuranceAddon = baseline.monthlyInsuranceAddon * 1.2;
    p.annualMaintenanceBudget = baseline.annualMaintenanceBudget * 1.2;
  }
  return p;
}
export function hostingDecision(profile: HomeownerProfile) {
  const fin = calculateHostingFinancials(profile),
    legal = evaluateDcLegalCompliance(profile);
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  const financialScore = clamp(fin.economicProfitAfterSetupAndTax / 100);
  const legalScore = legal.isEligible ? 70 : 0;
  const breakEvenScore = clamp(100 - fin.breakEvenOccupancyPct);
  const laborScore =
    fin.totalHostLaborHoursPerYear === 0
      ? 0
      : clamp(
          (fin.effectiveHourlyWageEarned /
            Math.max(1, profile.ownerOpportunityCostHourlyRate)) *
            50,
        );
  const lifestyleScore = clamp(
    100 - (fin.actualBookedNightsProjected / 365) * 100,
  );
  const score = clamp(
    financialScore * 0.35 +
      legalScore * 0.3 +
      breakEvenScore * 0.2 +
      lifestyleScore * 0.15,
  );
  let verdict: "STOP" | "RECONSIDER" | "PILOT" | "PROCEED", reason: string;
  if (!legal.isEligible) {
    verdict = "STOP";
    reason = "The property fails the primary residence screening.";
  } else if (profile.averageStayLengthNights > 30) {
    verdict = "RECONSIDER";
    reason =
      "This short-term model does not cover stays longer than 30 nights.";
  } else if (
    fin.actualBookedNightsProjected === 0 ||
    fin.economicProfitAfterSetupAndTax <= 0 ||
    fin.breakEvenBookedNights > fin.actualBookedNightsProjected
  ) {
    verdict = "RECONSIDER";
    reason = "Projected bookings or profit do not cover modeled costs.";
  } else if (fin.trueEconomicSurplusAfterLabor <= 0) {
    verdict = "RECONSIDER";
    reason = "Profit does not compensate the imputed value of host labor.";
  } else if (
    fin.actualBookedNightsProjected < fin.breakEvenBookedNights * 2 ||
    fin.actualBookedNightsProjected > 90 ||
    profile.hasExemptionFor90NightLimit
  ) {
    verdict = "PILOT";
    reason =
      "Positive modeled surplus; validate demand, lifestyle and outstanding legal checks with a limited pilot.";
  } else {
    verdict = "PROCEED";
    reason =
      "Positive surplus and at least twice the modeled break-even bookings. Complete independent legal and license verification before listing.";
  }
  return {
    verdict,
    reason,
    score,
    financialScore,
    legalScore,
    breakEvenScore,
    laborScore,
    lifestyleScore,
  };
}
export const money = (value: number) =>
  Number.isFinite(value)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(value)
    : "Not achievable";
export const displayNumber = (value: number) =>
  Number.isFinite(value)
    ? value.toLocaleString("en-US", { maximumFractionDigits: 1 })
    : "Not achievable";
