import React from 'react';
import { X, Check, Utensils, Wifi, Wind, MapPin, IndianRupee, ShieldCheck, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { PGProperty, College } from '../types/pg';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProperties: PGProperty[];
  college: College;
  onRemoveFromCompare: (id: string) => void;
  onOpenDetails: (property: PGProperty) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedProperties,
  college,
  onRemoveFromCompare,
  onOpenDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-white">Side-by-Side PG Comparison</h3>
            <p className="text-xs text-slate-400">
              Comparing accommodation choices near {college.shortName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          {comparedProperties.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-medium">No properties selected for comparison yet.</p>
              <p className="text-xs mt-1 text-slate-400">
                Click the compare icon (⇌) on any PG card to compare up to 3 properties side-by-side.
              </p>
            </div>
          ) : (
            <div className="min-w-[650px]">
              {/* Top row with images & titles */}
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-end">
                  Feature / Criteria
                </div>
                {comparedProperties.map((pg) => {
                  const prox =
                    pg.collegeProximities.find((p) => p.collegeId === college.id) ||
                    pg.collegeProximities[0];
                  return (
                    <div key={pg.id} className="space-y-2 relative">
                      <button
                        onClick={() => onRemoveFromCompare(pg.id)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-white/80 text-rose-600 hover:bg-white shadow-xs z-10"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={pg.photos[0]}
                        alt={pg.name}
                        className="w-full h-28 object-cover rounded-xl border border-slate-200"
                      />
                      <h4
                        onClick={() => {
                          onClose();
                          onOpenDetails(pg);
                        }}
                        className="text-xs font-bold text-slate-900 hover:text-emerald-700 cursor-pointer line-clamp-2"
                      >
                        {pg.name}
                      </h4>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        🚶 {prox ? `${prox.distanceMeters}m (${prox.walkingMins} min)` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rows Comparison */}
              <div className="divide-y divide-slate-100 text-xs">
                {/* Monthly Rent */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <span className="font-semibold text-slate-600">Starting Rent</span>
                  {comparedProperties.map((pg) => {
                    const minPrice = Math.min(...pg.roomOptions.map((r) => r.pricePerMonth));
                    return (
                      <div key={pg.id} className="font-extrabold text-slate-900 text-sm">
                        ₹{minPrice.toLocaleString('en-IN')}/mo
                      </div>
                    );
                  })}
                </div>

                {/* Security Deposit */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <span className="font-semibold text-slate-600">Security Deposit</span>
                  {comparedProperties.map((pg) => {
                    const minDep = Math.min(...pg.roomOptions.map((r) => r.deposit));
                    return (
                      <div key={pg.id} className="text-slate-800 font-medium">
                        ₹{minDep.toLocaleString('en-IN')} (Refundable)
                      </div>
                    );
                  })}
                </div>

                {/* Food Details */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <span className="font-semibold text-slate-600">Food & Meals</span>
                  {comparedProperties.map((pg) => (
                    <div key={pg.id} className="text-slate-800 space-y-0.5">
                      <div className="font-semibold text-emerald-700">
                        {pg.food.included ? `${pg.food.mealTimes.length} Meals/day` : 'Self-cooking'}
                      </div>
                      <div className="text-[11px] text-slate-500">{pg.food.cuisineType}</div>
                      <div className="text-[10px] text-slate-400">{pg.food.foodType}</div>
                    </div>
                  ))}
                </div>

                {/* Wi-Fi Speed */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <span className="font-semibold text-slate-600">Wi-Fi Speed</span>
                  {comparedProperties.map((pg) => (
                    <div key={pg.id} className="text-slate-800 font-semibold flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{pg.amenities.wifiSpeedMbps} Mbps Tested</span>
                    </div>
                  ))}
                </div>

                {/* AC Availability */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <span className="font-semibold text-slate-600">AC Availability</span>
                  {comparedProperties.map((pg) => (
                    <div key={pg.id} className="text-slate-800">
                      {pg.amenities.ac ? (
                        <span className="text-blue-700 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> AC Rooms Available
                        </span>
                      ) : (
                        <span className="text-slate-400">Non-AC Only</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Curfew Rules */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <span className="font-semibold text-slate-600">Curfew & Gate</span>
                  {comparedProperties.map((pg) => (
                    <div key={pg.id} className="text-slate-800 font-medium">
                      {pg.rules.curfewTime}
                    </div>
                  ))}
                </div>

                {/* Student Rating */}
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <span className="font-semibold text-slate-600">Student Rating</span>
                  {comparedProperties.map((pg) => (
                    <div key={pg.id} className="font-bold text-slate-900 flex items-center gap-1">
                      <span>★ {pg.ratings.overall}</span>
                      <span className="text-slate-400 text-[11px] font-normal">
                        ({pg.ratings.totalReviews} reviews)
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Direct Connect */}
                <div className="grid grid-cols-4 gap-4 py-4 items-center">
                  <span className="font-semibold text-slate-600">Contact Owner</span>
                  {comparedProperties.map((pg) => (
                    <div key={pg.id}>
                      <button
                        onClick={() => {
                          const text = encodeURIComponent(
                            `Hi ${pg.ownerContact.name}, I compared "${pg.name}" on CampusNest and want to know room availability.`
                          );
                          window.open(`https://wa.me/${pg.ownerContact.whatsapp}?text=${text}`, '_blank');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
