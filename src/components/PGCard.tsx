import React, { useState } from 'react';
import {
  MapPin,
  Utensils,
  Wifi,
  Wind,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  GitCompare,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock,
  Check,
} from 'lucide-react';
import { PGProperty, College } from '../types/pg';

interface PGCardProps {
  property: PGProperty;
  college: College;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onOpenDetails: (property: PGProperty) => void;
  onBookVisit: (property: PGProperty) => void;
  onContactCall: (property: PGProperty) => void;
}

export const PGCard: React.FC<PGCardProps> = ({
  property,
  college,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
  onOpenDetails,
  onBookVisit,
  onContactCall,
}) => {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // Proximity to the active college
  const proximity =
    property.collegeProximities.find((p) => p.collegeId === college.id) ||
    property.collegeProximities[0];

  // Lowest available price
  const lowestPrice = Math.min(...property.roomOptions.map((r) => r.pricePerMonth));
  const minDeposit = Math.min(...property.roomOptions.map((r) => r.deposit));

  // WhatsApp link generator with prefilled message
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hello ${property.ownerContact.name}, I found "${property.name}" on CampusNest near ${college.shortName}. I am looking for student accommodation. Could you share current room availability?`
    );
    window.open(`https://wa.me/${property.ownerContact.whatsapp}?text=${text}`, '_blank');
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIdx((prev) => (prev + 1) % property.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIdx((prev) => (prev - 1 + property.photos.length) % property.photos.length);
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
      {/* Image Container with controls */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden select-none">
        <img
          src={property.photos[currentPhotoIdx]}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Carousel arrows */}
        {property.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs text-slate-800 hover:bg-white flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs text-slate-800 hover:bg-white flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top Badges: Quiet text kicker + Sponsor */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          {property.isSponsored && (
            <span className="text-[10px] font-semibold text-white bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Featured Partner
            </span>
          )}
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs shadow-xs ${
              property.gender === 'boys'
                ? 'bg-blue-600/90 text-white'
                : property.gender === 'girls'
                ? 'bg-rose-600/90 text-white'
                : 'bg-emerald-700/90 text-white'
            }`}
          >
            {property.gender === 'boys' ? 'Boys PG' : property.gender === 'girls' ? 'Girls PG' : 'Co-ed / Unisex'}
          </span>
        </div>

        {/* Action icons: Save Bookmark & Compare */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property.id);
            }}
            className={`w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
              isCompared
                ? 'bg-emerald-600 text-white'
                : 'bg-white/85 text-slate-700 hover:bg-white hover:text-slate-900'
            }`}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            className={`w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
              isSaved
                ? 'bg-rose-600 text-white'
                : 'bg-white/85 text-slate-700 hover:bg-white hover:text-rose-600'
            }`}
            title={isSaved ? 'Remove bookmark' : 'Bookmark PG'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Photo dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full pointer-events-none">
          {property.photos.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentPhotoIdx ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line (anti-slop rule) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-emerald-700">
              🚶 {proximity ? `${proximity.distanceMeters}m · ${proximity.walkingMins} min walk` : 'Near campus'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{property.locality}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {property.ratings.overall} ({property.ratings.totalReviews})
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(property)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-700 cursor-pointer transition-colors leading-snug line-clamp-1"
          >
            {property.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 mb-3">{property.tagline}</p>

          {/* Key Student Perks Grid */}
          <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {property.food.included
                    ? `${property.food.mealTimes.length} Meals/Day (${property.food.cuisineType})`
                    : 'Self Cooking / Mess Extra'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">{property.food.foodType}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>{property.amenities.wifiSpeedMbps} Mbps Tested Speed</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{property.rules.curfewTime}</span>
              </div>
            </div>
          </div>

          {/* Room options & starting rates */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Room Options & Pricing</span>
              <span className="text-[11px]">Deposit from ₹{minDeposit.toLocaleString('en-IN')}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {property.roomOptions.slice(0, 3).map((room) => (
                <div
                  key={room.type}
                  className="bg-slate-50/80 border border-slate-200/70 rounded-lg p-1.5 text-[11px]"
                >
                  <div className="text-slate-500 uppercase tracking-wider text-[10px] truncate font-medium">
                    {room.type}
                  </div>
                  <div className="font-bold text-slate-900">
                    ₹{room.pricePerMonth.toLocaleString('en-IN')}
                    <span className="text-[9px] text-slate-400 font-normal">/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer: Pricing & Working Handlers */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Starts at</div>
            <div className="text-base font-extrabold text-slate-900 leading-tight">
              ₹{lowestPrice.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500">/mo</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onContactCall(property)}
              className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title={`Call ${property.ownerContact.name}`}
            >
              <Phone className="w-4 h-4 text-emerald-700" />
            </button>
            <button
              onClick={handleWhatsApp}
              className="p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenDetails(property)}
              className="px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
