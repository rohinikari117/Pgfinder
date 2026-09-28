import React from 'react';
import { Search, GraduationCap, MapPin, ShieldCheck, Utensils, Wifi, Sparkles } from 'lucide-react';
import { College, GenderType } from '../types/pg';

interface HeroProps {
  colleges: College[];
  selectedCollegeId: string;
  onSelectCollege: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  gender: 'all' | GenderType;
  onGenderChange: (g: 'all' | GenderType) => void;
  totalListingsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  colleges,
  selectedCollegeId,
  onSelectCollege,
  searchQuery,
  onSearchChange,
  gender,
  onGenderChange,
  totalListingsCount,
}) => {
  const currentCollege = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700/60">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Over 1,200+ Verified Student Beds Near Top Campuses</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Find Student PGs & Hostels{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Near Your College
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Zero brokerage, verified walking distances from campus gates, authentic food menus, 
            Wi-Fi speed tests, and direct owner WhatsApp contact.
          </p>
        </div>

        {/* Search Engine Panel */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 text-slate-900 max-w-4xl mx-auto">
          {/* Top Gender Selector Tabs */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-500 mr-1 uppercase tracking-wider">Looking for:</span>
            {[
              { id: 'all', label: 'All PGs' },
              { id: 'boys', label: 'Boys PG' },
              { id: 'girls', label: 'Girls PG' },
              { id: 'unisex', label: 'Co-ed / Unisex' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onGenderChange(tab.id as 'all' | GenderType)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  gender === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Core inputs grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* College selector */}
            <div className="md:col-span-6 relative">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Select Your College / University
              </label>
              <div className="relative flex items-center">
                <GraduationCap className="absolute left-3 w-4 h-4 text-emerald-600 pointer-events-none" />
                <select
                  value={selectedCollegeId}
                  onChange={(e) => onSelectCollege(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Locality or landmark keyword */}
            <div className="md:col-span-6 relative">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Search Locality or PG Name
              </label>
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={`e.g. KPHB, Gate 2, DLF, AC, Balaji...`}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 text-xs text-slate-400 hover:text-slate-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Popular areas near chosen college */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium text-slate-600">Popular hubs near {currentCollege.shortName}:</span>
            {currentCollege.popularAreas.map((area) => (
              <button
                key={area}
                onClick={() => onSearchChange(area)}
                className="text-slate-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                {area} ·
              </button>
            ))}
          </div>
        </div>

        {/* Feature trust pillars */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span><strong>Zero Brokerage</strong> direct owner contact</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span><strong>Walk Times</strong> GPS tested from gate</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <span><strong>3-Meal Food</strong> weekly menu transparent</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Wifi className="w-3.5 h-3.5" />
            </div>
            <span><strong>Wi-Fi Speed</strong> speed tests verified</span>
          </div>
        </div>
      </div>
    </section>
  );
};
