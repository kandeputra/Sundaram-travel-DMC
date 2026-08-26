export type UserRole =
  | "customer"
  | "supplier"
  | "sales_agent"
  | "operations"
  | "finance"
  | "customer_service"
  | "content_editor"
  | "admin"
  | "super_admin";

export type CurrencyCode = "IDR" | "USD" | "MYR" | "INR" | "AUD" | "SGD" | "EUR" | "GBP";

export type LanguageCode = "en" | "id";

export type BookingStatus =
  | "draft"
  | "pending_payment"
  | "payment_processing"
  | "paid"
  | "pending_confirmation"
  | "confirmed"
  | "rejected_by_supplier"
  | "reschedule_requested"
  | "cancellation_requested"
  | "cancelled"
  | "refund_processing"
  | "partially_refunded"
  | "refunded"
  | "completed"
  | "no_show"
  | "expired";

export type PaymentMethod =
  | "midtrans"
  | "xendit"
  | "stripe"
  | "paypal"
  | "bank_transfer"
  | "virtual_account"
  | "credit_card"
  | "qris"
  | "e_wallet"
  | "pay_at_office";

export type PaymentStatus = "pending" | "settlement" | "capture" | "deny" | "expire" | "cancel" | "refunded";

export type MembershipTier = "Explorer" | "Traveller" | "Voyager" | "Elite";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  supplierVerified?: boolean;
  membershipTier?: MembershipTier;
  rewardPoints?: number;
  referralCode?: string;
  createdAt: string;
}

export interface SavedTraveler {
  id: string;
  userId: string;
  title: "Mr" | "Mrs" | "Ms" | "Mstr" | "Miss";
  fullName: string;
  passportNumber?: string;
  nationality: string;
  dateOfBirth?: string;
  type: "adult" | "child" | "infant";
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  featured: boolean;
  activityCount: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameId: string; // Indonesian
  slug: string;
  icon: string;
  description: string;
  bannerImage: string;
}

export interface PackageOption {
  id: string;
  productId: string;
  name: string;
  description: string;
  inclusions: string[];
  exclusions: string[];
  priceIdr: number;
  childPriceIdr?: number;
  infantPriceIdr?: number;
  supplierNetPriceIdr: number;
  commissionPercent: number;
  taxPercent: number;
  dailyCapacity: number;
  minParticipants: number;
  maxParticipants: number;
  timeSlots: string[];
  isAvailable: boolean;
  instantConfirmation: boolean;
  cancellationPolicy: "Free cancellation up to 24 hours before" | "Free cancellation up to 48 hours before" | "Non-refundable";
}

export interface Product {
  id: string;
  title: string;
  titleId?: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  categoryId: string;
  categoryName: string;
  supplierId: string;
  supplierName: string;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  startingPriceIdr: number;
  originalPriceIdr?: number;
  discountPercent?: number;
  images: string[];
  videoUrl?: string;
  highlights: string[];
  highlightsId?: string[];
  fullDescription: string;
  fullDescriptionId?: string;
  locationAddress: string;
  mapCoordinates: { lat: number; lng: number };
  duration: string;
  languages: string[];
  whatToBring: string[];
  dressCode?: string;
  accessibility: string[];
  instantConfirmation: boolean;
  freeCancellation: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isPromoted?: boolean;
  isPrivateTour?: boolean;
  isChildFriendly?: boolean;
  pickupAvailable: boolean;
  pickupAreas?: string[];
  meetingPoint?: string;
  operatingHours: string;
  confirmationMethod: "Instant confirmation" | "Confirmation within 24 hours";
  importantInfo: string[];
  faqs: { question: string; answer: string }[];
  packages: PackageOption[];
  status: "published" | "pending_approval" | "draft" | "archived";
  createdAt: string;
}

export interface BookingParticipantBreakdown {
  adults: number;
  children: number;
  infants: number;
}

export interface BookingOptionalService {
  id: string;
  name: string;
  priceIdr: number;
  selected: boolean;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. BST-260826-A8F4
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  productTitle: string;
  productImage: string;
  packageId: string;
  packageName: string;
  destinationName: string;
  supplierId: string;
  supplierName: string;
  travelDate: string; // YYYY-MM-DD
  timeSlot: string;
  participants: BookingParticipantBreakdown;
  travelers: {
    fullName: string;
    type: "adult" | "child" | "infant";
    passportOrId?: string;
    nationality?: string;
  }[];
  pickupOption: "hotel_pickup" | "meeting_point" | "not_needed";
  pickupLocation?: string;
  meetingPoint?: string;
  optionalServices: BookingOptionalService[];
  specialRequests?: string;
  promoCodeApplied?: string;
  discountAmountIdr: number;
  pointsRedeemed: number;
  pointsDiscountIdr: number;
  basePriceIdr: number;
  totalAmountIdr: number;
  // Historical conversion snapshot:
  currencySelected: CurrencyCode;
  exchangeRateUsed: number;
  totalAmountConverted: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  qrVoucherCode: string;
  voucherRedeemed: boolean;
  voucherRedeemedAt?: string;
  voucherRedeemedBy?: string;
  statusHistory: {
    status: BookingStatus;
    timestamp: string;
    note: string;
    updatedBy: string;
  }[];
  // Operations assignment
  assignedDriver?: string;
  assignedVehicle?: string;
  assignedGuide?: string;
  operationalNotes?: string;
  // Affiliate reference
  affiliateRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userNationality?: string;
  ratingOverall: number;
  ratingService: number;
  ratingValue: number;
  ratingExperience: number;
  travelType: "Solo" | "Couple" | "Family with Kids" | "Friends" | "Business";
  travelDate: string;
  reviewTitle: string;
  reviewText: string;
  reviewPhotos?: string[];
  supplierResponse?: {
    text: string;
    respondedAt: string;
    respondedBy: string;
  };
  helpfulVotes: number;
  status: "approved" | "pending_moderation" | "rejected";
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  title: string;
  discountType: "percentage" | "fixed_idr";
  discountValue: number; // e.g. 15 for 15% or 100000 for Rp 100k
  minSpendIdr: number;
  maxDiscountIdr?: number;
  applicableCategoryIds?: string[];
  applicableDestinationIds?: string[];
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  type: "earned" | "redeemed" | "bonus" | "referral";
  points: number;
  description: string;
  referenceBookingId?: string;
  createdAt: string;
}

export interface CustomTripRequest {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: number;
  adults: number;
  children: number;
  infants: number;
  hotelCategory: "Standard 3-Star" | "Deluxe 4-Star" | "Luxury 5-Star / Private Pool Villa";
  activities: string[];
  transportation: "Private Car with Driver" | "Self Drive" | "Scooter" | "VIP Luxury Van";
  guideLanguage: string;
  mealPreferences: string;
  budgetPerPersonIdr: number;
  budgetCurrency: CurrencyCode;
  specialRequests?: string;
  status: "new" | "ai_generated" | "agent_drafted" | "quote_sent" | "accepted" | "converted_to_booking";
  aiGeneratedItinerary?: any;
  quotedPriceIdr?: number;
  assignedAgent?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  bookingReference?: string;
  category: "Booking Inquiry" | "Cancellation & Refund" | "Date Reschedule" | "Payment Issue" | "Feedback";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  subject: string;
  messages: {
    id: string;
    sender: "customer" | "support_agent" | "system";
    senderName: string;
    message: string;
    timestamp: string;
    attachmentUrl?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Affiliate {
  id: string;
  userId: string;
  code: string;
  name: string;
  email: string;
  commissionRate: number; // e.g. 5%
  totalClicks: number;
  totalBookings: number;
  totalCommissionIdr: number;
  pendingPayoutIdr: number;
  status: "active" | "pending" | "suspended";
  createdAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  publishedAt: string;
  tags: string[];
}

export interface ExchangeRateTable {
  [currency: string]: number; // Rate to convert from 1 IDR to Target Currency (or IDR multiplier)
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface GeneratedItinerary {
  tripTitle: string;
  summary: string;
  estimatedCostPerPersonIdr: number;
  dailySchedule: {
    day: number;
    title: string;
    description: string;
    highlights: string[];
    recommendedMeals: string;
  }[];
  includedPerks: string[];
  suggestedVehicle: string;
}

export interface TripInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  durationDays: number;
  paxCount: number;
  travelStyle: string;
  preferredRegions: string[];
  status: "new" | "quoted" | "confirmed";
  generatedItinerary?: GeneratedItinerary;
  createdAt: string;
}

export interface TravelGuide {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  readTimeMinutes: number;
  author: string;
  publishedDate: string;
  summary: string;
  content: string;
  tags: string[];
}

