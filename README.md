# StayWise DC

Upgrade of the existing `arnabsaha1636/New-DC-Home` application. The original slate/amber design, six navigation tabs, guided walkthrough and submission workflow are retained.

## Repository structure

```text
index.html                     Vite HTML entry and metadata
src/main.tsx                   React mount and stylesheet
src/App.tsx                    Shared homeowner state and six-tab navigation
src/components/
  LegalEligibilitySection.tsx  User-declared legal screening and source links
  MarketExplorerSection.tsx    Listing-level market filters and comparisons
  FinancialDashboardSection.tsx Live assumptions and financial waterfall
  StressSimulatorSection.tsx   Baseline-relative scenario previews and reset
  DecisionDashboardSection.tsx Conditional verdict, scores and action roadmap
  GuidedDemoBar.tsx            Current-results 2:45 presentation timeline
  SubmissionPackageModal.tsx   Report, script, provenance, checklist and print
src/utils/calculator.ts        Shared financial, screening, scenario and decision engine
src/utils/report.ts            Current-input report content
src/utils/*.test.ts            Calculator and regression tests
src/data/dcMarketData.ts       Listing filters, quartiles and derived aggregates
src/data/listingParser.ts      Quoted/multiline CSV parser
src/data/listings.json         Reproducible normalized 6,906-record snapshot
src/data/market.test.ts        Dataset integrity and comparison tests
public/assets/dc-listings-2026-09-19.csv Original 19-column source CSV
public/assets/aistudio/        Preserved original dataset PDF
.aistudio/                    Preserved original screenshots
scripts/import-data.ts         Deterministic CSV-to-JSON import and validation
scripts/clean.mjs              Project-scoped generated-output cleanup
playwright.config.ts, e2e/     Production-preview browser tests
vite.config.ts, tsconfig.json  Build and TypeScript configuration
package.json, package-lock.json npm scripts and dependency lock
```

The inspected original repository had one `main` branch, seven UI components, one calculator module, four calculation tests, static neighborhood aggregates, a Bun lock, the PDF and two screenshots. It had no backend, test script, README or CI configuration. No unrelated files or history were discarded. The stale Bun lock is replaced by the tested npm lock.

## Run and validate

Use Node.js 24 or newer and npm. No API key is required for the current client-side features.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite serves the **production build** at `127.0.0.1:4173`; build first. Set `PLAYWRIGHT_CHANNEL=chrome` to use installed Chrome instead of a downloaded Chromium. Tests cover all navigation tabs, original sliders, extra model inputs, market controls, scenario switching/reset, legal screening, recommendation changes, report copying/printing, walkthrough completion, essential assets and 390px mobile layout. Browser artifacts are generated under ignored `test-results/`.

## Data provenance

- Snapshot: September 19, 2026, Inside Airbnb Washington, DC.
- Original URL: https://data.insideairbnb.com/united-states/dc/washington-dc/2026-09-19/visualisations/listings.csv
- Original CSV SHA-256: `adf5f22a93a6bae1bfa7aed60994e382415666ecf563994035d80d760bd9f268`.
- 6,906 unique listing IDs; 5,993 positive numeric prices; 913 missing prices; 39 neighborhood groups.
- IDs remain strings to preserve values above JavaScript's safe-integer range.
- The original 19-column CSV and original project PDF are preserved. The normalized JSON contains the fields used by the application.
- Regenerate and validate the JSON with `npm run data:import`; then run the tests and build. Import does not silently download or substitute a newer snapshot.

All aggregates are computed from listings. Filters intersect neighborhood, room type, minimum stay market and maximum accepted listing minimum nights. Price statistics exclude null, nonfinite and nonpositive values; empty samples display unavailable, not zero. Quartiles interpolate at `(n - 1) * percentile`. Applying a median changes both the modeled room scope and asking price, without an arbitrary percentage discount. Basement suites use entire-home comparisons as a disclosed approximation.

Advertised prices are not realized ADR, bookings, occupancy or revenue. `availability_365` is never converted into paid nights. License fields are self-reported, not verified approvals.

## Financial model

The calculator is the shared source for dashboard KPIs, overview answers, scenarios, recommendations, walkthrough scripts and report figures.

| Maya baseline metric                             |                         Result |
| ------------------------------------------------ | -----------------------------: |
| Available nights × assumed occupancy             |                      240 × 50% |
| Projected booked nights / reservations           |                       120 / 40 |
| Nightly revenue / guest cleaning receipts        |               $15,000 / $1,600 |
| Turnover / cash operating costs                  |               $16,600 / $4,358 |
| Operating cash flow before modeled income tax    |                        $12,242 |
| Annual setup amortization                        |                           $750 |
| Modeled income tax                               |                      $2,758.08 |
| Cash flow after modeled income tax               |                      $9,483.92 |
| Profit after setup and modeled tax, before labor |                      $8,733.92 |
| Imputed labor value / surplus after labor        |             $3,500 / $5,233.92 |
| Effective hourly return before imputed labor     |                       $87.3392 |
| Operating-cost break-even                        | 21 nights / 8.8% of 240 nights |

Booked nights round to whole nights. Reservations use `ceil(booked nights / average stay)`. Host platform fees include guest cleaning receipts. Fixed expenses remain when occupancy is zero; modeled losses do not create income-tax credits. Upfront setup cash spending is modeled through annual amortization, not as an additional annual cash expense; the dashboard is an annual operating model, not a first-year capital-cash schedule. Income tax is a simplified positive-profit assumption after modeled expenses and setup amortization, not personal tax advice or a claim about allowed deductions. Guest lodging tax is shown separately and does not reduce modeled host revenue.

Break-even is `ceil((fixed annual expenses + setup amortization) / average nightly contribution)`. Contribution includes cleaning receipts, platform fees and cleaning costs per average stay. This operating-cost method excludes income tax and imputed labor and approximates fractional stays. Unreachable break-even is displayed as not achievable; occupancy requirements are allowed to exceed 100%.

Inputs are bounded to prevent invalid or nonfinite arithmetic. Legal caps bound available nights before applying assumed occupancy, conservatively matching the original model's convention. Recommendations are transparent heuristics, not guarantees or verified legal authorization.

## Legal screening

Sources reviewed November 7, 2026:

- https://dlcp.dc.gov/service/short-term-rentals
- https://code.dccouncil.gov/us/dc/council/code/sections/30-201.06
- https://otr.cfo.dc.gov/release/notice-oct-1-2025-tax-changes

Hosted primary-residence screening has no annual statutory cap; the annual model uses at most 365 days. Unhosted vacation rental projections retain the standard 90-night cap. Exemption declarations are unverified and **do not expand this model's cap**. The statute provides individualized approved periods; the previous blanket 180-night assumption is removed. Residence, Homestead status, license, restrictions and exemption approvals require independent verification. OTR's 15.95% guest lodging-tax assumption is editable and does not change the specified homeowner profit example.

## Reports and scope

Report text and presentation figures update with current inputs. The report print layout uses two Letter pages; browser tests generate a PDF and local QA verifies its page count and rendering. A manual review checklist is unchecked by default. Public app and Zoom URLs remain explicit placeholders until independently verified. Earlier model versions, development-history claims, measured time savings and deployment claims are not invented.

This change does not deploy the application or add a backend. The full listing dataset is bundled locally so comparisons work without an external data API. The production JavaScript is larger than Vite's default chunk advisory because it includes the complete offline snapshot (about 261 kB gzipped in the verified build).

## GitHub Pages hosting

`npm run build:pages` builds the existing application for `/New-DC-Home/` without adding a server or creating another repository. Asset and CSV download URLs use Vite's base URL. A compiled `gh-pages` branch can be selected under this repository's Settings > Pages > Deploy from a branch > gh-pages > /(root).

After changing the source, rerun type checking, tests and the Pages build before updating the compiled hosting branch. The source fix branch and pull request remain separate from the hosting artifacts. Do not replace the source `main` branch with `dist/` files.

To validate the project-path build locally on installed Chrome in PowerShell:

```powershell
npm run build:pages
$env:PLAYWRIGHT_CHANNEL='chrome'
$env:PLAYWRIGHT_BASE_PATH='/New-DC-Home/'
npm run test:e2e
```

The Pages URL must be verified after deployment; a conventional github.io address alone is not evidence that the app is live.
