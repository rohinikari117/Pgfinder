export type SharingType = 'single' | '2-sharing' | '3-sharing' | '4-sharing';
export type GenderType = 'boys' | 'girls' | 'unisex';

export interface RoomOption {
  type: SharingType;
  label: string;
  pricePerMonth: number;
  deposit: number;
  acAvailable: boolean;
  attachedBath: boolean;
  availableBeds: number;
  totalBeds: number;
}

export interface CollegeProximity {
  collegeId: string;
  collegeName: string;
  distanceMeters: number;
  walkingMins: number;
  travelTimeBus?: string;
  landmarkRoute?: string;
}

export interface FoodMenu {
  included: boolean;
  mealTimes: ('Breakfast' | 'Lunch' | 'Dinner' | 'Evening Tea')[];
  cuisineType: 'South Indian' | 'North Indian' | 'Combined / Multi-cuisine';
  foodType: 'Pure Veg' | 'Veg & Non-Veg (Weekly 2x)' | 'Veg & Egg';
  weekendSpecial: string;
  sampleMenu: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface Amenities {
  wifiSpeedMbps: number;
  ac: boolean;
  powerBackup: boolean;
  roWater: boolean;
  washingMachine: boolean;
  refrigerator: boolean;
  cleaningFrequency: 'Daily' | 'Alternate Days' | 'Twice Weekly';
  cctv: boolean;
  warden: boolean;
  biometric: boolean;
  lift: boolean;
  parking: '2-Wheeler' | '2 & 4-Wheeler' | 'None';
  studyDesk: boolean;
  gym: boolean;
  geyser: boolean;
}

export interface Rules {
  curfewTime: string;
  noticePeriodDays: number;
  gateCloses: string;
  visitorsAllowed: 'Allowed until 8 PM' | 'Common area only' | 'Parents only' | 'No visitors';
  smokingDrinking: 'Strictly Prohibited' | 'Designated Terrace Only';
}

export interface OwnerContact {
  name: string;
  role: 'Owner' | 'Property Manager' | 'Warden';
  phone: string;
  whatsapp: string;
  responseRateHours: number;
  verified: boolean;
}

export interface Review {
  id: string;
  studentName: string;
  college: string;
  roomType: string;
  stayDuration: string;
  date: string;
  rating: number;
  comment: string;
  pros: string[];
  cons: string[];
  verifiedResident: boolean;
  ratingsBreakdown: {
    food: number;
    wifi: number;
    cleanliness: number;
    safety: number;
  };
}

export interface PGProperty {
  id: string;
  name: string;
  tagline: string;
  gender: GenderType;
  address: string;
  locality: string;
  city: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
    mapXPercent: number; // for interactive campus visual map (0-100)
    mapYPercent: number; // for interactive campus visual map (0-100)
  };
  collegeProximities: CollegeProximity[];
  roomOptions: RoomOption[];
  food: FoodMenu;
  amenities: Amenities;
  rules: Rules;
  photos: string[];
  ownerContact: OwnerContact;
  ratings: {
    overall: number;
    food: number;
    cleanliness: number;
    wifi: number;
    safety: number;
    totalReviews: number;
  };
  reviews: Review[];
  isSponsored?: boolean;
  isVerifiedBadge: boolean;
  featuredTier?: 'standard' | 'featured' | 'campus_sponsor';
  electricityCharges: string; // e.g. "Included in rent" or "₹10/unit meter"
  maintenanceFee?: number;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  locality: string;
  popularAreas: string[];
  centerCoordinates: {
    lat: number;
    lng: number;
    mapXPercent: number;
    mapYPercent: number;
  };
  totalStudents: string;
  campusBadge: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCollegeId: string;
  gender: 'all' | GenderType;
  maxDistanceMeters: number;
  maxBudget: number;
  sharingTypes: SharingType[];
  foodIncludedOnly: boolean;
  acOnly: boolean;
  zeroCurfewOnly: boolean;
  attachedBathOnly: boolean;
  powerBackupOnly: boolean;
  washingMachineOnly: boolean;
  sortBy: 'recommended' | 'distance' | 'price_low' | 'price_high' | 'rating';
}
