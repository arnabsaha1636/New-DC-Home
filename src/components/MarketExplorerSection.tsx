import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  Search,
  Filter,
  BarChart2,
  Users,
  Home,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Layers
} from 'lucide-react';
import { DC_NEIGHBORHOODS, DC_CITY_SUMMARY, NeighborhoodData } from '../data/dcMarketData';
import { HomeownerProfile } from '../utils/calculator';

interface MarketExplorerProps {
  profile: HomeownerProfile;
  onSelectNeighborhood: (neighborhood: string, medianPrice: number) => void;
}

export const MarketExplorerSection: React.FC<MarketExplorerProps> = ({
  profile,
  onSelectNeighborhood,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'listings' | 'price' | 'availability'>('listings');

  // Find currently selected neighborhood
  const selectedNeighborhood =
    DC_NEIGHBORHOODS.find((n) => n.neighborhood === profile.neighborhood) ||
    DC_NEIGHBORHOODS[0];

  // Filter and sort list
  const filteredNeighborhoods = DC_NEIGHBORHOODS.filter((n) =>
    n.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'listings') return b.listingCount - a.listingCount;
    if (sortBy === 'price') return b.medianAdvertisedPrice - a.medianAdvertisedPrice;
    if (sortBy === 'availability') return b.meanAvailableNights365 - a.meanAvailableNights365;
    return 0;
  });

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Inside Airbnb — Washington, DC Market Explorer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical snapshot from September 19, 2026 • 6,906 listings across 39 DC neighborhood groups
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Citywide Median:</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-bold font-mono border border-slate-700">
            ${DC_CITY_SUMMARY.medianAdvertisedPrice}/night
          </span>
        </div>
      </div>

      {/* Selected Neighborhood Highlight Banner */}
      <div className="my-5 p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 rounded-xl border border-indigo-900/40 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 block mb-0.5">
            Active Comps Focus
          </span>
          <h3 className="text-sm font-bold text-white leading-tight">
            {selectedNeighborhood.neighborhood}
          </h3>
          <span className="inline-block mt-1 text-[11px] text-slate-400">
            {selectedNeighborhood.listingCount} total listings in group
          </span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Median Advertised Nightly
          </span>
          <div className="text-lg font-black text-amber-300 font-mono mt-0.5">
            ${selectedNeighborhood.medianAdvertisedPrice}
          </div>
          <span className="text-[10px] text-slate-400">
            Mean asking rate: ${selectedNeighborhood.meanAdvertisedPrice.toFixed(1)}
          </span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Room Type Distribution
          </span>
          <div className="text-xs text-slate-200 mt-1 space-y-0.5">
            <div className="flex justify-between">
              <span>Entire home:</span>
              <span className="font-semibold">{selectedNeighborhood.entireHomeCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-300">Private rooms:</span>
              <span className="font-semibold text-amber-300">{selectedNeighborhood.privateRoomCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Market Activity
            </span>
            <span className="text-xs text-slate-300 block mt-1">
              <strong>{selectedNeighborhood.withReviewsLast12Months}</strong> with reviews in trailing 12 mo
            </span>
            <span className="text-[10px] text-slate-400">
              Avg days offered: {selectedNeighborhood.meanAvailableNights365} / yr
            </span>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[10px] text-emerald-400">Maya&apos;s Rate ($125)</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {Math.round(((125 - selectedNeighborhood.medianAdvertisedPrice) / selectedNeighborhood.medianAdvertisedPrice) * 100)}% vs median
            </span>
          </div>
        </div>
      </div>

      {/* Methodology & Demand Limitation Callout */}
      <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg mb-5 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>Inside Airbnb Methodology & Calendar Availability Notice</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong>Calendar Availability Caveat:</strong> In accordance with strict statistical standards, calendar dates listed as available (<code className="bg-slate-900 px-1 text-slate-300">availability_365</code>) reflect homeowner offering windows, <em>not actual realized bookings</em>. Unlisted days frequently reflect host personal blackouts or platform blocks. Therefore, StayWise DC never treats unbooked nights as paid bookings, keeping occupancy user-adjustable (50% default).
        </p>
      </div>

      {/* Filter and Neighborhood List Table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter DC neighborhood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="listings">Most Listings</option>
              <option value="price">Highest Median Price</option>
              <option value="availability">Highest Days Available</option>
            </select>
          </div>
        </div>

        {/* Scrollable Comps Table */}
        <div className="border border-slate-800 rounded-lg overflow-hidden max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Neighborhood Group</th>
                <th className="py-2.5 px-3 text-right">Listings</th>
                <th className="py-2.5 px-3 text-right">Median Price</th>
                <th className="py-2.5 px-3 text-right">Private Rooms</th>
                <th className="py-2.5 px-3 text-right">30+ Night Min</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredNeighborhoods.map((n) => {
                const isCurrent = n.neighborhood === profile.neighborhood;
                return (
                  <tr
                    key={n.neighborhood}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCurrent ? 'bg-indigo-950/40 text-amber-300 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                      {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <span className="truncate max-w-[280px]" title={n.neighborhood}>
                        {n.neighborhood}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">{n.listingCount}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-400 font-mono">
                      ${n.medianAdvertisedPrice}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{n.privateRoomCount}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{n.minStay30PlusCount}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onSelectNeighborhood(n.neighborhood, n.medianAdvertisedPrice)}
                        className={`text-[11px] px-2.5 py-1 rounded font-sans transition ${
                          isCurrent
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isCurrent ? 'Selected' : 'Use Comps'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
