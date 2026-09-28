import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Star, Utensils, Wifi, ChevronRight, Sparkles } from 'lucide-react';
import { PGProperty, College } from '../types/pg';

interface MapViewProps {
  properties: PGProperty[];
  college: College;
  onSelectProperty: (property: PGProperty) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  properties,
  college,
  onSelectProperty,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    properties.length > 0 ? properties[0].id : null
  );

  const activeProperty = properties.find((p) => p.id === selectedId) || properties[0];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-white relative">
      {/* Top Map HUD */}
      <div className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Campus Proximity Radar</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Live Walking Distances
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Campus Anchor: <strong className="text-emerald-400">{college.shortName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>&lt; 500m Walk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>500m - 1km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>&gt; 1km</span>
          </div>
        </div>
      </div>

      {/* Visual Campus Map Canvas Area */}
      <div className="relative w-full h-[520px] bg-slate-950 overflow-hidden flex items-center justify-center select-none">
        {/* Subtle Map Grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#10b981 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px',
          }}
        />

        {/* Distance concentric circles from College Campus */}
        <div className="absolute w-[220px] h-[220px] rounded-full border border-emerald-500/25 pointer-events-none flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-wider text-emerald-400/60 -mt-50">
            500m Radius (~6 min walk)
          </span>
        </div>
        <div className="absolute w-[380px] h-[380px] rounded-full border border-blue-500/20 border-dashed pointer-events-none flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-wider text-blue-400/60 -mt-88">
            1.0 km Radius (~12 min walk)
          </span>
        </div>
        <div className="absolute w-[500px] h-[500px] rounded-full border border-slate-700/40 pointer-events-none flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-500/60 -mt-118">
            2.0 km Radius
          </span>
        </div>

        {/* Center University Campus Anchor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 animate-ping absolute" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 font-black text-xs border-2 border-white">
              🎓
            </div>
          </div>
          <div className="mt-1.5 px-2.5 py-1 bg-slate-900/90 border border-emerald-500/40 rounded-lg text-center backdrop-blur-xs shadow-md">
            <div className="text-[11px] font-bold text-white whitespace-nowrap">{college.shortName}</div>
            <div className="text-[9px] text-emerald-400 font-semibold">Campus Gate 1 & 2</div>
          </div>
        </div>

        {/* Interactive PG Pins */}
        {properties.map((pg, index) => {
          const prox =
            pg.collegeProximities.find((p) => p.collegeId === college.id) ||
            pg.collegeProximities[0];
          const dist = prox ? prox.distanceMeters : 800;

          // Determine pin color by distance
          const pinColor =
            dist <= 500
              ? 'bg-emerald-500 border-emerald-300'
              : dist <= 1000
              ? 'bg-blue-500 border-blue-300'
              : 'bg-purple-500 border-purple-300';

          const isSelected = pg.id === selectedId;
          const minPrice = Math.min(...pg.roomOptions.map((r) => r.pricePerMonth));

          // Pin coordinates calculation with dispersion
          const angle = (index / properties.length) * 2 * Math.PI - Math.PI / 4;
          const radiusScale = Math.min(220, Math.max(80, (dist / 1400) * 200));
          const leftPercent = 50 + (Math.cos(angle) * radiusScale * 100) / 600;
          const topPercent = 50 + (Math.sin(angle) * radiusScale * 100) / 520;

          return (
            <div
              key={pg.id}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-200"
            >
              <button
                onClick={() => setSelectedId(pg.id)}
                className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 border-emerald-400 scale-110 ring-4 ring-emerald-500/30'
                    : 'bg-slate-900/90 text-white border-slate-700 hover:border-slate-500 hover:scale-105'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${pinColor}`} />
                <span>₹{(minPrice / 1000).toFixed(1)}k</span>

                {/* Hover / Active distance tooltip */}
                <div
                  className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-medium pointer-events-none transition-opacity ${
                    isSelected ? 'opacity-100 bg-emerald-600 text-white' : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-slate-200'
                  }`}
                >
                  🚶 {prox ? `${prox.distanceMeters}m (${prox.walkingMins} min)` : ''}
                </div>
              </button>
            </div>
          );
        })}

        {/* Selected PG Popover Drawer / Bottom Overlay */}
        {activeProperty && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-slate-200 text-slate-900 z-40">
            <div className="flex gap-3">
              <img
                src={activeProperty.photos[0]}
                alt={activeProperty.name}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5">
                  <span className="font-bold text-emerald-700">
                    🚶 {activeProperty.collegeProximities[0]?.distanceMeters}m · {activeProperty.collegeProximities[0]?.walkingMins} min
                  </span>
                  <span>·</span>
                  <span className="capitalize">{activeProperty.gender} PG</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{activeProperty.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{activeProperty.locality}</p>

                <div className="mt-1 flex items-center justify-between">
                  <div className="text-xs font-extrabold text-slate-900">
                    ₹{Math.min(...activeProperty.roomOptions.map((r) => r.pricePerMonth)).toLocaleString('en-IN')}
                    <span className="text-[10px] font-normal text-slate-500">/mo</span>
                  </div>
                  <button
                    onClick={() => onSelectProperty(activeProperty)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
