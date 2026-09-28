import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Building2,
  Sparkles,
  Check,
  TrendingUp,
  Users,
  MessageSquare,
  ShieldCheck,
  Phone,
  IndianRupee,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PGProperty, College, GenderType, RoomOption } from '../types/pg';

interface OwnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  colleges: College[];
  onAddNewPG: (newPG: PGProperty) => void;
}

export const OwnerPortalModal: React.FC<OwnerPortalModalProps> = ({
  isOpen,
  onClose,
  colleges,
  onAddNewPG,
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'add' | 'leads'>('plans');

  // Form states for new PG listing
  const [pgName, setPgName] = useState('');
  const [tagline, setTagline] = useState('');
  const [gender, setGender] = useState<GenderType>('boys');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [collegeId, setCollegeId] = useState(colleges[0]?.id || 'jntuh-hyd');
  const [distanceMeters, setDistanceMeters] = useState(500);

  // Room pricing
  const [singlePrice, setSinglePrice] = useState(11000);
  const [doublePrice, setDoublePrice] = useState(8000);
  const [triplePrice, setTriplePrice] = useState(6500);
  const [deposit, setDeposit] = useState(7000);

  // Food & Amenities
  const [cuisine, setCuisine] = useState<'South Indian' | 'North Indian' | 'Combined / Multi-cuisine'>('South Indian');
  const [wifiSpeed, setWifiSpeed] = useState(150);
  const [hasAc, setHasAc] = useState(true);
  const [hasPowerBackup, setHasPowerBackup] = useState(true);
  const [hasWashingMachine, setHasWashingMachine] = useState(true);
  const [curfewTime, setCurfewTime] = useState('11:00 PM');

  // Owner details
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'featured' | 'campus_sponsor'>('featured');

  const [formSuccess, setFormSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pgName || !ownerPhone) return;

    const matchedCollege = colleges.find((c) => c.id === collegeId) || colleges[0];
    const walkingMins = Math.max(3, Math.round(distanceMeters / 75));

    const newProperty: PGProperty = {
      id: `pg-owner-${Date.now()}`,
      name: pgName,
      tagline: tagline || `${walkingMins}-min walk from ${matchedCollege.shortName} · Homely Food · High Speed Wi-Fi`,
      gender,
      address: address || `${locality}, Near ${matchedCollege.shortName}`,
      locality: locality || 'College Hub',
      city: matchedCollege.city,
      pincode: '500001',
      coordinates: {
        lat: matchedCollege.centerCoordinates.lat + (Math.random() - 0.5) * 0.01,
        lng: matchedCollege.centerCoordinates.lng + (Math.random() - 0.5) * 0.01,
        mapXPercent: 50 + Math.floor((Math.random() - 0.5) * 20),
        mapYPercent: 50 + Math.floor((Math.random() - 0.5) * 20),
      },
      collegeProximities: [
        {
          collegeId: matchedCollege.id,
          collegeName: matchedCollege.name,
          distanceMeters: Number(distanceMeters),
          walkingMins,
          landmarkRoute: `Direct road to ${matchedCollege.shortName} Main Gate`,
        },
      ],
      roomOptions: [
        {
          type: 'single',
          label: 'Single Private Room',
          pricePerMonth: Number(singlePrice),
          deposit: Number(deposit),
          acAvailable: hasAc,
          attachedBath: true,
          availableBeds: 2,
          totalBeds: 6,
        },
        {
          type: '2-sharing',
          label: '2-Sharing Room',
          pricePerMonth: Number(doublePrice),
          deposit: Number(deposit),
          acAvailable: hasAc,
          attachedBath: true,
          availableBeds: 4,
          totalBeds: 16,
        },
        {
          type: '3-sharing',
          label: '3-Sharing Room',
          pricePerMonth: Number(triplePrice),
          deposit: Math.max(3000, Number(deposit) - 2000),
          acAvailable: false,
          attachedBath: true,
          availableBeds: 3,
          totalBeds: 12,
        },
      ],
      food: {
        included: true,
        mealTimes: ['Breakfast', 'Lunch', 'Dinner'],
        cuisineType: cuisine,
        foodType: 'Veg & Non-Veg (Weekly 2x)',
        weekendSpecial: 'Sunday Chicken Biryani & Veg Pulao',
        sampleMenu: {
          breakfast: 'Idli / Dosa / Upma with chutney and sambar',
          lunch: 'Steamed Rice, Dal, Veg Curry, Sambar & Curd',
          dinner: 'Roti, Dal Tadka, Seasonal Sabzi & Rice',
        },
      },
      amenities: {
        wifiSpeedMbps: Number(wifiSpeed),
        ac: hasAc,
        powerBackup: hasPowerBackup,
        roWater: true,
        washingMachine: hasWashingMachine,
        refrigerator: true,
        cleaningFrequency: 'Daily',
        cctv: true,
        warden: true,
        biometric: true,
        lift: true,
        parking: '2-Wheeler',
        studyDesk: true,
        gym: false,
        geyser: true,
      },
      rules: {
        curfewTime,
        noticePeriodDays: 30,
        gateCloses: curfewTime,
        visitorsAllowed: 'Allowed until 8 PM',
        smokingDrinking: 'Strictly Prohibited',
      },
      photos: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
      ],
      ownerContact: {
        name: ownerName || 'PG Manager',
        role: 'Owner',
        phone: ownerPhone,
        whatsapp: ownerWhatsapp || ownerPhone.replace(/\D/g, ''),
        responseRateHours: 1,
        verified: true,
      },
      ratings: {
        overall: 4.8,
        food: 4.7,
        cleanliness: 4.8,
        wifi: 4.9,
        safety: 4.9,
        totalReviews: 1,
      },
      reviews: [
        {
          id: `rev-${Date.now()}`,
          studentName: 'Verified Resident',
          college: matchedCollege.shortName,
          roomType: '2-Sharing',
          stayDuration: 'New Listing',
          date: 'Just now',
          rating: 5,
          comment: 'Clean rooms with high speed Wi-Fi and friendly management.',
          pros: ['Very close to campus', 'Fast Wi-Fi'],
          cons: [],
          verifiedResident: true,
          ratingsBreakdown: { food: 5, wifi: 5, cleanliness: 5, safety: 5 },
        },
      ],
      isSponsored: selectedPlan !== 'standard',
      isVerifiedBadge: true,
      featuredTier: selectedPlan,
      electricityCharges: 'Included up to 50 units',
      maintenanceFee: 0,
      createdAt: '2026-09-28',
    };

    onAddNewPG(newProperty);
    setFormSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PG Owner & Property Manager Portal</h3>
              <p className="text-xs text-slate-400">
                Direct student bookings · Zero brokerage · Guaranteed high occupancy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 border-b border-slate-200 flex gap-4 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'plans'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Monetization & Promotion Plans
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'add'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            List a New PG (+Add Property)
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'leads'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Owner Leads Dashboard (Demo)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: Monetization Plans */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
                  CampusNest Business Model
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  Connect Directly with 50,000+ Enrolling Students
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  PG owners and property managers pay to list, promote, and sponsor properties near top college gates.
                  No brokerage cuts taken from students!
                </p>
              </div>

              {/* 3 Tier Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Free Tier */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Basic Listing</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      ₹0
                      <span className="text-xs font-normal text-slate-500"> /always free</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 mb-4">
                      Get discovered by local college students looking in your area.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>1 PG Property Listing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Standard Search Visibility</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Direct Student Calls</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlan('standard');
                      setActiveTab('add');
                    }}
                    className="mt-6 w-full py-2 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Select Basic Free
                  </button>
                </div>

                {/* Pro Tier (Popular) */}
                <div className="border-2 border-emerald-600 rounded-xl p-5 bg-white relative shadow-lg flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Most Popular for Owners
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Campus Pro</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      ₹499
                      <span className="text-xs font-normal text-slate-500"> /month</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 mb-4">
                      Top 3 search ranking for your college + Instant 1-click WhatsApp inquiries.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span><strong>Featured Partner</strong> Badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Top 3 search results for campus</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Direct 1-Click WhatsApp Leads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>4x More Student Room Enquiries</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlan('featured');
                      setActiveTab('add');
                    }}
                    className="mt-6 w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                  >
                    Get Campus Pro
                  </button>
                </div>

                {/* Campus Sponsor Tier */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-900 text-white flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Campus Sponsor
                    </div>
                    <div className="text-2xl font-black text-white mt-1">
                      ₹1,499
                      <span className="text-xs font-normal text-slate-400"> /month</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 mb-4">
                      Dominant pinned banner across the college radar and instant notifications.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Campus Gate Pinned Banner</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Verified In-Person Audit Badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Room Visit Auto-Scheduler</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>100% Zero Bed Vacancy Guarantee</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlan('campus_sponsor');
                      setActiveTab('add');
                    }}
                    className="mt-6 w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-lg text-xs hover:from-amber-400 hover:to-amber-500 cursor-pointer"
                  >
                    Become Campus Sponsor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Add New PG Form */}
          {activeTab === 'add' && (
            <div>
              {formSuccess ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">PG Listed Successfully!</h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Your property &ldquo;{pgName}&rdquo; is now live on CampusNest search and radar.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950">
                    <div>
                      <span className="font-bold">Listing Tier Selected: </span>
                      <span className="capitalize font-semibold text-emerald-700">
                        {selectedPlan === 'standard'
                          ? 'Basic Free'
                          : selectedPlan === 'featured'
                          ? 'Campus Pro (₹499/mo)'
                          : 'Campus Sponsor (₹1,499/mo)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('plans')}
                      className="text-xs underline text-emerald-800 hover:text-emerald-950"
                    >
                      Change Plan
                    </button>
                  </div>

                  {/* PG Basics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PG / Hostel Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sri Balaji Luxury Boys PG"
                        value={pgName}
                        onChange={(e) => setPgName(e.target.value)}
                        required
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PG Gender Type *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as GenderType)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      >
                        <option value="boys">Boys PG / Hostel</option>
                        <option value="girls">Girls PG / Hostel</option>
                        <option value="unisex">Co-ed / Unisex Student Living</option>
                      </select>
                    </div>
                  </div>

                  {/* College Proximity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nearest College *</label>
                      <select
                        value={collegeId}
                        onChange={(e) => setCollegeId(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      >
                        {colleges.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.shortName} ({c.city})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Distance from Campus Gate (Meters) *
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="5000"
                        step="50"
                        value={distanceMeters}
                        onChange={(e) => setDistanceMeters(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      />
                    </div>
                  </div>

                  {/* Locality & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Locality / Area *</label>
                      <input
                        type="text"
                        placeholder="e.g. KPHB Phase 1, Near Metro"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        required
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Full Street Address</label>
                      <input
                        type="text"
                        placeholder="e.g. Plot No 12, Road No 3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      />
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800">Monthly Rent per Sharing & Deposit</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500">Single Room (₹/mo)</label>
                        <input
                          type="number"
                          value={singlePrice}
                          onChange={(e) => setSinglePrice(Number(e.target.value))}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">2-Sharing (₹/mo)</label>
                        <input
                          type="number"
                          value={doublePrice}
                          onChange={(e) => setDoublePrice(Number(e.target.value))}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">3-Sharing (₹/mo)</label>
                        <input
                          type="number"
                          value={triplePrice}
                          onChange={(e) => setTriplePrice(Number(e.target.value))}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Security Deposit (₹)</label>
                        <input
                          type="number"
                          value={deposit}
                          onChange={(e) => setDeposit(Number(e.target.value))}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Food & Amenities */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Cuisine Type</label>
                      <select
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value as typeof cuisine)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="South Indian">South Indian</option>
                        <option value="North Indian">North Indian</option>
                        <option value="Combined / Multi-cuisine">Combined / Multi-cuisine</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Wi-Fi Speed (Mbps)</label>
                      <input
                        type="number"
                        value={wifiSpeed}
                        onChange={(e) => setWifiSpeed(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Curfew Time</label>
                      <input
                        type="text"
                        value={curfewTime}
                        onChange={(e) => setCurfewTime(e.target.value)}
                        placeholder="e.g. 11:00 PM or No Curfew"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Owner Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Owner / Manager Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Suresh Reddy"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Calling Phone *</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98480 12345"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        required
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. 919848012345"
                        value={ownerWhatsapp}
                        onChange={(e) => setOwnerWhatsapp(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish PG Listing Live</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Owner Leads Demo */}
          {activeTab === 'leads' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-2xl font-black text-slate-900">842</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-1">Student Views this week</div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-2xl font-black text-emerald-700">38</div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800 mt-1">Direct WhatsApp Inquiries</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-2xl font-black text-blue-700">14</div>
                  <div className="text-[10px] uppercase font-bold text-blue-800 mt-1">Room Visits Scheduled</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Recent Student Inquiries
                </h4>
                <div className="space-y-2">
                  {[
                    { student: 'Pranav K.', college: 'JNTUH (CSE)', type: '2-Sharing AC', time: '18 mins ago', status: 'Chat Started' },
                    { student: 'Sneha R.', college: 'JNTUH (ECE)', type: 'Single Room', time: '1 hour ago', status: 'Visit Scheduled' },
                    { student: 'Manish V.', college: 'IIIT Hyd', type: '3-Sharing Economy', time: '3 hours ago', status: 'Call Connected' },
                  ].map((lead, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{lead.student}</span>
                        <span className="text-slate-400 text-[11px] ml-2">({lead.college} · {lead.type})</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{lead.time}</div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {lead.status}
                      </span>
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
