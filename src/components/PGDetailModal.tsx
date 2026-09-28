import React, { useState } from 'react';
import {
  X,
  MapPin,
  Utensils,
  Wifi,
  Wind,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Check,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  Share2,
  Bookmark,
  GitCompare,
  Zap,
  Droplets,
  Tv,
  Dumbbell,
  Calculator,
  ChevronRight,
  Send,
} from 'lucide-react';
import { PGProperty, College, Review } from '../types/pg';

interface PGDetailModalProps {
  property: PGProperty | null;
  college: College;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onBookVisit: (property: PGProperty) => void;
}

export const PGDetailModal: React.FC<PGDetailModalProps> = ({
  property,
  college,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
  onBookVisit,
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'food' | 'amenities' | 'reviews' | 'calculator'>('overview');

  // Review submission form state
  const [reviewName, setReviewName] = useState('');
  const [reviewCollege, setReviewCollege] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Student expense calculator state
  const [calcRoomIndex, setCalcRoomIndex] = useState(0);
  const [calcHasAc, setCalcHasAc] = useState(true);
  const [calcLaundryExtra, setCalcLaundryExtra] = useState(false);

  // Synchronize reviews when property changes
  React.useEffect(() => {
    if (property) {
      setReviewsList(property.reviews);
      setSelectedPhotoIdx(0);
      setReviewSubmitted(false);
      setCalcRoomIndex(0);
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const proximity =
    property.collegeProximities.find((p) => p.collegeId === college.id) ||
    property.collegeProximities[0];

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${property.ownerContact.name}, I'm interested in viewing "${property.name}" near ${college.shortName}. Could you share current room availability and deposit details?`
    );
    window.open(`https://wa.me/${property.ownerContact.whatsapp}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${property.ownerContact.phone}`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      studentName: reviewName,
      college: reviewCollege || college.shortName,
      roomType: property.roomOptions[0].label,
      stayDuration: 'Resident',
      date: 'Just now',
      rating: reviewRating,
      comment: reviewComment,
      pros: ['Honest student review'],
      cons: [],
      verifiedResident: true,
      ratingsBreakdown: {
        food: reviewRating,
        wifi: reviewRating,
        cleanliness: reviewRating,
        safety: reviewRating,
      },
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewName('');
    setReviewCollege('');
    setReviewComment('');
    setReviewSubmitted(true);
  };

  // Calculator math
  const selectedRoom = property.roomOptions[calcRoomIndex] || property.roomOptions[0];
  const estElectricity = calcHasAc ? 800 : 200;
  const estLaundry = calcLaundryExtra ? 600 : 0;
  const totalMonthlyOutflow = selectedRoom.pricePerMonth + estElectricity + estLaundry;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                property.gender === 'boys'
                  ? 'bg-blue-600 text-white'
                  : property.gender === 'girls'
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {property.gender === 'boys' ? 'Boys PG' : property.gender === 'girls' ? 'Girls PG' : 'Co-ed / Unisex'}
            </span>
            {property.isSponsored && (
              <span className="text-[10px] font-semibold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured Campus Listing
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(property.id)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                isCompared ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Compare"
            >
              <GitCompare className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                isSaved ? 'text-rose-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Save"
            >
              <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Header Title + Proximity banner */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-bold text-emerald-700 text-sm">
                🚶 {proximity ? `${proximity.distanceMeters}m · ${proximity.walkingMins} min walk` : 'Near Campus'}
              </span>
              <span aria-hidden="true">·</span>
              <span>from {proximity?.collegeName || college.name}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {property.ratings.overall} ({property.ratings.totalReviews} verified reviews)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {property.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{property.address}</span>
            </p>
          </div>

          {/* Photo Gallery Grid */}
          <div className="space-y-2">
            <div className="aspect-16/9 sm:aspect-21/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
              <img
                src={property.photos[selectedPhotoIdx]}
                alt={`${property.name} view`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md">
                Photo {selectedPhotoIdx + 1} of {property.photos.length}
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {property.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIdx(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedPhotoIdx === idx ? 'border-emerald-600 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-200 flex gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold">
            {[
              { id: 'overview', label: 'Rooms & Pricing' },
              { id: 'food', label: 'Food & Mess Menu' },
              { id: 'amenities', label: 'Amenities & Rules' },
              { id: 'reviews', label: `Reviews (${reviewsList.length})` },
              { id: 'calculator', label: 'Monthly Budget Calculator' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Rooms & Pricing */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
                  Available Sharing Types & Rent Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {property.roomOptions.map((room) => (
                    <div
                      key={room.type}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-sm">{room.label}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                            {room.availableBeds} beds left
                          </span>
                        </div>
                        <div className="text-xl font-extrabold text-slate-900 mt-2">
                          ₹{room.pricePerMonth.toLocaleString('en-IN')}
                          <span className="text-xs text-slate-500 font-normal">/month</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Security Deposit: <strong>₹{room.deposit.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{room.acAvailable ? 'AC included/available' : 'Non-AC room'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{room.attachedBath ? 'Attached bathroom' : 'Common clean washroom'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deposit, Notice & Policy box */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Transparent Student Rental Policy</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <span className="text-amber-700 block text-[10px] uppercase font-semibold">Security Deposit:</span>
                    <span className="font-semibold text-slate-900">
                      Refundable on checkout with notice
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-700 block text-[10px] uppercase font-semibold">Notice Period:</span>
                    <span className="font-semibold text-slate-900">
                      {property.rules.noticePeriodDays} Days required before vacating
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-700 block text-[10px] uppercase font-semibold">Electricity:</span>
                    <span className="font-semibold text-slate-900">{property.electricityCharges}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Food & Mess Menu */}
          {activeTab === 'food' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold">
                    {property.food.cuisineType} Cuisine · {property.food.foodType}
                  </span>
                </div>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-medium text-[11px]">
                  {property.food.mealTimes.join(' + ')}
                </span>
              </div>

              {/* Weekend Special Callout */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Sunday & Weekend Special Feast</span>
                </div>
                <p className="text-slate-700 font-medium">{property.food.weekendSpecial}</p>
              </div>

              {/* Daily Meal Schedule Preview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Sample Daily Timetable
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between mb-2">
                      <span>Breakfast & Tea</span>
                      <span className="text-[10px] text-slate-500 font-normal">7:30 AM - 9:30 AM</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{property.food.sampleMenu.breakfast}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between mb-2">
                      <span>Lunch (Mess / Dabba)</span>
                      <span className="text-[10px] text-slate-500 font-normal">12:30 PM - 2:30 PM</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{property.food.sampleMenu.lunch}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <div className="font-bold text-slate-900 flex items-center justify-between mb-2">
                      <span>Dinner</span>
                      <span className="text-[10px] text-slate-500 font-normal">7:45 PM - 10:00 PM</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{property.food.sampleMenu.dinner}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Amenities & Rules */}
          {activeTab === 'amenities' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Room & Building Amenities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: `${property.amenities.wifiSpeedMbps} Mbps Fiber Wi-Fi`, active: true, icon: Wifi },
                    { label: 'Air Conditioned Rooms', active: property.amenities.ac, icon: Wind },
                    { label: '24/7 Power Backup (Gen)', active: property.amenities.powerBackup, icon: Zap },
                    { label: 'RO Mineral Purified Water', active: property.amenities.roWater, icon: Droplets },
                    { label: 'Washing Machine & Terrace', active: property.amenities.washingMachine, icon: Sparkles },
                    { label: 'Individual Study Desk & Chair', active: property.amenities.studyDesk, icon: Check },
                    { label: '24/7 Hot Water Geyser', active: property.amenities.geyser, icon: Check },
                    { label: 'Biometric Access & CCTV', active: property.amenities.biometric, icon: ShieldCheck },
                    { label: `${property.amenities.cleaningFrequency} Housekeeping`, active: true, icon: Sparkles },
                    { label: 'Elevator / Lift', active: property.amenities.lift, icon: Check },
                    { label: `Parking: ${property.amenities.parking}`, active: property.amenities.parking !== 'None', icon: Check },
                    { label: 'Gym / Fitness area', active: property.amenities.gym, icon: Dumbbell },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        item.active
                          ? 'bg-slate-50 border-slate-200 text-slate-800'
                          : 'bg-slate-50/40 border-slate-100 text-slate-400 line-through'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.active ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Hostel Rules & Curfew
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Curfew Timing</span>
                    <p className="font-bold text-slate-900">{property.rules.curfewTime}</p>
                    <p className="text-[11px] text-slate-500">Gate closes at {property.rules.gateCloses}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Visitor Policy</span>
                    <p className="font-bold text-slate-900">{property.rules.visitorsAllowed}</p>
                    <p className="text-[11px] text-slate-500">Smoking & Alcohol: {property.rules.smokingDrinking}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Student Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Score breakdown banner */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="sm:border-r border-slate-200 pb-2 sm:pb-0">
                  <div className="text-2xl font-black text-slate-900">{property.ratings.overall}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Overall Rating</div>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">{property.ratings.food} / 5</div>
                  <div className="text-[10px] uppercase text-slate-500">Food Quality</div>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">{property.ratings.wifi} / 5</div>
                  <div className="text-[10px] uppercase text-slate-500">Wi-Fi Speed</div>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">{property.ratings.cleanliness} / 5</div>
                  <div className="text-[10px] uppercase text-slate-500">Cleanliness</div>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-800">{property.ratings.safety} / 5</div>
                  <div className="text-[10px] uppercase text-slate-500">Safety & Warden</div>
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white border border-slate-200 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{rev.studentName}</span>
                        <span className="text-slate-400 text-[11px] ml-2">({rev.college} · {rev.stayDuration})</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                    {rev.pros.length > 0 && (
                      <div className="flex flex-wrap gap-1 text-[11px] text-emerald-800">
                        {rev.pros.map((pro, pIdx) => (
                          <span key={pIdx} className="bg-emerald-50 px-2 py-0.5 rounded">
                            ✓ {pro}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add a review form */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Are you a student living here? Write an honest review
                </h4>
                {reviewSubmitted ? (
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold">
                    Thank you! Your verified student review was posted successfully.
                  </div>
                ) : (
                  <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Rahul S.)"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                        className="p-2 bg-white border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Your College & Branch"
                        value={reviewCollege}
                        onChange={(e) => setReviewCollege(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-lg"
                      />
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="p-2 bg-white border border-slate-200 rounded-lg"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                        <option value="4">⭐⭐⭐⭐ 4 - Good</option>
                        <option value="3">⭐⭐⭐ 3 - Average</option>
                        <option value="2">⭐⭐ 2 - Below Average</option>
                        <option value="1">⭐ 1 - Poor</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Share your experience regarding food taste, Wi-Fi reliability, warden behavior, and cleanliness..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={2}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Calculator */}
          {activeTab === 'calculator' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Student Total Monthly Outflow Calculator</span>
              </div>
              <p className="text-xs text-slate-500">
                Estimate your exact monthly cost living at {property.name} so you and your parents can plan your budget.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Select Room Type:</label>
                  <select
                    value={calcRoomIndex}
                    onChange={(e) => setCalcRoomIndex(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                  >
                    {property.roomOptions.map((r, i) => (
                      <option key={r.type} value={i}>
                        {r.label} (₹{r.pricePerMonth.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Summer AC Usage:</label>
                  <select
                    value={calcHasAc ? 'yes' : 'no'}
                    onChange={(e) => setCalcHasAc(e.target.value === 'yes')}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="yes">AC Used (~₹800/mo meter)</option>
                    <option value="no">Non-AC / Fan only (~₹200/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Laundry Service:</label>
                  <select
                    value={calcLaundryExtra ? 'yes' : 'no'}
                    onChange={(e) => setCalcLaundryExtra(e.target.value === 'yes')}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="no">In-house machine (Included Free)</option>
                    <option value="yes">Ironing & folding extra (+₹600/mo)</option>
                  </select>
                </div>
              </div>

              {/* Total Calculation Output */}
              <div className="p-4 bg-emerald-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-200 uppercase font-semibold">Total Estimated Monthly Cost</span>
                  <div className="text-2xl font-black">
                    ₹{totalMonthlyOutflow.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-emerald-200"> /month (Meals + Wi-Fi included)</span>
                  </div>
                </div>
                <div className="text-right text-xs text-emerald-200">
                  <span>Initial Security Deposit: </span>
                  <strong className="text-white">₹{selectedRoom.deposit.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Fixed Footer: Direct Owner Contact Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {property.ownerContact.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>{property.ownerContact.name}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-medium">
                  {property.ownerContact.role} · Verified
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Zero Brokerage · Replies within ~{property.ownerContact.responseRateHours} hr
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCall}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call ({property.ownerContact.phone})</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onBookVisit(property);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Free Visit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
