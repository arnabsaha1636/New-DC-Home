import records from "./listings.json";
export type RoomType =
  "Entire home/apt" | "Private room" | "Hotel room" | "Shared room";
export interface Listing {
  id: string;
  neighborhood: string;
  roomType: string;
  price: number | null;
  minimumNights: number;
  availability365: number;
  reviewsLast12Months: number;
  license: string;
}
export const DC_LISTINGS: Listing[] = records;
export const DATA_SOURCE = {
  snapshotDate: "2026-09-19",
  sourceUrl:
    "https://data.insideairbnb.com/united-states/dc/washington-dc/2026-09-19/visualisations/listings.csv",
  sha256: "adf5f22a93a6bae1bfa7aed60994e382415666ecf563994035d80d760bd9f268",
};
export interface MarketFilters {
  neighborhood?: string;
  roomType?: string;
  stay?: "all" | "short" | "long";
  maxMinimumNights?: number;
}
export function filterListings(
  listings: Listing[],
  filters: MarketFilters = {},
) {
  return listings.filter(
    (r) =>
      (!filters.neighborhood || r.neighborhood === filters.neighborhood) &&
      (!filters.roomType || r.roomType === filters.roomType) &&
      (filters.stay !== "short" || r.minimumNights < 30) &&
      (filters.stay !== "long" || r.minimumNights >= 30) &&
      (filters.maxMinimumNights === undefined ||
        r.minimumNights <= filters.maxMinimumNights),
  );
}
/** Linear interpolation at (n - 1) * p, including single-element samples. */
export function quantile(sorted: number[], p: number): number | null {
  if (!sorted.length) return null;
  const i = (sorted.length - 1) * p,
    lo = Math.floor(i),
    hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}
export function summarizeListings(listings: Listing[]) {
  const prices = listings
    .map((r) => r.price)
    .filter((p): p is number => p !== null && Number.isFinite(p) && p > 0)
    .sort((a, b) => a - b);
  return {
    listingCount: listings.length,
    pricedListings: prices.length,
    missingPriceCount: listings.length - prices.length,
    medianAdvertisedPrice: quantile(prices, 0.5),
    meanAdvertisedPrice: prices.length
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : null,
    q1: quantile(prices, 0.25),
    q3: quantile(prices, 0.75),
    entireHomeCount: listings.filter((r) => r.roomType === "Entire home/apt")
      .length,
    privateRoomCount: listings.filter((r) => r.roomType === "Private room")
      .length,
    hotelRoomCount: listings.filter((r) => r.roomType === "Hotel room").length,
    sharedRoomCount: listings.filter((r) => r.roomType === "Shared room")
      .length,
    withReviewsLast12Months: listings.filter((r) => r.reviewsLast12Months > 0)
      .length,
    minStay30PlusCount: listings.filter((r) => r.minimumNights >= 30).length,
    licenseFieldNonEmptyCount: listings.filter((r) => r.license.trim()).length,
    meanAvailableNights365: listings.length
      ? listings.reduce((a, r) => a + r.availability365, 0) / listings.length
      : 0,
  };
}
export const NEIGHBORHOOD_NAMES = [
  ...new Set(DC_LISTINGS.map((r) => r.neighborhood)),
].sort();
export const DC_NEIGHBORHOODS = NEIGHBORHOOD_NAMES.map((neighborhood) => ({
  neighborhood,
  ...summarizeListings(filterListings(DC_LISTINGS, { neighborhood })),
}));
export type NeighborhoodData = (typeof DC_NEIGHBORHOODS)[number];
const city = summarizeListings(DC_LISTINGS);
export const DC_CITY_SUMMARY = {
  ...DATA_SOURCE,
  totalListings: city.listingCount,
  listingsWithPrice: city.pricedListings,
  missingPriceCount: city.missingPriceCount,
  medianAdvertisedPrice: city.medianAdvertisedPrice,
  meanAdvertisedPrice: city.meanAdvertisedPrice,
  privateRooms: city.privateRoomCount,
  hotelRooms: city.hotelRoomCount,
  sharedRooms: city.sharedRoomCount,
  entireHomes: city.entireHomeCount,
  neighborhoodCount: NEIGHBORHOOD_NAMES.length,
  minStay30PlusCount: city.minStay30PlusCount,
  withReviewsLast12Months: city.withReviewsLast12Months,
  nonEmptyLicenseCount: city.licenseFieldNonEmptyCount,
};
export function profileComparables(profile: {
  neighborhood: string;
  rentalScope: string;
  averageStayLengthNights: number;
}) {
  const roomType =
    profile.rentalScope === "spare_room" ? "Private room" : "Entire home/apt";
  return {
    roomType,
    ...summarizeListings(
      filterListings(DC_LISTINGS, {
        neighborhood: profile.neighborhood,
        roomType,
        stay: "short",
        maxMinimumNights: profile.averageStayLengthNights,
      }),
    ),
  };
}
