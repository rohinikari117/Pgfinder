import React from 'react';
import {
  SlidersHorizontal,
  MapPin,
  Utensils,
  Wind,
  Wifi,
  Users,
  Grid,
  Map as MapIcon,
  RotateCcw,
  Zap,
  Bath,
  Check,
} from 'lucide-react';
import { FilterState, SharingType } from '../types/pg';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  viewMode,
  onViewModeChange,
  totalResults,
}) => {
  const toggleSharing = (type: SharingType) => {
    const current = [...filters.sharingTypes];
    const exists = current.includes(type);
    const updated = exists ? current.filter((t) => t !== type) : [...current, type];
    onFilterChange({ sharingTypes: updated });
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Main top row: Results count, sorting, view mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{totalResults} PGs Available</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500">Verified walking distance to campus</span>
            {activeFilterCount > 0 && (
              <button
                onClick={onResetFilters}
                className="ml-2 inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset filters ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer focus:ring-1 focus:ring-emerald-500"
              >
                <option value="recommended">Recommended (Sponsored & Verified)</option>
                <option value="distance">Nearest to Campus Gate</option>
                <option value="price_low">Monthly Rent: Low to High</option>
                <option value="price_high">Monthly Rent: High to Low</option>
                <option value="rating">Student Rating: High to Low</option>
              </select>
            </div>

            {/* Grid / Map toggle */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Card View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => onViewModeChange('map')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Campus Interactive Map View"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Campus Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter items bar */}
        <div className="pt-2.5 flex flex-wrap items-center gap-2">
          {/* Max Distance Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-500 hidden md:inline">Max Distance:</span>
            <div className="flex items-center gap-1">
              {[
                { val: 500, label: '< 500m' },
                { val: 1000, label: '< 1 km' },
                { val: 2000, label: '< 2 km' },
                { val: 10000, label: 'Any' },
              ].map((d) => (
                <button
                  key={d.val}
                  onClick={() => onFilterChange({ maxDistanceMeters: d.val })}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    filters.maxDistanceMeters === d.val
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Sharing type selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-500 hidden md:inline">Sharing:</span>
            {(['single', '2-sharing', '3-sharing', '4-sharing'] as SharingType[]).map((st) => {
              const active = filters.sharingTypes.includes(st);
              const label =
                st === 'single'
                  ? 'Single'
                  : st === '2-sharing'
                  ? '2-Share'
                  : st === '3-sharing'
                  ? '3-Share'
                  : '4-Share';
              return (
                <button
                  key={st}
                  onClick={() => toggleSharing(st)}
                  className={`px-2 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    active
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {active && <Check className="w-3 h-3" />}
                  {label}
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Quick Toggle: Food Included */}
          <button
            onClick={() => onFilterChange({ foodIncludedOnly: !filters.foodIncludedOnly })}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              filters.foodIncludedOnly
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Food Included</span>
          </button>

          {/* Quick Toggle: AC Only */}
          <button
            onClick={() => onFilterChange({ acOnly: !filters.acOnly })}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              filters.acOnly
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>AC Available</span>
          </button>

          {/* Quick Toggle: Zero Curfew */}
          <button
            onClick={() => onFilterChange({ zeroCurfewOnly: !filters.zeroCurfewOnly })}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              filters.zeroCurfewOnly
                ? 'bg-purple-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>No Curfew / 24x7</span>
          </button>

          {/* Quick Toggle: Attached Bath */}
          <button
            onClick={() => onFilterChange({ attachedBathOnly: !filters.attachedBathOnly })}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              filters.attachedBathOnly
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bath className="w-3.5 h-3.5" />
            <span>Attached Washroom</span>
          </button>

          {/* Budget Range selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] font-medium text-slate-500">Max Budget:</span>
            <select
              value={filters.maxBudget}
              onChange={(e) => onFilterChange({ maxBudget: Number(e.target.value) })}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="6000">Up to ₹6,000/mo</option>
              <option value="8000">Up to ₹8,000/mo</option>
              <option value="10000">Up to ₹10,000/mo</option>
              <option value="15000">Up to ₹15,000/mo</option>
              <option value="25000">Up to ₹25,000/mo</option>
              <option value="50000">Any Budget</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
