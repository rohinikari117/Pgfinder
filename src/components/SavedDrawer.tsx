import React from 'react';
import { X, Bookmark, Trash2, Phone, MessageSquare, ChevronRight, Star } from 'lucide-react';
import { PGProperty, College } from '../types/pg';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: PGProperty[];
  college: College;
  onRemoveSaved: (id: string) => void;
  onOpenDetails: (property: PGProperty) => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  college,
  onRemoveSaved,
  onOpenDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-rose-400" fill="currentColor" />
            <h3 className="text-sm font-bold text-white">
              Shortlisted PGs ({savedProperties.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">No PGs shortlisted yet</p>
              <p className="mt-1">Click the bookmark icon on any PG card to save it for later comparison.</p>
            </div>
          ) : (
            savedProperties.map((pg) => {
              const prox =
                pg.collegeProximities.find((p) => p.collegeId === college.id) ||
                pg.collegeProximities[0];
              const minPrice = Math.min(...pg.roomOptions.map((r) => r.pricePerMonth));

              return (
                <div
                  key={pg.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all flex gap-3 text-xs"
                >
                  <img
                    src={pg.photos[0]}
                    alt={pg.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      onOpenDetails(pg);
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-700 font-bold">
                          🚶 {prox ? `${prox.distanceMeters}m (${prox.walkingMins} min)` : ''}
                        </span>
                        <button
                          onClick={() => onRemoveSaved(pg.id)}
                          className="text-slate-400 hover:text-rose-600"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4
                        onClick={() => {
                          onClose();
                          onOpenDetails(pg);
                        }}
                        className="font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer mt-0.5"
                      >
                        {pg.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{pg.locality}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div className="font-extrabold text-slate-900">
                        ₹{minPrice.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-slate-500">/mo</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const text = encodeURIComponent(
                              `Hi ${pg.ownerContact.name}, I shortlisted "${pg.name}" on CampusNest. Please share room details.`
                            );
                            window.open(`https://wa.me/${pg.ownerContact.whatsapp}?text=${text}`, '_blank');
                          }}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenDetails(pg);
                          }}
                          className="px-2 py-1 bg-slate-100 text-slate-800 rounded font-semibold text-[11px] hover:bg-slate-200"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
