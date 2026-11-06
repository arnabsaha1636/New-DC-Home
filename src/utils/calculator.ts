/**
 * Pure calculation logic and rules for StayWise DC.
 * Evaluates DC Legal Eligibility (Hosted vs Vacation Rental, 90-night limit, licensing)
 * and detailed homeowner financial profit models, tax, cleaning, startup amortizations,
 * and stress test scenarios.
 */

export type PropertyType = 'rowhouse' | 'condo' | 'single_family' | 'apartment';
export type RentalScope = 'spare_room' | 'entire_home' | 'basement_suite';

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
  dcLodgingTaxPaidByGuestPct: number; // 15.0% DC Sales and Use Tax on Transient Lodging
  homeownerTaxRateIncomePct: number; // e.g., 25% marginal tax estimate
  ownerHoursPerReservation: number; // cleaning, guest comms, check-in
  ownerOpportunityCostHourlyRate: number; // e.g., $30/hr valuation of personal free time
}

export interface LegalComplianceResult {
  licenseCategory: 'Hosted License' | 'Vacation Rental License' | 'Ineligible';
  isEligible: boolean;
  annualNightCap: number | 'Unlimited';
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
  dcLodgingTaxRemittedByAirbnb: number; // 15% collected directly by Airbnb
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
 * DC Code Title 47 Chapter 28 / DLCP STR Regulations:
 * - Hosted License: Owner must be present during stay, property must be owner's primary residence (Homestead deduction). Unlimited nights.
 * - Vacation Rental (Unhosted): Owner absent during stay. Primary residence required. STRICT 90-NIGHT CUMULATIVE CALENDAR YEAR CAP unless DLCP grants an employer/military temporary relocation exemption.
 * - Non-primary residences: Ineligible for short-term rental in DC (must be leased 30+ days).
 */
export function evaluateDcLegalCompliance(profile: HomeownerProfile): LegalComplianceResult {
  const warnings: string[] = [];
  const mandatoryRequirements: string[] = [];
  const unresolvedVerificationItems: string[] = [];

  // 1. Primary residence check
  if (!profile.isPrimaryResidence) {
    return {
      licenseCategory: 'Ineligible',
      isEligible: false,
      annualNightCap: 0,
      nightCapEnforcedValue: 0,
      capReason: "DC Short-Term Rental Regulation Act requires the property to be the applicant's primary residence (eligible for the DC Homestead deduction). Non-primary residences may only be rented for 30 consecutive days or more.",
      warnings: ["Non-primary properties cannot obtain a DC Short-Term Rental or Vacation Rental license."],
      mandatoryRequirements: [
        "Must verify DC Homestead deduction status with DC Office of Tax and Revenue",
        "Minimum 30-night lease required for non-primary properties"
      ],
      unresolvedVerificationItems: ["Primary residence proof (valid DC Driver's license/voter registration)"]
    };
  }

  // 2. Hosted vs Vacation Rental
  if (profile.hostPresentDuringStays) {
    mandatoryRequirements.push(
      "DC Department of Licensing and Consumer Protection (DLCP) Basic Business License (BBL) with Short-Term Rental Endorsement ($104.50 fee)",
      "Continuous primary residence occupancy by host during guest reservations",
      "Functioning smoke alarms, carbon monoxide detectors, and fire extinguisher in guest quarters",
      "Posting of emergency contact info and DLCP license certificate inside the bedroom",
      "Remittance of 15.0% DC Sales and Use Tax on Transient Lodging (Airbnb collects automatically)"
    );

    unresolvedVerificationItems.push(
      "Confirm clean Certificate of Clean Hands from DC Office of Tax and Revenue (no delinquent DC taxes)",
      "Check HOA / condo bylaws or mortgage restrictions for short-term rental prohibitions",
      "Notify homeowner's insurance policy carrier of commercial short-term guest hosting activity"
    );

    return {
      licenseCategory: 'Hosted License',
      isEligible: true,
      annualNightCap: 'Unlimited',
      nightCapEnforcedValue: 365,
      capReason: "Under DC law, hosted short-term rentals (where the homeowner is present on site throughout the stay) have no statutory annual night cap.",
      warnings,
      mandatoryRequirements,
      unresolvedVerificationItems
    };
  } else {
    // Vacation rental (unhosted - host absent)
    const hasExemption = !!profile.hasExemptionFor90NightLimit;
    const maxNights = hasExemption ? 180 : 90;

    mandatoryRequirements.push(
      "DLCP Vacation Rental License Endorsement ($104.50 fee)",
      "Strict compliance with 90 cumulative unhosted nights per calendar year (unless DLCP temporary relocation exemption granted)",
      "Designation of a DC-based emergency contact available 24/7 within 2 hours response time",
      "Written notification to adjacent neighbors of short-term vacation rental operation"
    );

    warnings.push("DC Vacation Rental Law limits unhosted rentals to 90 nights per year. Platform data is monitored by DLCP.");

    if (profile.annualAvailableNights > 90 && !hasExemption) {
      warnings.push(`Modeled available nights (${profile.annualAvailableNights}) exceeds the legal 90-night limit without an approved DLCP exemption. Projections must be capped at 90 nights.`);
    }

    unresolvedVerificationItems.push(
      "Verification of primary residence Homestead deduction",
      "Application for DLCP Vacation Rental Exemption if temporary military/employer relocation exceeds 90 nights (max 180 nights)",
      "Neighbor notification records and designated 24/7 emergency contact in the District"
    );

    return {
      licenseCategory: 'Vacation Rental License',
      isEligible: true,
      annualNightCap: maxNights,
      nightCapEnforcedValue: maxNights,
      capReason: hasExemption
        ? "Approved for DC DLCP Temporary Relocation Exemption (up to 180 nights max unhosted)."
        : "DC Code limits unhosted Vacation Rentals to a strict statutory cap of 90 nights per calendar year.",
      warnings,
      mandatoryRequirements,
      unresolvedVerificationItems
    };
  }
}

/**
 * Computes complete financial outcomes based on property assumptions and legal constraints.
 */
export function calculateHostingFinancials(profile: HomeownerProfile): FinancialBreakdown {
  const legal = evaluateDcLegalCompliance(profile);

  // Effective available nights bounded by legal restriction
  const requestedAvailable = Math.max(0, profile.annualAvailableNights);
  const legalNightCap = legal.nightCapEnforcedValue;
  const effectiveBookableNights = Math.min(requestedAvailable, legalNightCap);

  // Projected booked nights based on expected occupancy
  const boundedOccupancy = Math.max(0, Math.min(1, profile.expectedOccupancyRate));
  const actualBookedNights = Math.round(effectiveBookableNights * boundedOccupancy);

  // Stay count
  const avgStay = Math.max(1, profile.averageStayLengthNights);
  const totalReservations = actualBookedNights > 0 ? Math.ceil(actualBookedNights / avgStay) : 0;

  // Inflows
  const grossNightlyRevenue = actualBookedNights * profile.nightlyPrice;
  const cleaningFeesCollected = totalReservations * profile.cleaningFeeChargedToGuest;
  const grossGuestTurnover = grossNightlyRevenue + cleaningFeesCollected;

  // Platform Fee (typically 3% of host payout subtotal: nightly + cleaning charged)
  const airbnbPlatformFee = grossGuestTurnover * (profile.airbnbHostServiceFeePct / 100);

  // Cleaning Outflow
  const cleaningServiceExpenses = totalReservations * profile.cleaningCostPaidPerStay;
  const netCleaningMargin = cleaningFeesCollected - cleaningServiceExpenses;

  // Annual Fixed & Operating Costs
  const annualIncrementalUtilities = profile.monthlyUtilitiesIncremental * 12;
  const annualSupplies = profile.monthlySuppliesAndConsumables * 12;
  const annualInsurance = profile.monthlyInsuranceAddon * 12;
  const annualMaintenance = profile.annualMaintenanceBudget;

  // Amortization of setup cost
  const amortYears = Math.max(1, profile.setupCostAmortizationYears || 1);
  const annualSetupAmortization = profile.initialFurnishingSetupCost / amortYears;

  // Cash operating costs (excluding setup amortization)
  const totalCashOperatingCosts =
    airbnbPlatformFee +
    cleaningServiceExpenses +
    annualIncrementalUtilities +
    annualSupplies +
    annualInsurance +
    annualMaintenance;

  const totalEconomicCostsWithAmortization = totalCashOperatingCosts + annualSetupAmortization;

  // DC Lodging Tax (15.0% - automatically collected from guest and remitted to DC OTR by Airbnb)
  const dcLodgingTaxRemittedByAirbnb = grossGuestTurnover * (profile.dcLodgingTaxPaidByGuestPct / 100);

  // Estimated Taxable Income (Gross Payout minus allowable ordinary hosting expenses)
  const hostNetPayout = grossGuestTurnover - airbnbPlatformFee;
  const allowableDeductions =
    cleaningServiceExpenses +
    annualIncrementalUtilities +
    annualSupplies +
    annualInsurance +
    annualMaintenance +
    annualSetupAmortization;

  const estimatedTaxableIncome = Math.max(0, hostNetPayout - allowableDeductions);
  const estimatedIncomeTaxLiability = estimatedTaxableIncome * (profile.homeownerTaxRateIncomePct / 100);

  // Net Cash Flow Before and After Income Tax
  const netOperatingCashFlow = grossGuestTurnover - totalCashOperatingCosts;
  const netCashFlowAfterIncomeTax = netOperatingCashFlow - estimatedIncomeTaxLiability;
  const economicProfitAfterSetupAndTax = grossGuestTurnover - totalEconomicCostsWithAmortization - estimatedIncomeTaxLiability;

  // Labor & Opportunity Cost
  const totalHostLaborHoursPerYear = totalReservations * profile.ownerHoursPerReservation;
  const valueHostTimeImputed = totalHostLaborHoursPerYear * profile.ownerOpportunityCostHourlyRate;
  const trueEconomicSurplusAfterLabor = economicProfitAfterSetupAndTax - valueHostTimeImputed;

  const effectiveHourlyWageEarned =
    totalHostLaborHoursPerYear > 0
      ? economicProfitAfterSetupAndTax / totalHostLaborHoursPerYear
      : 0;

  // Break-even nights:
  // Fixed costs per year = utilities + supplies + insurance + maintenance + setupAmort
  const annualFixedCosts = annualIncrementalUtilities + annualSupplies + annualInsurance + annualMaintenance + annualSetupAmortization;
  // Per night contribution margin:
  // Nightly Price + (CleaningFeeCharged / avgStay) - (PlatformFee on nightly+cleaning) - (CleaningPaid / avgStay)
  const perStayCleaningDiff = profile.cleaningFeeChargedToGuest - profile.cleaningCostPaidPerStay;
  const revenuePerNight = profile.nightlyPrice + (profile.cleaningFeeChargedToGuest / avgStay);
  const variableCostPerNight = (revenuePerNight * (profile.airbnbHostServiceFeePct / 100)) + (profile.cleaningCostPaidPerStay / avgStay);
  const contributionMarginPerNight = revenuePerNight - variableCostPerNight;

  let breakEvenBookedNights = 0;
  if (contributionMarginPerNight > 0) {
    breakEvenBookedNights = Math.ceil(annualFixedCosts / contributionMarginPerNight);
  } else {
    breakEvenBookedNights = 999;
  }

  const breakEvenOccupancyPct =
    effectiveBookableNights > 0
      ? Math.min(100, Math.round((breakEvenBookedNights / effectiveBookableNights) * 100))
      : 0;

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
  expectedOccupancyRate: 0.50, // 50%
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
  dcLodgingTaxPaidByGuestPct: 15.0,
  homeownerTaxRateIncomePct: 24.0, // Federal 22% + DC ~6% minus deductions estimate
  ownerHoursPerReservation: 2.5, // Check-in greeting, messaging, linen wash
  ownerOpportunityCostHourlyRate: 35, // Maya values her free time at $35/hr
};
