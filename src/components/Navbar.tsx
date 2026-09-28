import React from 'react';
import { Building2, Bookmark, GitCompare, PlusCircle, Sparkles, MapPin } from 'lucide-react';
import { College } from '../types/pg';

interface NavbarProps {
  colleges: College[];
  selectedCollegeId: string;
  onSelectCollege: (id: string) => void;
  savedCount: number;
  compareCount: number;
  onOpenSaved: () => void;
  onOpenCompare: () => void;
  onOpenOwnerPortal: () => void;
  onOpenPromptModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  colleges,
  selectedCollegeId,
  onSelectCollege,
  savedCount,
  compareCount,
  onOpenSaved,
  onOpenCompare,
  onOpenOwnerPortal,
  onOpenPromptModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-lg">CampusNest</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Student PGs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">Verified Rooms Near Colleges</p>
            </div>
          </div>

          {/* College Quick Switcher */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">Campus:</span>
            <select
              value={selectedCollegeId}
              onChange={(e) => onSelectCollege(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:ring-0 cursor-pointer pr-4 hover:text-emerald-700 transition-colors"
            >
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.shortName} ({col.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Studio Prompt Button */}
          <button
            onClick={onOpenPromptModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            title="View AI Studio Prompt for this app"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Prompt</span>
          </button>

          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              compareCount > 0
                ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </button>

          {/* Saved Bookmarks */}
          <button
            onClick={onOpenSaved}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Saved PGs"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* PG Owner Business Portal */}
          <button
            onClick={onOpenOwnerPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List Your PG</span>
            <span className="sm:hidden">Owner</span>
          </button>
        </div>
      </div>
    </header>
  );
};
