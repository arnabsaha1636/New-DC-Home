import {
  HomeownerProfile,
  calculateHostingFinancials,
  evaluateDcLegalCompliance,
  hostingDecision,
  applyStressScenario,
  money,
  displayNumber,
  LEGAL_REVIEW_DATE,
  LEGAL_SOURCE,
  LEGAL_CODE_SOURCE,
  TAX_SOURCE,
} from "./calculator";
import {
  DC_CITY_SUMMARY,
  DATA_SOURCE,
  profileComparables,
} from "../data/dcMarketData";
export function buildReport(profile: HomeownerProfile) {
  const f = calculateHostingFinancials(profile),
    l = evaluateDcLegalCompliance(profile),
    d = hostingDecision(profile),
    c = profileComparables(profile),
    stress = calculateHostingFinancials(
      applyStressScenario(profile, "demand_drop_25"),
    );
  const sections = [
    {
      title: "1 — Deliverable links",
      paragraphs: [
        "Public app URL: [Add only after independently verifying public access]",
        "Zoom recording: [Add after recording and verifying the share link]",
        "This report reflects current inputs. It does not certify public hosting, license approval, or completion of an assignment.",
      ],
    },
    {
      title: "2 — Data sources and preparation",
      paragraphs: [
        `Inside Airbnb Washington, DC snapshot ${DATA_SOURCE.snapshotDate}: ${DC_CITY_SUMMARY.totalListings.toLocaleString()} records across ${DC_CITY_SUMMARY.neighborhoodCount} neighborhood groups; ${DC_CITY_SUMMARY.listingsWithPrice.toLocaleString()} valid prices; ${DC_CITY_SUMMARY.missingPriceCount} missing/invalid prices excluded from price statistics. Citywide all-room median ${money(DC_CITY_SUMMARY.medianAdvertisedPrice!)}, mean ${money(DC_CITY_SUMMARY.meanAdvertisedPrice!)}.`,
        `${profile.neighborhood}: matching ${c.roomType} listings with minimum stays under 30 nights and no longer than the modeled ${profile.averageStayLengthNights}-night stay. Sample ${c.listingCount}; priced ${c.pricedListings}; missing ${c.missingPriceCount}. Median ${c.medianAdvertisedPrice === null ? "unavailable" : money(c.medianAdvertisedPrice)}, mean ${c.meanAdvertisedPrice === null ? "unavailable" : money(c.meanAdvertisedPrice)}, Q1 ${c.q1 === null ? "unavailable" : money(c.q1)}, Q3 ${c.q3 === null ? "unavailable" : money(c.q3)}.`,
        `Price is advertised asking price, not realized ADR. Calendar availability is not bookings or occupancy. License strings are self-reported. Quartiles interpolate at (n − 1) × percentile.`,
      ],
    },
    {
      title: "3 — Business questions and current results",
      paragraphs: [
        `${profile.name} models ${profile.annualAvailableNights} available nights, ${(profile.expectedOccupancyRate * 100).toFixed(1)}% occupancy, ${money(profile.nightlyPrice)} nightly price and ${profile.averageStayLengthNights}-night average stays. Legal screening: ${l.licenseCategory}. All declarations remain unverified.`,
        `${f.actualBookedNightsProjected} projected booked nights; ${f.totalReservationsCount} reservations. Lodging revenue ${money(f.grossNightlyRevenue)} + cleaning receipts ${money(f.cleaningFeesCollected)} = turnover ${money(f.grossGuestTurnover)}. Platform fees ${money(f.airbnbPlatformFee)}; cleaning cost ${money(f.cleaningServiceExpenses)}; cleaning margin ${money(f.netCleaningMargin)}.`,
        `Total cash operating expenses ${money(f.totalCashOperatingCosts)}; pre-tax operating cash flow ${money(f.netOperatingCashFlow)}. Setup amortization ${money(f.annualSetupAmortization)}; modeled income tax ${money(f.estimatedIncomeTaxLiability)} at ${profile.homeownerTaxRateIncomePct}%. Profit after setup and modeled tax ${money(f.economicProfitAfterSetupAndTax)}; cash flow after modeled tax ${money(f.netCashFlowAfterIncomeTax)}.`,
      ],
    },
    {
      title: "4 — Features and interpretation",
      paragraphs: [
        `Overview, legal screening, room-matched market filters, profit calculator, baseline-relative simulator, decision scorecard and guided 2:45 walkthrough share calculated figures. Host labor ${displayNumber(f.totalHostLaborHoursPerYear)} hours, imputed value ${money(f.valueHostTimeImputed)}, hourly return before imputed labor ${money(f.effectiveHourlyWageEarned)}, surplus after labor ${money(f.trueEconomicSurplusAfterLabor)}.`,
        `Operating-cost break-even: ${displayNumber(f.breakEvenBookedNights)} nights / ${displayNumber(f.breakEvenOccupancyPct)}% of legally usable availability. Method: fixed annual costs plus setup amortization divided by average nightly contribution after platform and cleaning costs; ceiling to whole nights. Excludes income tax and imputed labor; approximates reservation rounding.`,
      ],
    },
    {
      title: "5 — Decision value and risk",
      paragraphs: [
        `Demand shock reduces the homeowner baseline occupancy by 25% relative, producing ${stress.actualBookedNightsProjected} nights, ${money(stress.grossGuestTurnover)} turnover, ${money(stress.netOperatingCashFlow)} pre-tax cash flow and ${money(stress.economicProfitAfterSetupAndTax)} profit after setup and modeled tax. Price shock reduces the baseline rate 15%; cost shock raises cleaning, utilities, supplies, insurance and maintenance 20%. Scenarios never compound when switching.`,
        `Current recommendation: ${d.verdict}. ${d.reason} Weighted index ${d.score}/100: financial 35%, legal screening 30%, break-even 20%, lifestyle 15%. These are heuristic scores, not measured probabilities.`,
        `The application consolidates analysis and exposes costs omitted by gross-price comparisons. No time savings have been measured, and no long-term rental outperformance is claimed. Income tax uses a simplified positive-profit assumption and is not personalized tax advice.`,
      ],
    },
    {
      title: "6 — Observed error and correction",
      paragraphs: [
        `The inspected source hardcoded $9,521 profit and $95.21/hour in the overview, walkthrough and report even though its baseline calculator returned different results. Simulator shocks also used fixed Maya values rather than the homeowner inputs. These are observable source inconsistencies; the authorship and earlier development history are unverified.`,
        `The corrected views call the shared calculator and scenario functions. Regression tests assert the specified baseline, zero occupancy, negative outcomes, legal limits, extreme inputs, data counts, filters and baseline-relative shocks. Running type checking does not automatically run tests; use the documented validation commands and inspect their actual output.`,
      ],
    },
    {
      title: "7 — Legal sources, provenance and tools",
      paragraphs: [
        `Legal sources reviewed ${LEGAL_REVIEW_DATE}: DLCP requirements; DC Code § 30-201.06; OTR transient accommodations notice. Hosted primary-residence screening has no annual statutory cap; this model uses 365 days. Standard unhosted cap is 90 nights. Exemption declarations remain unverified and do not expand the modeled cap.`,
        `Source CSV retained with the project. SHA-256: ${DATA_SOURCE.sha256}. Normalized listing data is reproducible using the import script. The original project dataset PDF is preserved.`,
        `Codex assisted this update. Earlier AI model names, claimed browser verification and measured development history are unverified. Public app and Zoom links remain placeholders. Verify residence, licensing, restrictions, insurance and tax responsibilities independently before listing.`,
      ],
    },
  ];
  return {
    sections,
    text:
      "StayWise DC — Current Homeowner Decision Report\n\n" +
      sections
        .map((s) => s.title + "\n" + s.paragraphs.join("\n"))
        .join("\n\n"),
    sources: [
      DATA_SOURCE.sourceUrl,
      LEGAL_SOURCE,
      LEGAL_CODE_SOURCE,
      TAX_SOURCE,
    ],
  };
}
