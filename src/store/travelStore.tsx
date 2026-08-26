import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  CurrencyCode,
  LanguageCode,
  Product,
  Destination,
  ProductCategory,
  Booking,
  BookingStatus,
  Review,
  PromoCode,
  SavedTraveler,
  CustomTripRequest,
  SupportTicket,
  Affiliate,
  Article,
  AuditLog,
  ExchangeRateTable,
} from "../types";
import {
  SEED_DESTINATIONS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_PROMO_CODES,
  SEED_ARTICLES,
  SEED_USERS,
  SEED_REVIEWS,
} from "../data/seedData";
import { DEFAULT_EXCHANGE_RATES, convertFromIdr, convertToIdr } from "../utils/currency";

interface TravelStoreContextType {
  // Localization & Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  exchangeRates: Record<CurrencyCode, number>;
  updateExchangeRate: (c: CurrencyCode, rate: number) => void;

  // Auth & Roles
  currentUser: User;
  switchRole: (role: UserRole) => void;
  users: User[];
  loginUser: (email: string) => boolean;

  // Catalog
  destinations: Destination[];
  categories: ProductCategory[];
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Bookings
  bookings: Booking[];
  createBooking: (
    bookingData: Omit<
      Booking,
      | "id"
      | "bookingReference"
      | "createdAt"
      | "updatedAt"
      | "bookingStatus"
      | "qrVoucherCode"
      | "voucherRedeemed"
      | "statusHistory"
    >
  ) => Booking;
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus, note?: string) => void;
  assignBookingOperations: (
    bookingId: string,
    ops: { assignedDriver?: string; assignedVehicle?: string; assignedGuide?: string; operationalNotes?: string }
  ) => void;
  redeemVoucher: (qrCode: string, staffName: string) => { success: boolean; message: string; booking?: Booking };

  // Saved Travelers
  savedTravelers: SavedTraveler[];
  addSavedTraveler: (traveler: Omit<SavedTraveler, "id" | "userId">) => void;
  deleteSavedTraveler: (id: string) => void;

  // Promotions & Rewards
  promoCodes: PromoCode[];
  validatePromoCode: (code: string, amountIdr: number) => { valid: boolean; discountIdr: number; message: string };
  rewardPoints: number;
  redeemRewardPoints: (points: number) => number;

  // Custom Trip / Inquiries
  customTrips: CustomTripRequest[];
  createCustomTripRequest: (req: Omit<CustomTripRequest, "id" | "status" | "createdAt">) => CustomTripRequest;
  updateCustomTripStatus: (id: string, updates: Partial<CustomTripRequest>) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "createdAt" | "helpfulVotes" | "status">) => void;
  voteHelpful: (reviewId: string) => void;
  respondToReview: (reviewId: string, responseText: string, respondedBy: string) => void;

  // Support
  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: Omit<SupportTicket, "id" | "ticketNumber" | "status" | "messages" | "createdAt" | "updatedAt">, initialMsg: string) => SupportTicket;
  replyToTicket: (ticketId: string, message: string, sender: "customer" | "support_agent") => void;

  // Affiliates
  affiliates: Affiliate[];
  activeAffiliateCode: string | null;
  setActiveAffiliateCode: (code: string | null) => void;

  // Articles & Travel Guides & FAQs
  articles: Article[];
  travelGuides: any[];
  faqs: { id: string; question: string; answer: string }[];
  addArticle: (art: Omit<Article, "id" | "publishedAt">) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: string, details: string) => void;

  // Convenience Aliases & Helpers
  tripInquiries: any[];
  addSupportTicket: (ticket: any) => void;
  updateTicketStatus: (ticketId: string, status: string) => void;
  requestRefund: (bookingId: string, reason: string) => void;
  processRefund: (bookingId: string) => void;
  updateBookingDriver: (bookingId: string, driver: string) => void;
  createPromoCode: (promo: any) => void;
  clearCompareProducts: () => void;
  setIsAuthModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  isRoleSwitcherOpen: boolean;
  setIsRoleSwitcherOpen: (open: boolean) => void;

  // Active UI Navigation state helper
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedDestinationId: string | null;
  setSelectedDestinationId: (id: string | null) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Modals & Panels
  isPlanMyTripOpen: boolean;
  setIsPlanMyTripOpen: (open: boolean) => void;
  isQRScannerOpen: boolean;
  setIsQRScannerOpen: (open: boolean) => void;
  activeVoucherBooking: Booking | null;
  setActiveVoucherBooking: (b: Booking | null) => void;
  activeCompareProductIds: string[];
  toggleCompareProduct: (id: string) => void;
  clearCompare: () => void;
}

const TravelStoreContext = createContext<TravelStoreContextType | null>(null);

const STORAGE_KEYS = {
  CURRENCY: "sundaram_currency",
  LANG: "sundaram_lang",
  USER: "sundaram_current_user",
  BOOKINGS: "sundaram_bookings",
  WISHLIST: "sundaram_wishlist",
  PRODUCTS: "sundaram_products",
  TRAVELERS: "sundaram_saved_travelers",
  CUSTOM_TRIPS: "sundaram_custom_trips",
  REVIEWS: "sundaram_reviews",
  TICKETS: "sundaram_tickets",
  AFFILIATES: "sundaram_affiliates",
  EXCHANGE_RATES: "sundaram_exchange_rates",
  AUDIT_LOGS: "sundaram_audit_logs",
};

export const TravelStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Currency & Language
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode) || "USD";
  });
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as LanguageCode) || "en";
  });
  const [exchangeRates, setExchangeRates] = useState<Record<CurrencyCode, number>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATES);
    return saved ? JSON.parse(saved) : DEFAULT_EXCHANGE_RATES;
  });

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
  };

  const setLanguage = (l: LanguageCode) => {
    setLanguageState(l);
    localStorage.setItem(STORAGE_KEYS.LANG, l);
  };

  const updateExchangeRate = (c: CurrencyCode, rate: number) => {
    setExchangeRates((prev) => {
      const updated = { ...prev, [c]: rate };
      localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATES, JSON.stringify(updated));
      return updated;
    });
  };

  // Auth & Roles
  const [users] = useState<User[]>(SEED_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return SEED_USERS[0]; // default to Sarah Jenkins (Customer)
  });

  const switchRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || {
      ...currentUser,
      role,
      name: `${role.toUpperCase().replace("_", " ")} User`,
    };
    setCurrentUser(matched);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(matched));
    logAction("SWITCH_ROLE", `Switched active simulation persona to role: ${role}`);
  };

  const loginUser = (email: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
      return true;
    }
    // Create new mock user
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      name: email.split("@")[0],
      role: "customer",
      membershipTier: "Explorer",
      rewardPoints: 100,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return true;
  };

  // Catalog
  const [destinations] = useState<Destination[]>(SEED_DESTINATIONS);
  const [categories] = useState<ProductCategory[]>(SEED_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  const addProduct = (prodData: Omit<Product, "id" | "createdAt">): Product => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    });
    logAction("CREATE_PRODUCT", `Added product: ${newProduct.title}`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    });
    logAction("UPDATE_PRODUCT", `Updated product ID: ${id}`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated;
    });
    logAction("DELETE_PRODUCT", `Deleted product ID: ${id}`);
  };

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : ["prod-ubud-cultural", "prod-batur-sunrise"];
  });

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const updated = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  // Saved Travelers
  const [savedTravelers, setSavedTravelers] = useState<SavedTraveler[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRAVELERS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "trav-1",
            userId: "usr-customer-1",
            title: "Ms",
            fullName: "Sarah Jenkins",
            passportNumber: "N8892104",
            nationality: "Australia",
            type: "adult",
          },
          {
            id: "trav-2",
            userId: "usr-customer-1",
            title: "Mr",
            fullName: "Markus Jenkins",
            passportNumber: "N8892105",
            nationality: "Australia",
            type: "adult",
          },
        ];
  });

  const addSavedTraveler = (trav: Omit<SavedTraveler, "id" | "userId">) => {
    const newTrav: SavedTraveler = {
      ...trav,
      id: `trav-${Date.now()}`,
      userId: currentUser.id,
    };
    setSavedTravelers((prev) => {
      const updated = [...prev, newTrav];
      localStorage.setItem(STORAGE_KEYS.TRAVELERS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSavedTraveler = (id: string) => {
    setSavedTravelers((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TRAVELERS, JSON.stringify(updated));
      return updated;
    });
  };

  // Seed Initial Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (saved) return JSON.parse(saved);

    const initialBookings: Booking[] = [
      {
        id: "book-demo-1",
        bookingReference: "BST-260826-A8F4",
        userId: "usr-customer-1",
        customerName: "Sarah Jenkins",
        customerEmail: "sarah.jenkins@example.com",
        customerPhone: "+61 412 345 678",
        productId: "prod-ubud-cultural",
        productTitle: "Ubud Cultural Heritage Tour: Sacred Monkey Forest & Waterfall",
        productImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        packageId: "pkg-ubud-all-inc",
        packageName: "All-Inclusive VIP (With Lunch & Jungle Swing)",
        destinationName: "Ubud",
        supplierId: "sup-balisundaram",
        supplierName: "PT. Bali Sundaram Tours",
        travelDate: "2026-08-28",
        timeSlot: "08:30",
        participants: { adults: 2, children: 0, infants: 0 },
        travelers: [
          { fullName: "Sarah Jenkins", type: "adult", passportOrId: "N8892104", nationality: "Australia" },
          { fullName: "Markus Jenkins", type: "adult", passportOrId: "N8892105", nationality: "Australia" },
        ],
        pickupOption: "hotel_pickup",
        pickupLocation: "Alila Ubud Resort (Room 204)",
        optionalServices: [{ id: "opt-fast-track", name: "VIP Fast Track Concierge", priceIdr: 150000, selected: true }],
        specialRequests: "Celebrating our wedding anniversary; front seats in vehicle requested.",
        promoCodeApplied: "BALIWELCOME15",
        discountAmountIdr: 150000,
        pointsRedeemed: 200,
        pointsDiscountIdr: 20000,
        basePriceIdr: 1360000,
        totalAmountIdr: 1340000,
        currencySelected: "USD",
        exchangeRateUsed: 0.000063,
        totalAmountConverted: 84.42,
        paymentMethod: "stripe",
        paymentStatus: "settlement",
        bookingStatus: "confirmed",
        qrVoucherCode: "BST-260826-A8F4-VOUCHER",
        voucherRedeemed: false,
        statusHistory: [
          { status: "pending_payment", timestamp: "2026-08-26T10:00:00Z", note: "Order placed by customer", updatedBy: "System" },
          { status: "paid", timestamp: "2026-08-26T10:02:15Z", note: "Payment settled via Stripe", updatedBy: "Payment Gateway" },
          { status: "confirmed", timestamp: "2026-08-26T10:02:16Z", note: "Instant confirmation issued with QR voucher", updatedBy: "System" },
        ],
        assignedDriver: "I Wayan Sudiarta (+62 812 3999 111)",
        assignedVehicle: "Toyota Innova Reborn (DK 1842 AB)",
        assignedGuide: "I Ketut Ari (License #BALI-GUIDE-882)",
        operationalNotes: "Anniversary couple. Flower garland ready on vehicle pickup.",
        createdAt: "2026-08-26T10:00:00Z",
        updatedAt: "2026-08-26T10:02:16Z",
      },
      {
        id: "book-demo-2",
        bookingReference: "BST-260820-K9B3",
        userId: "usr-customer-1",
        customerName: "Sarah Jenkins",
        customerEmail: "sarah.jenkins@example.com",
        customerPhone: "+61 412 345 678",
        productId: "prod-airport-transfer",
        productTitle: "Bali Ngurah Rai Airport (DPS) Private Luxury Transfer",
        productImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        packageId: "pkg-airport-ubud",
        packageName: "Airport to Ubud / Canggu / Uluwatu",
        destinationName: "Seminyak",
        supplierId: "sup-balisundaram",
        supplierName: "PT. Bali Sundaram Fleet",
        travelDate: "2026-08-26",
        timeSlot: "14:15",
        participants: { adults: 2, children: 0, infants: 0 },
        travelers: [
          { fullName: "Sarah Jenkins", type: "adult", nationality: "Australia" },
        ],
        pickupOption: "meeting_point",
        meetingPoint: "DPS International Arrival Hall (Gate 3 - Sundaram Signboard)",
        optionalServices: [],
        discountAmountIdr: 0,
        pointsRedeemed: 0,
        pointsDiscountIdr: 0,
        basePriceIdr: 320000,
        totalAmountIdr: 320000,
        currencySelected: "AUD",
        exchangeRateUsed: 0.000096,
        totalAmountConverted: 30.72,
        paymentMethod: "credit_card",
        paymentStatus: "settlement",
        bookingStatus: "completed",
        qrVoucherCode: "BST-260820-K9B3-VOUCHER",
        voucherRedeemed: true,
        voucherRedeemedAt: "2026-08-26T14:30:00Z",
        voucherRedeemedBy: "Made Wardana (Airport Ops Staff)",
        statusHistory: [
          { status: "confirmed", timestamp: "2026-08-20T08:00:00Z", note: "Booking confirmed", updatedBy: "System" },
          { status: "completed", timestamp: "2026-08-26T15:30:00Z", note: "Passenger dropped off safely at Alila Ubud", updatedBy: "Driver" },
        ],
        assignedDriver: "Made Wardana (+62 811 2345 6789)",
        assignedVehicle: "Toyota Avanza (DK 1422 CD)",
        createdAt: "2026-08-20T08:00:00Z",
        updatedAt: "2026-08-26T15:30:00Z",
      },
    ];
    return initialBookings;
  });

  const createBooking = (bookingData: Omit<Booking, "id" | "bookingReference" | "createdAt" | "updatedAt" | "bookingStatus" | "qrVoucherCode" | "voucherRedeemed" | "statusHistory">): Booking => {
    const timestamp = new Date();
    const dateStr = timestamp.toISOString().slice(2, 10).replace(/-/g, ""); // 260826
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const reference = `BST-${dateStr}-${randomHex}`;
    const qrCode = `${reference}-VOUCHER`;

    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      bookingReference: reference,
      qrVoucherCode: qrCode,
      voucherRedeemed: false,
      bookingStatus: "confirmed",
      statusHistory: [
        {
          status: "pending_payment",
          timestamp: timestamp.toISOString(),
          note: "Order created by customer",
          updatedBy: currentUser.name,
        },
        {
          status: "paid",
          timestamp: timestamp.toISOString(),
          note: `Payment confirmed via ${bookingData.paymentMethod || "online gateway"}`,
          updatedBy: "Payment Engine",
        },
        {
          status: "confirmed",
          timestamp: timestamp.toISOString(),
          note: "Instant electronic voucher generated with secure QR code",
          updatedBy: "System",
        },
      ],
      createdAt: timestamp.toISOString(),
      updatedAt: timestamp.toISOString(),
    };

    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    });

    // Reward points logic: +1 point per Rp 10,000 spent
    const earnedPoints = Math.floor(newBooking.totalAmountIdr / 10000);
    setCurrentUser((prev) => ({
      ...prev,
      rewardPoints: (prev.rewardPoints || 0) + earnedPoints,
    }));

    logAction("CREATE_BOOKING", `Created booking ${reference} for ${newBooking.customerName} (Total: Rp ${newBooking.totalAmountIdr.toLocaleString()})`);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus, note?: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          const newHistory = [
            ...b.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: note || `Status transitioned to ${newStatus}`,
              updatedBy: currentUser.name,
            },
          ];
          return {
            ...b,
            bookingStatus: newStatus,
            statusHistory: newHistory,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    });
    logAction("UPDATE_BOOKING_STATUS", `Booking ${bookingId} transitioned to ${newStatus}`);
  };

  const assignBookingOperations = (
    bookingId: string,
    ops: { assignedDriver?: string; assignedVehicle?: string; assignedGuide?: string; operationalNotes?: string }
  ) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === bookingId ? { ...b, ...ops, updatedAt: new Date().toISOString() } : b));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    });
    logAction("ASSIGN_OPERATIONS", `Updated fleet & driver assignment for booking ${bookingId}`);
  };

  const redeemVoucher = (qrCode: string, staffName: string): { success: boolean; message: string; booking?: Booking } => {
    const target = bookings.find((b) => b.qrVoucherCode === qrCode || b.bookingReference === qrCode);
    if (!target) {
      return { success: false, message: "Invalid voucher code. No matching booking found in Sundaram database." };
    }
    if (target.voucherRedeemed) {
      return {
        success: false,
        message: `Voucher was ALREADY REDEEMED on ${new Date(target.voucherRedeemedAt || "").toLocaleString()} by ${target.voucherRedeemedBy}. Duplicate check-in prevented.`,
        booking: target,
      };
    }
    if (target.bookingStatus === "cancelled" || target.bookingStatus === "refunded") {
      return {
        success: false,
        message: `Cannot redeem: Booking status is currently ${target.bookingStatus.toUpperCase()}.`,
        booking: target,
      };
    }

    const now = new Date().toISOString();
    let updatedBooking: Booking | undefined;
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === target.id) {
          updatedBooking = {
            ...b,
            voucherRedeemed: true,
            voucherRedeemedAt: now,
            voucherRedeemedBy: staffName,
            bookingStatus: "completed",
            statusHistory: [
              ...b.statusHistory,
              {
                status: "completed",
                timestamp: now,
                note: `Voucher scanned & verified at location by ${staffName}`,
                updatedBy: staffName,
              },
            ],
            updatedAt: now,
          };
          return updatedBooking;
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
      return updated;
    });

    logAction("REDEEM_VOUCHER", `Voucher ${qrCode} successfully redeemed for ${target.customerName} by ${staffName}`);
    return {
      success: true,
      message: `Voucher Verified! Welcome ${target.customerName} (${target.participants.adults} Adults${target.participants.children ? `, ${target.participants.children} Kids` : ""}). Check-in recorded.`,
      booking: updatedBooking || target,
    };
  };

  // Promo Codes
  const [promoCodes] = useState<PromoCode[]>(SEED_PROMO_CODES);
  const validatePromoCode = (code: string, amountIdr: number): { valid: boolean; discountIdr: number; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === cleanCode && p.isActive);
    if (!found) {
      return { valid: false, discountIdr: 0, message: "Invalid or expired promo code" };
    }
    if (amountIdr < found.minSpendIdr) {
      return {
        valid: false,
        discountIdr: 0,
        message: `Minimum spend of Rp ${found.minSpendIdr.toLocaleString()} required for this code.`,
      };
    }
    let discount = 0;
    if (found.discountType === "percentage") {
      discount = Math.round((amountIdr * found.discountValue) / 100);
      if (found.maxDiscountIdr && discount > found.maxDiscountIdr) {
        discount = found.maxDiscountIdr;
      }
    } else {
      discount = found.discountValue;
    }
    return { valid: true, discountIdr: discount, message: `Promo applied: ${found.title}` };
  };

  // Rewards
  const rewardPoints = currentUser.rewardPoints || 0;
  const redeemRewardPoints = (points: number): number => {
    // 1 point = Rp 100 discount
    const available = Math.min(points, rewardPoints);
    return available * 100;
  };

  // Custom Trip / Itinerary requests
  const [customTrips, setCustomTrips] = useState<CustomTripRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_TRIPS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "trip-req-1",
            customerName: "Sarah Jenkins",
            customerEmail: "sarah.jenkins@example.com",
            customerPhone: "+61 412 345 678",
            destination: "Ubud & Northern Bali",
            startDate: "2026-09-10",
            endDate: "2026-09-15",
            days: 5,
            adults: 2,
            children: 0,
            infants: 0,
            hotelCategory: "Luxury 5-Star / Private Pool Villa",
            activities: ["Cultural Temples", "Cooking Class", "Waterfall Trekking", "Fine Dining"],
            transportation: "Private Car with Driver",
            guideLanguage: "English",
            mealPreferences: "Vegetarian & Seafood Friendly",
            budgetPerPersonIdr: 15000000,
            budgetCurrency: "USD",
            specialRequests: "Anniversary honeymoon setup with flower petals in villa pool.",
            status: "agent_drafted",
            quotedPriceIdr: 28500000,
            assignedAgent: "Kadek Mahadewi (Sales Agent)",
            createdAt: "2026-08-25T11:00:00Z",
          },
        ];
  });

  const createCustomTripRequest = (reqData: Omit<CustomTripRequest, "id" | "status" | "createdAt">): CustomTripRequest => {
    const newReq: CustomTripRequest = {
      ...reqData,
      id: `trip-req-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    setCustomTrips((prev) => {
      const updated = [newReq, ...prev];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TRIPS, JSON.stringify(updated));
      return updated;
    });
    logAction("CUSTOM_TRIP_INQUIRY", `New custom trip request received from ${newReq.customerName}`);
    return newReq;
  };

  const updateCustomTripStatus = (id: string, updates: Partial<CustomTripRequest>) => {
    setCustomTrips((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_TRIPS, JSON.stringify(updated));
      return updated;
    });
    logAction("UPDATE_CUSTOM_TRIP", `Updated inquiry ${id}`);
  };

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  const addReview = (reviewData: Omit<Review, "id" | "createdAt" | "helpfulVotes" | "status">) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      helpfulVotes: 0,
      status: "approved",
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => {
      const updated = [newRev, ...prev];
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
      return updated;
    });
    logAction("SUBMIT_REVIEW", `Review submitted by ${newRev.userName} for product ${newRev.productId}`);
  };

  const voteHelpful = (reviewId: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
      return updated;
    });
  };

  const respondToReview = (reviewId: string, responseText: string, respondedBy: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              supplierResponse: {
                text: responseText,
                respondedAt: new Date().toISOString(),
                respondedBy,
              },
            }
          : r
      );
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
      return updated;
    });
  };

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "ticket-1",
            ticketNumber: "SUP-2608-01",
            userId: "usr-customer-1",
            customerName: "Sarah Jenkins",
            customerEmail: "sarah.jenkins@example.com",
            bookingReference: "BST-260826-A8F4",
            category: "Date Reschedule",
            priority: "medium",
            status: "in_progress",
            subject: "Request to add 1 additional infant to Ubud Cultural Tour",
            messages: [
              {
                id: "msg-1",
                sender: "customer",
                senderName: "Sarah Jenkins",
                message: "Hi Sundaram team, we have our baby infant traveling with us on Aug 28. Could we please request a baby car seat in the vehicle?",
                timestamp: "2026-08-26T11:00:00Z",
              },
              {
                id: "msg-2",
                sender: "support_agent",
                senderName: "Putu Arianti (Customer Care)",
                message: "Hello Sarah! Absolutely, we have informed our fleet operations team to install a sanitized baby car seat in your private vehicle at no extra charge. Have a wonderful tour!",
                timestamp: "2026-08-26T11:15:00Z",
              },
            ],
            createdAt: "2026-08-26T11:00:00Z",
            updatedAt: "2026-08-26T11:15:00Z",
          },
        ];
  });

  const createSupportTicket = (
    ticketData: Omit<SupportTicket, "id" | "ticketNumber" | "status" | "messages" | "createdAt" | "updatedAt">,
    initialMsg: string
  ): SupportTicket => {
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `ticket-${Date.now()}`,
      ticketNumber: `SUP-${Date.now().toString().slice(-4)}`,
      status: "open",
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "customer",
          senderName: ticketData.customerName,
          message: initialMsg,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    setSupportTickets((prev) => {
      const updated = [newTicket, ...prev];
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(updated));
      return updated;
    });
    logAction("CREATE_TICKET", `Support ticket ${newTicket.ticketNumber} opened by ${newTicket.customerName}`);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, message: string, sender: "customer" | "support_agent") => {
    setSupportTickets((prev) => {
      const updated = prev.map((t) => {
        if (t.id === ticketId) {
          const newMessages = [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender,
              senderName: sender === "customer" ? t.customerName : currentUser.name,
              message,
              timestamp: new Date().toISOString(),
            },
          ];
          return {
            ...t,
            messages: newMessages,
            status: sender === "support_agent" ? "in_progress" : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(updated));
      return updated;
    });
  };

  // Affiliates
  const [affiliates] = useState<Affiliate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AFFILIATES);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "aff-1",
            userId: "usr-aff-1",
            code: "BALIVIBES",
            name: "Bali Travel Bloggers Network",
            email: "partner@balivibes.com",
            commissionRate: 5,
            totalClicks: 1420,
            totalBookings: 84,
            totalCommissionIdr: 4200000,
            pendingPayoutIdr: 1200000,
            status: "active",
            createdAt: "2026-01-10T08:00:00Z",
          },
        ];
  });
  const [activeAffiliateCode, setActiveAffiliateCode] = useState<string | null>(null);

  // Check URL parameters on mount for affiliate code e.g. ?ref=BALIVIBES
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");
    if (refCode) {
      setActiveAffiliateCode(refCode);
      console.log(`[AFFILIATE] Registered click for affiliate partner code: ${refCode}`);
    }
  }, []);

  // Articles & CMS
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES);
  const addArticle = (artData: Omit<Article, "id" | "publishedAt">) => {
    const newArt: Article = {
      ...artData,
      id: `art-${Date.now()}`,
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    setArticles((prev) => [newArt, ...prev]);
    logAction("CREATE_ARTICLE", `Published article: ${newArt.title}`);
  };

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "log-1",
            action: "SYSTEM_INITIALIZE",
            performedBy: "System",
            role: "super_admin",
            details: "SUNDARAM.TRAVEL marketplace database initialized successfully.",
            timestamp: new Date().toISOString(),
          },
        ];
  });

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      performedBy: currentUser?.name || "System",
      role: currentUser?.role || "system",
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 99)];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
      return updated;
    });
  };

  // Active UI Navigation State
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Panels
  const [isPlanMyTripOpen, setIsPlanMyTripOpen] = useState<boolean>(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);
  const [activeVoucherBooking, setActiveVoucherBooking] = useState<Booking | null>(null);
  const [activeCompareProductIds, setActiveCompareProductIds] = useState<string[]>([]);

  const toggleCompareProduct = (id: string) => {
    setActiveCompareProductIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [prev[1], prev[2], id]; // keep max 3
      return [...prev, id];
    });
  };

  const clearCompare = () => setActiveCompareProductIds([]);

  // Travel Guides and FAQs
  const travelGuides = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    coverImage: a.image,
    category: a.category,
    readTimeMinutes: parseInt(a.readTime) || 5,
    author: a.author,
    publishedDate: a.publishedAt,
    summary: a.excerpt,
    content: a.content,
    tags: a.tags,
  }));

  const faqs = [
    {
      id: "faq-1",
      question: "Can I cancel or reschedule my tour if my flight is delayed or it rains?",
      answer: "Yes! All PT. Bali Sundaram Travel bookings include free cancellation and unlimited date rescheduling up to 24 hours before your scheduled pickup. If severe weather or harbor master warnings occur, tours can be rescheduled or refunded 100%.",
    },
    {
      id: "faq-2",
      question: "How do I meet my private driver at Bali Ngurah Rai Airport (DPS)?",
      answer: "Your driver will await you at the DPS International Arrival Hall (Exit Gate 3) holding a personalized 'PT. Bali Sundaram Travel' digital placard with your name. Flight tracking is active on all airport pickups.",
    },
    {
      id: "faq-3",
      question: "What payment methods are supported?",
      answer: "We accept all major Indonesian payment channels (QRIS, BCA, Mandiri, BNI Virtual Accounts, GoPay, OVO) as well as international Credit/Debit Cards (Visa, Mastercard, AMEX) via Stripe and PayPal with 0% foreign transaction markups.",
    },
    {
      id: "faq-4",
      question: "Are entrance tickets and sarongs included in temple tours?",
      answer: "Yes, all temple entrance fees (Lempuyang, Besakih, Uluwatu, Tanah Lot) and mandatory temple sarongs with ceremonial sashes are fully included in all PT. Bali Sundaram guided packages.",
    },
  ];

  // Additional helpers
  const addSupportTicket = (ticketData: any) => {
    createSupportTicket(
      {
        userId: ticketData.userId || currentUser.id,
        customerName: ticketData.userName || currentUser.name,
        customerEmail: ticketData.userEmail || currentUser.email,
        subject: ticketData.subject || "Customer Inquiry",
        category: ticketData.category || "Booking Inquiry",
        priority: ticketData.priority || "medium",
      },
      ticketData.message || ""
    );
  };

  const updateTicketStatus = (ticketId: string, status: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: status as any, updatedAt: new Date().toISOString() } : t))
    );
  };

  const requestRefund = (bookingId: string, reason: string) => {
    updateBookingStatus(bookingId, "cancellation_requested", reason);
  };

  const processRefund = (bookingId: string) => {
    updateBookingStatus(bookingId, "refunded", "100% refund executed by Finance Department");
  };

  const updateBookingDriver = (bookingId: string, driver: string) => {
    assignBookingOperations(bookingId, { assignedDriver: driver });
  };

  const createPromoCode = (promo: any) => {
    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: promo.code,
      title: promo.description || promo.code,
      discountType: promo.discountPercent ? "percentage" : "fixed_idr",
      discountValue: promo.discountPercent || 10,
      minSpendIdr: promo.minSpendIdr || 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: promo.validUntil || "2026-12-31",
      usageLimit: promo.usageLimit || 500,
      usageCount: 0,
      isActive: true,
    };
    logAction("CREATE_PROMO", `Created promo code: ${newPromo.code}`);
  };

  const tripInquiries = customTrips.map((c) => ({
    id: c.id,
    customerName: c.customerName,
    customerEmail: c.customerEmail,
    customerPhone: c.customerPhone,
    durationDays: c.days,
    paxCount: c.adults + c.children,
    travelStyle: c.hotelCategory,
    preferredRegions: [c.destination],
    status: c.status === "agent_drafted" ? "quoted" : "new",
    generatedItinerary: {
      tripTitle: `${c.days}-Day Bali Holiday: ${c.destination}`,
      summary: `Custom crafted vacation featuring private vehicle, ${c.guideLanguage} guide, and handpicked boutique accommodations.`,
      estimatedCostPerPersonIdr: c.budgetPerPersonIdr || 5000000,
      dailySchedule: [
        {
          day: 1,
          title: "DPS Airport Welcome & Villa Check-in",
          description: "Meet private chauffeur at DPS airport with refreshing towels and transfer to private pool villa.",
          highlights: ["Airport VIP Fast-Track", "Welcome Dinner"],
          recommendedMeals: "Bebek Betutu Traditional Feast",
        },
        {
          day: 2,
          title: "Scenic Waterfalls & Jungle Escapes",
          description: "Morning guided trek to Tibumana Waterfall followed by holy water temple blessing at Tirta Empul.",
          highlights: ["Tirta Empul Blessing", "Tibumana Waterfall"],
          recommendedMeals: "Organic Ubud Valley Lunch",
        },
      ],
      includedPerks: ["Private Air-conditioned Transport", "Licensed Tour Guide", "All Entrance Passes"],
      suggestedVehicle: "Toyota Innova Reborn Luxury",
    },
    createdAt: c.createdAt,
  }));

  return (
    <TravelStoreContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        exchangeRates,
        updateExchangeRate,
        currentUser,
        switchRole,
        users,
        loginUser,
        destinations,
        categories,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        bookings,
        createBooking,
        updateBookingStatus,
        assignBookingOperations,
        redeemVoucher,
        savedTravelers,
        addSavedTraveler,
        deleteSavedTraveler,
        promoCodes,
        validatePromoCode,
        rewardPoints,
        redeemRewardPoints,
        customTrips,
        createCustomTripRequest,
        updateCustomTripStatus,
        reviews,
        addReview,
        voteHelpful,
        respondToReview,
        supportTickets,
        createSupportTicket,
        replyToTicket,
        affiliates,
        activeAffiliateCode,
        setActiveAffiliateCode,
        articles,
        travelGuides,
        faqs,
        addArticle,
        auditLogs,
        logAction,
        tripInquiries,
        addSupportTicket,
        updateTicketStatus,
        requestRefund,
        processRefund,
        updateBookingDriver,
        createPromoCode,
        clearCompareProducts: clearCompare,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isRoleSwitcherOpen,
        setIsRoleSwitcherOpen,
        activeTab,
        setActiveTab,
        selectedProductId,
        setSelectedProductId,
        selectedDestinationId,
        setSelectedDestinationId,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        isPlanMyTripOpen,
        setIsPlanMyTripOpen,
        isQRScannerOpen,
        setIsQRScannerOpen,
        activeVoucherBooking,
        setActiveVoucherBooking,
        activeCompareProductIds,
        toggleCompareProduct,
        clearCompare,
      }}
    >
      {children}
    </TravelStoreContext.Provider>
  );

};

export const useTravelStore = () => {
  const context = useContext(TravelStoreContext);
  if (!context) {
    throw new Error("useTravelStore must be used within a TravelStoreProvider");
  }
  return context;
};
