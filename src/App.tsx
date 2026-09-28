/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { COLLEGES } from './data/colleges';
import { INITIAL_PGS } from './data/mockPGs';
import { PGProperty, College, FilterState, GenderType, SharingType } from './types/pg';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { PGCard } from './components/PGCard';
import { PGDetailModal } from './components/PGDetailModal';
import { MapView } from './components/MapView';
import { CompareModal } from './components/CompareModal';
import { OwnerPortalModal } from './components/OwnerPortalModal';
import { PromptModal } from './components/PromptModal';
import { VisitBookingModal } from './components/VisitBookingModal';
import { SavedDrawer } from './components/SavedDrawer';
import {
  Sparkles,
  Building2,
  GraduationCap,
  ShieldCheck,
  Search,
  Filter,
  Check,
  Heart,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  // Colleges and active college
  const [colleges] = useState<College[]>(COLLEGES);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('jntuh-hyd');

  // PG Properties dataset (persisted in localStorage)
  const [properties, setProperties] = useState<PGProperty[]>(() => {
    try {
      const saved = localStorage.getItem('campusnest_pgs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PGS;
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCollegeId: 'jntuh-hyd',
    gender: 'all',
    maxDistanceMeters: 10000,
    maxBudget: 50000,
    sharingTypes: [],
    foodIncludedOnly: false,
    acOnly: false,
    zeroCurfewOnly: false,
    attachedBathOnly: false,
    powerBackupOnly: false,
    washingMachineOnly: false,
    sortBy: 'recommended',
  });

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Bookmarks / Saved IDs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('campusnest_saved_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare IDs (max 3)
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Modals
  const [detailProperty, setDetailProperty] = useState<PGProperty | null>(null);
  const [visitingProperty, setVisitingProperty] = useState<PGProperty | null>(null);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync savedIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusnest_saved_ids', JSON.stringify(savedIds));
    } catch {
      // ignore
    }
  }, [savedIds]);

  // Sync properties to localStorage when added
  useEffect(() => {
    try {
      localStorage.setItem('campusnest_pgs', JSON.stringify(properties));
    } catch {
      // ignore
    }
  }, [properties]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectCollege = (colId: string) => {
    setSelectedCollegeId(colId);
    setFilters((prev) => ({ ...prev, selectedCollegeId: colId }));
  };

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCollegeId,
      gender: 'all',
      maxDistanceMeters: 10000,
      maxBudget: 50000,
      sharingTypes: [],
      foodIncludedOnly: false,
      acOnly: false,
      zeroCurfewOnly: false,
      attachedBathOnly: false,
      powerBackupOnly: false,
      washingMachineOnly: false,
      sortBy: 'recommended',
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.gender !== 'all') count++;
    if (filters.maxDistanceMeters < 10000) count++;
    if (filters.maxBudget < 50000) count++;
    if (filters.sharingTypes.length > 0) count += filters.sharingTypes.length;
    if (filters.foodIncludedOnly) count++;
    if (filters.acOnly) count++;
    if (filters.zeroCurfewOnly) count++;
    if (filters.attachedBathOnly) count++;
    return count;
  }, [filters]);

  const activeCollege = useMemo(() => {
    return colleges.find((c) => c.id === selectedCollegeId) || colleges[0];
  }, [colleges, selectedCollegeId]);

  // Toggle Bookmark
  const handleToggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((item) => item !== id));
      showToast('Removed from saved list');
    } else {
      setSavedIds([...savedIds, id]);
      showToast('PG saved to your shortlist!');
    }
  };

  // Toggle Compare
  const handleToggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 3) {
        showToast('You can compare up to 3 PGs at a time');
        return;
      }
      setCompareIds([...compareIds, id]);
      showToast('Added to compare tray');
    }
  };

  // Add new PG from owner wizard
  const handleAddNewPG = (newPG: PGProperty) => {
    setProperties((prev) => [newPG, ...prev]);
    showToast(`"${newPG.name}" has been published!`);
  };

  // Filtering & Sorting Logic
  const filteredProperties = useMemo(() => {
    return properties
      .filter((pg) => {
        // College filter or Proximity calculation
        const prox = pg.collegeProximities.find((p) => p.collegeId === selectedCollegeId);

        // Locality / Query text match
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = pg.name.toLowerCase().includes(q);
          const matchLocality = pg.locality.toLowerCase().includes(q);
          const matchTagline = pg.tagline.toLowerCase().includes(q);
          const matchLandmark = pg.collegeProximities.some(
            (p) => p.landmarkRoute?.toLowerCase().includes(q)
          );
          if (!matchName && !matchLocality && !matchTagline && !matchLandmark) return false;
        }

        // Gender filter
        if (filters.gender !== 'all' && pg.gender !== filters.gender) {
          return false;
        }

        // Max distance filter
        if (prox && prox.distanceMeters > filters.maxDistanceMeters) {
          return false;
        }

        // Max budget filter (at least one room type <= maxBudget)
        const minPrice = Math.min(...pg.roomOptions.map((r) => r.pricePerMonth));
        if (minPrice > filters.maxBudget) {
          return false;
        }

        // Sharing type filter
        if (filters.sharingTypes.length > 0) {
          const hasSelectedSharing = pg.roomOptions.some((r) =>
            filters.sharingTypes.includes(r.type)
          );
          if (!hasSelectedSharing) return false;
        }

        // Food included filter
        if (filters.foodIncludedOnly && !pg.food.included) {
          return false;
        }

        // AC available filter
        if (filters.acOnly && !pg.amenities.ac) {
          return false;
        }

        // Zero curfew filter
        if (filters.zeroCurfewOnly && !pg.rules.curfewTime.toLowerCase().includes('no curfew') && !pg.rules.curfewTime.toLowerCase().includes('24/7')) {
          return false;
        }

        // Attached bathroom filter
        if (filters.attachedBathOnly) {
          const hasAttached = pg.roomOptions.some((r) => r.attachedBath);
          if (!hasAttached) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const proxA =
          a.collegeProximities.find((p) => p.collegeId === selectedCollegeId)?.distanceMeters ??
          9999;
        const proxB =
          b.collegeProximities.find((p) => p.collegeId === selectedCollegeId)?.distanceMeters ??
          9999;

        const minPriceA = Math.min(...a.roomOptions.map((r) => r.pricePerMonth));
        const minPriceB = Math.min(...b.roomOptions.map((r) => r.pricePerMonth));

        switch (filters.sortBy) {
          case 'distance':
            return proxA - proxB;
          case 'price_low':
            return minPriceA - minPriceB;
          case 'price_high':
            return minPriceB - minPriceA;
          case 'rating':
            return b.ratings.overall - a.ratings.overall;
          case 'recommended':
          default:
            // Sponsored & Featured first, then rating
            if (a.isSponsored && !b.isSponsored) return -1;
            if (!a.isSponsored && b.isSponsored) return 1;
            return b.ratings.overall - a.ratings.overall;
        }
      });
  }, [properties, selectedCollegeId, filters]);

  const comparedPropertiesList = useMemo(() => {
    return properties.filter((p) => compareIds.includes(p.id));
  }, [properties, compareIds]);

  const savedPropertiesList = useMemo(() => {
    return properties.filter((p) => savedIds.includes(p.id));
  }, [properties, savedIds]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        colleges={colleges}
        selectedCollegeId={selectedCollegeId}
        onSelectCollege={handleSelectCollege}
        savedCount={savedIds.length}
        compareCount={compareIds.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
        onOpenPromptModal={() => setIsPromptOpen(true)}
      />

      {/* Hero with search */}
      <Hero
        colleges={colleges}
        selectedCollegeId={selectedCollegeId}
        onSelectCollege={handleSelectCollege}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterUpdate({ searchQuery: q })}
        gender={filters.gender}
        onGenderChange={(g) => handleFilterUpdate({ gender: g })}
        totalListingsCount={filteredProperties.length}
      />

      {/* Filter and sorting toolbar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterUpdate}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredProperties.length}
      />

      {/* Main listings area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'map' ? (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <strong>Interactive Campus Locator:</strong> Showing PGs clustered around{' '}
                <span className="text-emerald-700 font-bold">{activeCollege.name}</span>. Click any pin to
                view instant walk distance and pricing.
              </div>
              <button
                onClick={() => setViewMode('grid')}
                className="text-xs text-slate-800 underline font-semibold cursor-pointer"
              >
                Back to Card View
              </button>
            </div>
            <MapView
              properties={filteredProperties}
              college={activeCollege}
              onSelectProperty={(pg) => setDetailProperty(pg)}
            />
          </div>
        ) : (
          <div>
            {filteredProperties.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No student PGs match your criteria</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Try broadening your distance radius, adjusting budget, or clearing filter tags.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((pg) => (
                  <PGCard
                    key={pg.id}
                    property={pg}
                    college={activeCollege}
                    isSaved={savedIds.includes(pg.id)}
                    onToggleSave={handleToggleSave}
                    isCompared={compareIds.includes(pg.id)}
                    onToggleCompare={handleToggleCompare}
                    onOpenDetails={(property) => setDetailProperty(property)}
                    onBookVisit={(property) => setVisitingProperty(property)}
                    onContactCall={(property) => {
                      window.open(`tel:${property.ownerContact.phone}`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Quick Prompt Banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Prompt for AI Studio</span>
            </div>
            <h4 className="text-base font-bold">
              Need to copy this prompt to recreate in AI Studio?
            </h4>
            <p className="text-xs text-slate-300 max-w-xl">
              &ldquo;Ee idea ki prompt ivvu nenu ai studio lo paste cheyyadaniki&rdquo; — Get the exact full-stack specification prompt with 1-click copy.
            </p>
          </div>
          <button
            onClick={() => setIsPromptOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shrink-0 shadow-lg cursor-pointer transition-all flex items-center gap-2"
          >
            <span>View & Copy AI Studio Prompt</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900">CampusNest</span>
            <span>· Verified Student Accommodation Finder</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsOwnerPortalOpen(true)}
              className="hover:text-emerald-700 underline cursor-pointer"
            >
              List Property / Owner Plans
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPromptOpen(true)}
              className="hover:text-emerald-700 underline cursor-pointer"
            >
              AI Studio Prompt
            </button>
            <span>·</span>
            <span>Zero Brokerage Guaranteed</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PGDetailModal
        property={detailProperty}
        college={activeCollege}
        isOpen={!!detailProperty}
        onClose={() => setDetailProperty(null)}
        isSaved={detailProperty ? savedIds.includes(detailProperty.id) : false}
        onToggleSave={handleToggleSave}
        isCompared={detailProperty ? compareIds.includes(detailProperty.id) : false}
        onToggleCompare={handleToggleCompare}
        onBookVisit={(property) => {
          setDetailProperty(null);
          setVisitingProperty(property);
        }}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProperties={comparedPropertiesList}
        college={activeCollege}
        onRemoveFromCompare={(id) => setCompareIds(compareIds.filter((item) => item !== id))}
        onOpenDetails={(property) => setDetailProperty(property)}
      />

      <SavedDrawer
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedProperties={savedPropertiesList}
        college={activeCollege}
        onRemoveSaved={handleToggleSave}
        onOpenDetails={(property) => setDetailProperty(property)}
      />

      <OwnerPortalModal
        isOpen={isOwnerPortalOpen}
        onClose={() => setIsOwnerPortalOpen(false)}
        colleges={colleges}
        onAddNewPG={handleAddNewPG}
      />

      <PromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
      />

      <VisitBookingModal
        property={visitingProperty}
        college={activeCollege}
        isOpen={!!visitingProperty}
        onClose={() => setVisitingProperty(null)}
      />
    </div>
  );
}
