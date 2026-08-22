export type GovernmentRole = 'admin' | 'dispatcher' | 'driver' | 'citizen' | 'operator' | 'beneficiary';
export type PrivateRole = 'private_customer' | 'private_provider' | 'private_driver';
export type UserRole = GovernmentRole | PrivateRole;
export type ServiceMode = 'government' | 'private';

export type RequestPriority = 'Critical' | 'High' | 'Medium' | 'Normal';

export type RequestStatus = 
  | 'Under Review'
  | 'Approved'
  | 'Pending Allocation'
  | 'Allocated'
  | 'In Progress'
  | 'Delivered'
  | 'On Hold'
  | 'Rejected'
  | 'Information Requested'
  | 'Cancelled';

export type TankerStatus = 
  | 'Available'
  | 'On Route'
  | 'At Filling Station'
  | 'Delayed'
  | 'Route Deviation'
  | 'Offline';

export interface WaterRequest {
  id: string; // e.g. WR-2081
  area: string;
  ward: string;
  address?: string;
  quantity: number; // in Liters e.g. 10000
  population: number; // e.g. 4200
  priority: RequestPriority;
  priorityScore: number; // 0 - 100
  priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  requestTime: string; // e.g. "09:12 · Today" or "12 min ago"
  status: RequestStatus;
  urgencyReason?: string;
  vulnerability: 'Critical' | 'High' | 'Medium' | 'Low';
  daysSinceLastDelivery: number;
  
  // Comprehensive Citizen & Organization Form Fields
  requestType?: 'Hospital' | 'School / College' | 'Residential Society' | 'Slum / Informal Settlement' | 'Other';
  otherRequestType?: string;
  waterAvailability?: 'No Water (0%)' | 'Less than 10%' | '10–25%' | '25–50%' | 'More than 50%';
  waterLastDuration?: 'Less than 2 Hours' | '2–6 Hours' | '6–12 Hours' | '12–24 Hours' | 'More than 24 Hours';
  waterSupplyStatus?: 'Completely Stopped' | 'Partial Supply' | 'Irregular Supply' | 'Normal Supply';
  alternativeSource?: 'No' | 'Borewell' | 'Private Tanker' | 'Stored Water' | 'Other';
  otherAlternativeSource?: string;
  lastDelivery?: 'Today' | 'Yesterday' | '2 Days Ago' | 'More than 3 Days Ago' | 'Never';
  isEmergency?: boolean;
  emergencyType?: 'Medical Emergency' | 'Fire' | 'Heat Wave' | 'Water Contamination' | 'Other';
  otherEmergencyType?: string;
  evidencePhotoUrl?: string;
  gpsCaptured?: { lat: number; lng: number; accuracyM?: number; timestamp?: string };

  // Hospital Specific Fields
  hospitalId?: string;
  hospitalName?: string;
  totalBeds?: number;
  hospitalType?: 'Government' | 'Private';
  waterStorageCapacityLiters?: number;
  currentWaterAvailableLiters?: number;
  hospitalEmergencyType?: 'Medical Emergency' | 'ICU Requirement' | 'Operation / Surgery Requirement' | 'Other';
  otherHospitalEmergency?: string;

  // School Specific Fields
  schoolName?: string;
  isSchoolOpenToday?: boolean;
  studentsPresentToday?: number;
  isMidDayMealRunning?: 'Yes' | 'No' | 'Not Applicable';
  areToiletsFunctional?: 'Yes' | 'No' | 'Partially';
  schoolUrgentRequirementType?: 'Drinking Water' | 'Mid-Day Meal' | 'Toilets / Sanitation' | 'Other';
  otherSchoolUrgentType?: string;

  // AI Decision-Support & Explainability
  aiRecommendation?: string;
  aiReasons?: string[];

  // Admin Review & Decision Tracking
  adminStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Information Requested';
  adminDecision?: 'Approved' | 'Rejected' | 'More Info Requested' | 'Under Review';
  adminDecisionTimestamp?: string;
  adminReviewedBy?: string;
  adminReviewedAt?: string;
  adminNotes?: string;
  moreInfoNotes?: string;
  otp?: string;
  eta?: string;

  assignedTankerId?: string;
  assignedStationId?: string;
  etaMinutes?: number;
  contactName: string;
  contactPhone: string;
  locationCoords: { x: number; y: number; lat: number; lng: number };
  otpCode: string;
  verifiedAt?: string;
  deliveryTime?: string;
}

export interface Tanker {
  id: string; // e.g. TK-104
  driverName: string;
  driverPhone: string;
  capacity: number; // e.g. 10000 L
  currentWater: number; // e.g. 6400 L
  status: TankerStatus;
  currentCoords: { x: number; y: number; lat: number; lng: number };
  destinationArea?: string;
  destinationCoords?: { x: number; y: number; lat?: number; lng?: number };
  assignedRequestId?: string;
  assignedStationId?: string;
  etaMinutes?: number;
  waterRemainingLiters: number;
  speedKmH?: number;
  speedKmh?: number;
  fuelPercent: number;
  licensePlate: string;
  hasDeviationAlert?: boolean;
}

export interface FillingStation {
  id: string; // e.g. FS-001, FS-002, ..., FS-011
  name: string; // Exact official name: Parvati, Padmavati, Ramtekdi, etc.
  type: 'PMC tanker filling point' | 'New / Planned Filling Point' | string;
  status: 'Reported Existing' | 'Reported / Expansion Context' | 'Announced' | 'Operational' | 'Refilling' | 'Maintenance' | string;
  dataNote: string;
  isOperational: boolean; // false for Announced / Planned or unverified expansion
  hasLiveTelemetry?: boolean; // false if live water availability not publicly verified
  location: string;
  locationName?: string;
  totalCapacity?: number; // Liters if known
  capacityLiters?: number;
  currentWater?: number | null; // null/undefined if live water availability is not available
  currentStorageLiters?: number | null;
  flowRateLpm?: number; // liters per min
  queueCount?: number;
  availableBays?: number;
  coords: { x: number; y: number; lat: number; lng: number };
}

export interface AIAllocationRecommendation {
  requestId: string;
  targetArea: string;
  priorityScore: number; // 0 - 100
  confidenceScore: number; // e.g. 87%
  recommendedTankerId: string;
  recommendedStationId: string;
  recommendedStationName?: string;
  recommendedStationType?: string;
  stationDataNote?: string;
  etaMinutes: number;
  distanceKm: number;
  savingsMinutes: number;
  factors: {
    currentDemandL: number;
    daysSinceDelivery: number;
    populationAffected: number;
    vulnerability: 'Critical' | 'High' | 'Medium' | 'Normal';
    distanceKm: number;
    tankerAvailability: string;
    fillingPointStatus?: string;
  };
  whyThisTanker: string;
  alternativeTankerIds: string[];
  alternativeStationIds?: string[];
}

export interface ComplaintTicket {
  id: string;
  citizenName: string;
  phone: string;
  area: string;
  tankerId?: string;
  issueType: 'Delayed Tanker' | 'Water Quality' | 'Inadequate Quantity' | 'Driver Conduct' | 'Billing / Extortion' | 'Water Shortage' | string;
  description: string;
  timestamp: string;
  timeAgo?: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  aiResolutionSuggestion?: string;
  aiSuggestion?: string;
  isFacingShortage?: boolean;
  waterSituation?: 'no_water' | 'limited_water' | 'available_water' | string;
  isOtpVerified?: boolean;
}

export type Complaint = ComplaintTicket;

export interface AreaEquityData {
  id: string;
  areaName: string;
  zone: string;
  population: number;
  waterReceivedL: number;
  daysSinceLastDelivery: number;
  status: 'Well-served' | 'Under-served' | 'Critical shortage';
  coords: { x: number; y: number; width?: number; height?: number; lat?: number; lng?: number; radius?: number };
}

export type ActiveNavTab = 
  | 'dashboard'
  | 'requests'
  | 'tankers'
  | 'waterSources'
  | 'liveMap'
  | 'allocations'
  | 'deliveries'
  | 'complaints'
  | 'analytics'
  | 'settings'
  | 'emergency';

// ==========================================
// PRIVATE WATER DELIVERY SYSTEM INTERFACES
// ==========================================

export type PrivateWaterType = 'Potable' | 'Non-Potable' | 'RO Purified' | 'Construction';

export type PrivateCustomerUsageType = 
  | 'Home' 
  | 'Apartment / Society' 
  | 'Office' 
  | 'Restaurant' 
  | 'Construction Site' 
  | 'Shop' 
  | 'Event' 
  | 'Other';

export type PrivateOrderStatus = 
  | 'Order Received'
  | 'Accepted'
  | 'Tanker Assigned'
  | 'On The Way'
  | 'Arrived'
  | 'Delivering'
  | 'Completed'
  | 'Cancelled';

export interface PrivateSavedAddress {
  id: string;
  label: string; // e.g. "Home", "Office", "Clubhouse"
  address: string;
  area: string;
  societyName?: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export interface PrivateCustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  societyName?: string;
  gstNumber?: string;
  usageType: PrivateCustomerUsageType;
  gpsLocation: { lat: number; lng: number };
  savedAddresses: PrivateSavedAddress[];
}

export interface PrivateProvider {
  id: string;
  name: string; // e.g. "AquaFresh Tankers"
  ownerName: string;
  phone: string;
  email: string;
  businessAddress: string;
  rating: number; // e.g. 4.7
  reviewCount: number;
  verified: boolean;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Rejected';
  fleetCount: number;
  pricePer5000L: number; // e.g. 900
  pricePerLiter: number; // e.g. 0.18
  availableCapacities: number[]; // e.g. [2000, 5000, 10000, 15000]
  waterTypes: PrivateWaterType[];
  serviceAreas: string[];
  operatingHours: string;
  etaMinutesAverage: number;
  distanceKmAverage: number;
  vehicleDocuments: {
    fitnessCertificate: boolean;
    waterQualityLabReport: boolean;
    tankerSanitizationAudit: boolean;
  };
  todayStats: {
    totalOrders: number;
    completedOrders: number;
    activeOrders: number;
    pendingOrders: number;
    todayRevenue: number;
  };
}

export interface PrivateTankerVehicle {
  id: string;
  providerId: string;
  providerName: string;
  tankerNumber: string; // e.g. "MH-12-PQ-8841"
  capacityLiters: number; // e.g. 5000
  waterType: PrivateWaterType;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  status: 'Available' | 'Assigned' | 'On The Way' | 'Delivering' | 'Maintenance' | 'Offline';
  currentCoords: { lat: number; lng: number };
  activeOrderId?: string;
}

export interface PrivateOrder {
  id: string; // e.g. "PO-1024"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerArea: string;
  societyName?: string;
  usageType: PrivateCustomerUsageType;
  coords: { lat: number; lng: number };
  
  // Requirement
  quantityLiters: number; // e.g. 5000
  waterType: PrivateWaterType;
  preferredDeliverySlot: string; // e.g. "Today · 2:00 PM – 4:00 PM"
  isImmediate: boolean;
  
  // Provider Selection
  providerId: string;
  providerName: string;
  providerRating: number;
  providerPhone: string;
  
  // Assigned Tanker & Driver
  tankerId?: string;
  tankerNumber?: string;
  driverName?: string;
  driverPhone?: string;
  
  // Financials
  priceWater: number; // e.g. 900
  priceDelivery: number; // e.g. 100
  pricePlatformFee: number; // e.g. 20
  totalAmount: number; // e.g. 1020
  paymentStatus: 'Paid Online' | 'Pending' | 'Cash on Delivery';
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
  paymentTransactionId?: string;
  
  // Tracking & Status
  status: PrivateOrderStatus;
  orderTimestamp: string;
  etaMinutes: number;
  distanceKm: number;
  tankerLiveCoords?: { lat: number; lng: number };
  
  // Verification
  otpCode: string; // 4-digit OTP for delivery verification
  isVerified: boolean;
  verifiedAt?: string;
  deliveryPhotoUrl?: string;
  problemReported?: string;
  customerRating?: number;
  customerFeedback?: string;
  statusHistory: Array<{
    status: PrivateOrderStatus;
    timestamp: string;
    note?: string;
  }>;
}
