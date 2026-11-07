import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import {
  DC_LISTINGS,
  DC_CITY_SUMMARY,
  DATA_SOURCE,
  NEIGHBORHOOD_NAMES,
  filterListings,
  summarizeListings,
  quantile,
  profileComparables,
} from "./dcMarketData";
import { parseCsv } from "./listingParser";
import { MAYA_PETWORTH_BASE_CASE } from "../utils/calculator";
test("Source integrity and all 6,906 unique records reproduce required counts", () => {
  assert.equal(DC_LISTINGS.length, 6906);
  assert.equal(new Set(DC_LISTINGS.map((r) => r.id)).size, 6906);
  assert.equal(DC_CITY_SUMMARY.listingsWithPrice, 5993);
  assert.equal(DC_CITY_SUMMARY.missingPriceCount, 913);
  assert.equal(NEIGHBORHOOD_NAMES.length, 39);
  assert.equal(DC_CITY_SUMMARY.medianAdvertisedPrice, 214);
  const source = fs.readFileSync(
    "public/assets/dc-listings-2026-09-19.csv",
    "utf8",
  );
  assert.equal(
    createHash("sha256").update(source).digest("hex"),
    DATA_SOURCE.sha256,
  );
  assert.equal(parseCsv(source).length, 6907);
});
test("CSV parsing preserves embedded commas, quotes, newlines, empty prices and large string IDs", () => {
  assert.deepEqual(
    parseCsv('id,name,price\r\n1774988785470407882,"A, ""B""\nC",\r\n'),
    [
      ["id", "name", "price"],
      ["1774988785470407882", 'A, "B"\nC', ""],
    ],
  );
  assert.throws(() => parseCsv('"unclosed'));
});
test("Neighborhood, room-type and minimum-night filters intersect without inventing occupancy", () => {
  const rows = filterListings(DC_LISTINGS, {
    neighborhood: MAYA_PETWORTH_BASE_CASE.neighborhood,
    roomType: "Private room",
    stay: "short",
    maxMinimumNights: 3,
  });
  assert.ok(rows.length > 0);
  assert.ok(
    rows.every(
      (r) =>
        r.neighborhood === MAYA_PETWORTH_BASE_CASE.neighborhood &&
        r.roomType === "Private room" &&
        r.minimumNights <= 3,
    ),
  );
  assert.equal(
    profileComparables(MAYA_PETWORTH_BASE_CASE).listingCount,
    rows.length,
  );
  const long = filterListings(DC_LISTINGS, { stay: "long" }),
    short = filterListings(DC_LISTINGS, { stay: "short" });
  assert.equal(long.length + short.length, 6906);
  assert.equal(long.length, 1979);
});
test("Empty and invalid price samples show missing data, not zero price; quartiles interpolate", () => {
  assert.equal(summarizeListings([]).medianAdvertisedPrice, null);
  assert.equal(quantile([10, 20, 30, 40], 0.25), 17.5);
  assert.equal(quantile([10], 0.75), 10);
  const r = DC_LISTINGS[0],
    s = summarizeListings([
      { ...r, price: null },
      { ...r, price: -5 },
      { ...r, price: NaN },
      { ...r, price: 80 },
    ]);
  assert.equal(s.pricedListings, 1);
  assert.equal(s.medianAdvertisedPrice, 80);
  assert.equal(s.missingPriceCount, 3);
});
test("All aggregate group totals equal the complete listing dataset", () => {
  const sums = NEIGHBORHOOD_NAMES.map((neighborhood) =>
    summarizeListings(filterListings(DC_LISTINGS, { neighborhood })),
  );
  assert.equal(
    sums.reduce((a, r) => a + r.listingCount, 0),
    6906,
  );
  assert.equal(
    sums.reduce((a, r) => a + r.pricedListings, 0),
    5993,
  );
});
