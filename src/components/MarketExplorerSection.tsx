import React, { useMemo, useState } from "react";
import { MapPin, Search, Filter } from "lucide-react";
import {
  DC_LISTINGS,
  DC_CITY_SUMMARY,
  DATA_SOURCE,
  NEIGHBORHOOD_NAMES,
  filterListings,
  summarizeListings,
} from "../data/dcMarketData";
import { HomeownerProfile, money } from "../utils/calculator";
interface Props {
  profile: HomeownerProfile;
  onSelectNeighborhood: (
    neighborhood: string,
    medianPrice: number,
    roomType?: string,
  ) => void;
}
export const MarketExplorerSection: React.FC<Props> = ({
  profile,
  onSelectNeighborhood,
}) => {
  const [search, setSearch] = useState("");
  const [neighborhood, setNeighborhood] = useState(profile.neighborhood);
  const [roomType, setRoomType] = useState(
    profile.rentalScope === "spare_room" ? "Private room" : "Entire home/apt",
  );
  const [stay, setStay] = useState<"all" | "short" | "long">("short");
  const [maxMinimum, setMaxMinimum] = useState(
    String(profile.averageStayLengthNights),
  );
  const [sort, setSort] = useState("listings");
  const filters = {
    roomType: roomType || undefined,
    stay,
    maxMinimumNights: maxMinimum === "" ? undefined : Number(maxMinimum),
  };
  const filtered = useMemo(
    () => filterListings(DC_LISTINGS, filters),
    [roomType, stay, maxMinimum],
  );
  const sample = summarizeListings(
    filtered.filter((r) => !neighborhood || r.neighborhood === neighborhood),
  );
  const groups = NEIGHBORHOOD_NAMES.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase()),
  )
    .map((n) => ({
      neighborhood: n,
      ...summarizeListings(filtered.filter((r) => r.neighborhood === n)),
    }))
    .sort((a, b) =>
      sort === "price"
        ? (b.medianAdvertisedPrice ?? -1) - (a.medianAdvertisedPrice ?? -1)
        : sort === "availability"
          ? b.meanAvailableNights365 - a.meanAvailableNights365
          : b.listingCount - a.listingCount,
    );
  const rate = (n: number | null) =>
    n === null ? "No priced sample" : money(n);
  const canUse =
    sample.medianAdvertisedPrice !== null &&
    !!neighborhood &&
    ["Private room", "Entire home/apt"].includes(roomType);
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold flex gap-2">
            <MapPin className="text-emerald-400" />
            Inside Airbnb — Washington, DC Market Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Snapshot {DATA_SOURCE.snapshotDate} ·{" "}
            {DC_CITY_SUMMARY.totalListings.toLocaleString()} listings ·{" "}
            {DC_CITY_SUMMARY.neighborhoodCount} neighborhood groups
          </p>
        </div>
        <p className="text-xs text-amber-300">
          All-room city median: {rate(DC_CITY_SUMMARY.medianAdvertisedPrice)}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <label>
          Neighborhood
          <select
            aria-label="Comparable neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full bg-slate-950 p-2 mt-1 border border-slate-700 rounded"
          >
            <option value="">All DC neighborhoods</option>
            {NEIGHBORHOOD_NAMES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Room type
          <select
            aria-label="Room type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full bg-slate-950 p-2 mt-1 border border-slate-700 rounded"
          >
            <option value="">All room types</option>
            {[
              "Private room",
              "Entire home/apt",
              "Hotel room",
              "Shared room",
            ].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>
          Stay market
          <select
            aria-label="Stay market"
            value={stay}
            onChange={(e) => setStay(e.target.value as typeof stay)}
            className="w-full bg-slate-950 p-2 mt-1 border border-slate-700 rounded"
          >
            <option value="short">Minimum stay under 30 nights</option>
            <option value="long">Minimum stay 30+ nights</option>
            <option value="all">All minimum stays</option>
          </select>
        </label>
        <label>
          Maximum listing minimum nights
          <input
            aria-label="Maximum listing minimum nights"
            type="number"
            min="1"
            max="365"
            value={maxMinimum}
            onChange={(e) => setMaxMinimum(e.target.value)}
            placeholder="No maximum"
            className="w-full bg-slate-950 p-2 mt-1 border border-slate-700 rounded"
          />
        </label>
      </div>
      <div
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
        data-testid="market-stats"
      >
        {[
          ["Sample", `${sample.listingCount} listings`],
          [
            "Priced / missing",
            `${sample.pricedListings} / ${sample.missingPriceCount}`,
          ],
          ["Median asking price", rate(sample.medianAdvertisedPrice)],
          ["Mean asking price", rate(sample.meanAdvertisedPrice)],
          ["Quartiles (Q1 / Q3)", `${rate(sample.q1)} / ${rate(sample.q3)}`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-slate-950 border border-slate-800 p-3 rounded-lg"
          >
            <p className="text-[10px] uppercase text-slate-400">{label}</p>
            <p className="text-amber-300 font-bold mt-2 text-sm">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg text-xs space-y-2">
        <p>
          Current modeled rate: <strong>{money(profile.nightlyPrice)}</strong>.{" "}
          {sample.medianAdvertisedPrice !== null
            ? `${((profile.nightlyPrice / sample.medianAdvertisedPrice - 1) * 100).toFixed(1)}% versus this filtered advertised median.`
            : "No valid prices match these filters."}
        </p>
        <p className="text-slate-400">
          Missing and nonpositive prices are excluded from price statistics.
          Quartiles use linear interpolation. Advertised prices are asking
          prices, not realized ADR or revenue. Calendar availability is not
          bookings or occupancy; license text is self-reported.
        </p>
        <button
          disabled={!canUse}
          onClick={() =>
            onSelectNeighborhood(
              neighborhood,
              sample.medianAdvertisedPrice!,
              roomType,
            )
          }
          className="px-3 py-2 rounded bg-indigo-600 disabled:opacity-40"
        >
          Use filtered median in calculator
        </button>
        <p className="text-slate-400">
          Choose a neighborhood and private room or entire home to apply a
          matching comparison. Basement suites use entire-home comparisons as a
          disclosed approximation.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex gap-2 items-center">
          <Search size={16} />
          <input
            aria-label="Filter DC neighborhoods"
            placeholder="Filter DC neighborhood..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded p-2"
          />
        </label>
        <label className="flex gap-2 items-center">
          <Filter size={16} />
          Sort by
          <select
            aria-label="Sort neighborhoods"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-950 p-2 rounded"
          >
            <option value="listings">Most listings</option>
            <option value="price">Highest median price</option>
            <option value="availability">Most calendar availability</option>
          </select>
        </label>
      </div>
      <div className="max-h-80 overflow-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-950 text-slate-400">
            <tr>
              {[
                "Neighborhood",
                "Filtered sample",
                "Priced",
                "Median asking",
                "Q1 / Q3",
                "Action",
              ].map((h) => (
                <th className="p-3" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((n) => (
              <tr
                key={n.neighborhood}
                className="border-t border-slate-800 hover:bg-slate-800"
              >
                <td className="p-3">{n.neighborhood}</td>
                <td className="p-3">{n.listingCount}</td>
                <td className="p-3">{n.pricedListings}</td>
                <td className="p-3 text-amber-300">
                  {rate(n.medianAdvertisedPrice)}
                </td>
                <td className="p-3">
                  {rate(n.q1)} / {rate(n.q3)}
                </td>
                <td className="p-3">
                  <button
                    className="p-2 bg-slate-700 rounded"
                    onClick={() => setNeighborhood(n.neighborhood)}
                  >
                    View comps
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!groups.length && (
          <p className="p-4">No neighborhoods match your search.</p>
        )}
      </div>
      <a
        className="text-xs text-indigo-300 underline"
        href={`${import.meta.env.BASE_URL}assets/dc-listings-2026-09-19.csv`}
        download
      >
        Download original snapshot CSV
      </a>
    </section>
  );
};
