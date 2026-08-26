import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Car,
  Utensils,
  Camera,
  Gift,
  Tag,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  User,
  Zap,
} from "lucide-react";
import { Product, PackageOption, PaymentMethod, Booking } from "../types";
import { useTravelStore } from "../store/travelStore";
import { formatCurrency } from "../utils/currency";
import { getTranslation } from "../utils/i18n";

interface BookingFlowProps {
  product: Product;
  packageOption: PackageOption;
  initialDate: string;
  initialTime: string;
  initialAdults: number;
  initialChildren: number;
  initialInfants: number;
  onCancel: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  product,
  packageOption,
  initialDate,
  initialTime,
  initialAdults,
  initialChildren,
  initialInfants,
  onCancel,
  onBookingSuccess,
}) => {
  const {
    currency,
    exchangeRates,
    language,
    currentUser,
    promoCodes,
    validatePromoCode,
    createBooking,
  } = useTravelStore();

  const t = (key: any) => getTranslation(language, key);

  // Form State
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [infants, setInfants] = useState(initialInfants);

  // Lead Guest
  const [leadName, setLeadName] = useState(currentUser.name);
  const [leadEmail, setLeadEmail] = useState(currentUser.email);
  const [leadPhone, setLeadPhone] = useState(currentUser.phone);
  const [nationality, setNationality] = useState("Australia");

  // Logistics & Special Requests
  const [hotelName, setHotelName] = useState("The Seminyak Beach Resort & Spa");
  const [roomNumber, setRoomNumber] = useState("Suite 304");
  const [pickupNotes, setPickupNotes] = useState("");
  const [dropoffOption, setDropoffOption] = useState<"same" | "airport" | "custom">("same");
  const [dietary, setDietary] = useState("None");
  const [specialRequests, setSpecialRequests] = useState("");

  // Optional Add-ons
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
    photo_reel: false,
    vip_fast_track: false,
    seafood_upgrade: false,
    car_seat: false,
  });

  // Promo Code & Points
  const [promoInput, setPromoInput] = useState("BALI10");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Available Add-ons
  const availableAddons = [
    {
      id: "photo_reel",
      name: "Professional Vacation Photographer & Drone Reel",
      priceIdr: 450000,
      icon: Camera,
      description: "60+ edited high-res digital photos and a 30s 4K Instagram reel dispatched within 24h.",
    },
    {
      id: "vip_fast_track",
      name: "VIP Attraction Fast-Track Lane Access",
      priceIdr: 150000,
      icon: Zap,
      description: "Skip all general ticketing queues at popular temples and swing platforms.",
    },
    {
      id: "seafood_upgrade",
      name: "Jimbaran Beachfront Grilled Seafood Dinner Upgrade",
      priceIdr: 300000,
      icon: Utensils,
      description: "Indulge in fresh king prawns, grilled snapper, crab, and sunset coconut at Jimbaran Bay.",
    },
    {
      id: "car_seat",
      name: "Sanitized Premium Child / Infant Safety Seat",
      priceIdr: 80000,
      icon: Car,
      description: "ISOFIX certified infant / toddler car seat installed in your private vehicle.",
    },
  ];

  // Pricing Calculation
  const adultUnitPrice = packageOption.priceIdr;
  const childUnitPrice = packageOption.childPriceIdr !== undefined ? packageOption.childPriceIdr : adultUnitPrice * 0.75;
  const infantUnitPrice = packageOption.infantPriceIdr || 0;

  const baseSubtotalIdr = adults * adultUnitPrice + children * childUnitPrice + infants * infantUnitPrice;

  const addonsTotalIdr = availableAddons
    .filter((a) => selectedAddons[a.id])
    .reduce((sum, a) => sum + a.priceIdr, 0);

  let discountAmountIdr = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmountIdr = (baseSubtotalIdr * appliedPromo.discountPercent) / 100;
      if (appliedPromo.maxDiscountIdr && discountAmountIdr > appliedPromo.maxDiscountIdr) {
        discountAmountIdr = appliedPromo.maxDiscountIdr;
      }
    } else if (appliedPromo.discountAmountIdr) {
      discountAmountIdr = appliedPromo.discountAmountIdr;
    }
  }

  // 1 Point = 100 IDR
  const pointsDiscountIdr = pointsToRedeem * 100;
  const grandTotalIdr = Math.max(0, baseSubtotalIdr + addonsTotalIdr - discountAmountIdr - pointsDiscountIdr);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const result = validatePromoCode(promoInput, baseSubtotalIdr);
    if (result.valid) {
      setAppliedPromo(result.promo);
    } else {
      setPromoError(result.message);
      setAppliedPromo(null);
    }
  };

  const handleCompleteBooking = () => {
    if (!agreedTerms) {
      alert("Please agree to the cancellation policy and booking terms.");
      return;
    }
    if (!leadName || !leadEmail || !leadPhone) {
      alert("Please fill in your primary contact information.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Create new booking record in the store
      const newBooking = createBooking({
        productId: product.id,
        packageId: packageOption.id,
        travelDate: date,
        timeSlot: time,
        adultCount: adults,
        childCount: children,
        infantCount: infants,
        leadGuestName: leadName,
        leadGuestEmail: leadEmail,
        leadGuestPhone: leadPhone,
        pickupLocation: `${hotelName}, ${roomNumber} (Pickup Note: ${pickupNotes || "None"})`,
        dropoffLocation: dropoffOption === "airport" ? "DPS Ngurah Rai Airport Departure" : hotelName,
        specialRequests: `Dietary: ${dietary}. Requests: ${specialRequests || "None"}`,
        totalPriceIdr: grandTotalIdr,
        currencyUsed: currency,
        paymentMethod: paymentMethod,
        appliedPromoCode: appliedPromo?.code,
        pointsRedeemed: pointsToRedeem,
      });

      // Confetti feedback
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#0d4a44", "#c85a32", "#e6af2e", "#ffffff"],
        });
      } catch (err) {
        // Safe fallback
      }

      setIsProcessing(false);
      onBookingSuccess(newBooking);
    }, 1500);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Breadcrumb & Progress */}
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center space-x-1 text-xs font-semibold text-stone-600 hover:text-[#0d4a44] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Return to Product</span>
          </button>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Selected Product Summary Header Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-20 h-20 rounded-2xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-[#0d4a44] bg-teal-50 px-2 py-0.5 rounded-md">
              {product.destinationName} • {product.categoryName}
            </span>
            <h1 className="font-serif font-bold text-base text-stone-900 truncate mt-1">
              {product.title}
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Option: <strong className="text-stone-800">{packageOption.name}</strong> • {date} at {time}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Booking Form (Left Col) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Lead Guest Contact Info */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-2">
                <User className="w-4 h-4 text-[#0d4a44]" />
                <span>1. Lead Guest Contact Details</span>
              </h2>
              <p className="text-xs text-stone-500">
                Your digital voucher & driver WhatsApp live updates will be sent to these contacts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Full Name (as in Passport)</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    required
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">WhatsApp / Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+62 / +61..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Hotel Pickup & Logistics */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#0d4a44]" />
                <span>2. Bali Hotel Pickup & Logistics</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Hotel / Villa Name</label>
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      placeholder="e.g. W Bali Seminyak / Maya Ubud"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Room / Villa Number (Optional)</label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. Villa 12"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Drop-off Destination</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDropoffOption("same")}
                      className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                        dropoffOption === "same" ? "bg-teal-50 border-[#0d4a44] text-[#0d4a44]" : "border-stone-200"
                      }`}
                    >
                      Return to Same Hotel
                    </button>
                    <button
                      type="button"
                      onClick={() => setDropoffOption("airport")}
                      className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                        dropoffOption === "airport" ? "bg-teal-50 border-[#0d4a44] text-[#0d4a44]" : "border-stone-200"
                      }`}
                    >
                      DPS Airport Departure
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Special Dietary / Medical Notes</label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none font-semibold text-stone-800"
                  >
                    <option value="None">No Specific Dietary Restrictions (Standard)</option>
                    <option value="Halal">100% Halal Food</option>
                    <option value="Vegetarian">Vegetarian (No meat/fish)</option>
                    <option value="Vegan">Vegan (Plant-based only)</option>
                    <option value="Gluten-Free">Gluten-Free / Celiac</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Optional Experience Upgrades & Add-ons */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>3. Enhance Your Experience (Add-ons)</span>
              </h2>

              <div className="space-y-3">
                {availableAddons.map((addon) => {
                  const Icon = addon.icon;
                  const isChecked = selectedAddons[addon.id] || false;
                  return (
                    <div
                      key={addon.id}
                      onClick={() =>
                        setSelectedAddons((prev) => ({ ...prev, [addon.id]: !prev[addon.id] }))
                      }
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                        isChecked
                          ? "border-[#0d4a44] bg-teal-50/60 shadow-xs"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="accent-[#0d4a44] mt-1 cursor-pointer"
                      />
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-stone-900">{addon.name}</h3>
                          <span className="font-bold text-xs text-[#0d4a44]">
                            +{formatCurrency(addon.priceIdr, currency, exchangeRates)}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">{addon.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Payment Gateway Selection */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#0d4a44]" />
                <span>4. Select Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* QRIS */}
                <div
                  onClick={() => setPaymentMethod("qris")}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center space-x-3 ${
                    paymentMethod === "qris" ? "border-[#0d4a44] bg-teal-50/70 font-bold" : "border-stone-200"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-stone-900" />
                  <div>
                    <p className="text-xs font-bold text-stone-900">Indonesian QRIS (Instant)</p>
                    <p className="text-[10px] text-stone-500">GoPay, OVO, DANA, BCA, Mandiri</p>
                  </div>
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center space-x-3 ${
                    paymentMethod === "credit_card" ? "border-[#0d4a44] bg-teal-50/70 font-bold" : "border-stone-200"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-stone-900">Credit / Debit Card</p>
                    <p className="text-[10px] text-stone-500">Visa, Mastercard, AMEX, JCB</p>
                  </div>
                </div>

                {/* Midtrans E-Wallets */}
                <div
                  onClick={() => setPaymentMethod("midtrans")}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center space-x-3 ${
                    paymentMethod === "midtrans" ? "border-[#0d4a44] bg-teal-50/70 font-bold" : "border-stone-200"
                  }`}
                >
                  <span className="font-bold text-indigo-700">Midtrans</span>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Midtrans Gateway</p>
                    <p className="text-[10px] text-stone-500">ShopeePay, Virtual Accounts</p>
                  </div>
                </div>

                {/* PayPal */}
                <div
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center space-x-3 ${
                    paymentMethod === "paypal" ? "border-[#0d4a44] bg-teal-50/70 font-bold" : "border-stone-200"
                  }`}
                >
                  <span className="font-bold text-sky-600">PayPal</span>
                  <div>
                    <p className="text-xs font-bold text-stone-900">PayPal Express</p>
                    <p className="text-[10px] text-stone-500">International USD/EUR/AUD</p>
                  </div>
                </div>
              </div>

              {/* Dynamic QRIS Demo Preview */}
              {paymentMethod === "qris" && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
                  <p className="text-xs font-bold text-stone-800">Dynamic National QRIS Ready</p>
                  <div className="w-32 h-32 bg-white mx-auto p-2 rounded-xl border border-stone-300 shadow-xs flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-stone-900" />
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Scan with GoPay, OVO, BCA Mobile, Livin Mandiri, or any ASEAN banking app
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Order Summary & Pay Action */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {/* Promo Code & Sundaram Points */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center space-x-1.5">
                <Tag className="w-4 h-4 text-[#c85a32]" />
                <span>Promo Code & Discounts</span>
              </h3>

              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. BALI10 or SUNDARAMVIP"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#0d4a44]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#0d4a44] text-white text-xs font-bold rounded-xl hover:bg-[#16655e] cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center justify-between font-semibold border border-emerald-200">
                  <span>✓ {appliedPromo.code} applied ({appliedPromo.description})</span>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    className="text-emerald-900 underline text-[11px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
              {promoError && <p className="text-xs text-rose-600 font-medium">{promoError}</p>}

              {/* Sundaram Rewards Redemption */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-800">Sundaram Points ({currentUser.rewardPoints || 0} pts)</p>
                  <p className="text-[10px] text-stone-500">100 pts = Rp 10,000 discount</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPointsToRedeem(pointsToRedeem > 0 ? 0 : Math.min(currentUser.rewardPoints || 0, 500))
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    pointsToRedeem > 0
                      ? "bg-amber-500 text-stone-950 border-amber-500"
                      : "bg-stone-50 border-stone-300 text-stone-700"
                  }`}
                >
                  {pointsToRedeem > 0 ? `Redeemed ${pointsToRedeem} pts` : "Redeem Points"}
                </button>
              </div>
            </div>

            {/* Price Breakdown Bill */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900">Price Breakdown</h3>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{packageOption.name} ({adults} Adult{adults > 1 ? "s" : ""})</span>
                  <span className="font-semibold text-stone-900">
                    {formatCurrency(adults * adultUnitPrice, currency, exchangeRates)}
                  </span>
                </div>
                {children > 0 && (
                  <div className="flex justify-between">
                    <span>Child tickets ({children} Child{children > 1 ? "ren" : ""})</span>
                    <span className="font-semibold text-stone-900">
                      {formatCurrency(children * childUnitPrice, currency, exchangeRates)}
                    </span>
                  </div>
                )}
                {infants > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Infant tickets ({infants} Infant)</span>
                    <span className="font-semibold">Free</span>
                  </div>
                )}

                {addonsTotalIdr > 0 && (
                  <div className="flex justify-between text-stone-800 font-medium">
                    <span>Selected Add-ons</span>
                    <span>+{formatCurrency(addonsTotalIdr, currency, exchangeRates)}</span>
                  </div>
                )}

                {discountAmountIdr > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Promo Discount</span>
                    <span>-{formatCurrency(discountAmountIdr, currency, exchangeRates)}</span>
                  </div>
                )}

                {pointsDiscountIdr > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Sundaram Rewards Redeemed</span>
                    <span>-{formatCurrency(pointsDiscountIdr, currency, exchangeRates)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-500 text-[11px] pt-1">
                  <span>Taxes & Service Charge</span>
                  <span>Included</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-stone-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Grand Total</span>
                  <span className="font-serif font-black text-2xl text-[#0d4a44]">
                    {formatCurrency(grandTotalIdr, currency, exchangeRates)}
                  </span>
                </div>
                <span className="text-xs font-bold text-stone-500">
                  ≈ {currency}
                </span>
              </div>

              {/* Agreement */}
              <label className="flex items-start space-x-2 text-[11px] text-stone-500 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="accent-[#0d4a44] mt-0.5"
                />
                <span>
                  I agree to PT. Bali Sundaram Travel's <strong className="text-stone-800">Booking Terms</strong> and understand the free cancellation policy up to 24 hours prior.
                </span>
              </label>

              {/* Pay Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompleteBooking}
                className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  isProcessing
                    ? "bg-stone-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#0d4a44] to-[#16655e] hover:from-[#16655e] hover:to-[#0d4a44] transform active:scale-98"
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment & Generating Voucher...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Pay & Generate Instant E-Voucher</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
