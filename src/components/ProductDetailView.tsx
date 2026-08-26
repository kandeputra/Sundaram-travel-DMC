import React, { useState } from "react";
import {
  Star,
  Heart,
  Share2,
  MapPin,
  Clock,
  Globe,
  ShieldCheck,
  Zap,
  Check,
  X as XIcon,
  Calendar,
  Users,
  ChevronRight,
  ChevronDown,
  Info,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
  Car,
  AlertCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { Product, PackageOption } from "../types";
import { useTravelStore } from "../store/travelStore";
import { formatCurrency } from "../utils/currency";
import { getTranslation } from "../utils/i18n";

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onStartBooking: (pkg: PackageOption, date: string, time: string, adults: number, kids: number, infants: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onStartBooking,
}) => {
  const {
    currency,
    exchangeRates,
    language,
    toggleWishlist,
    isWishlisted,
    products,
    reviews,
    addReview,
    voteHelpful,
    currentUser,
    setSelectedProductId,
    setActiveTab,
  } = useTravelStore();

  const t = (key: any) => getTranslation(language, key);
  const wishlisted = isWishlisted(product.id);

  // Gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Package & Booking selection state
  const [selectedPackageId, setSelectedPackageId] = useState<string>(product.packages[0]?.id || "");
  const [travelDate, setTravelDate] = useState<string>("2026-08-28");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    product.packages[0]?.timeSlots[0] || "08:30"
  );
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  // Review submission state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [travelType, setTravelType] = useState<"Solo" | "Couple" | "Family with Kids" | "Friends" | "Business">("Couple");

  const selectedPackage =
    product.packages.find((p) => p.id === selectedPackageId) || product.packages[0];

  // Calculate dynamic package price
  const adultPrice = selectedPackage?.priceIdr || product.startingPriceIdr;
  const childPrice = selectedPackage?.childPriceIdr !== undefined ? selectedPackage.childPriceIdr : adultPrice * 0.75;
  const infantPrice = selectedPackage?.infantPriceIdr || 0;

  const totalCalculatedIdr = adults * adultPrice + children * childPrice + infants * infantPrice;

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id || r.productId === "prod-ubud-cultural");

  const handlePackageChange = (pkg: PackageOption) => {
    setSelectedPackageId(pkg.id);
    if (pkg.timeSlots.length > 0 && !pkg.timeSlots.includes(selectedTimeSlot)) {
      setSelectedTimeSlot(pkg.timeSlots[0]);
    }
  };

  const handleCheckoutClick = () => {
    if (!selectedPackage) return;
    onStartBooking(selectedPackage, travelDate, selectedTimeSlot, adults, children, infants);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    addReview({
      bookingId: `BST-MANUAL-${Date.now().toString().slice(-4)}`,
      productId: product.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userNationality: "Traveler",
      ratingOverall: newRating,
      ratingService: newRating,
      ratingValue: newRating,
      ratingExperience: newRating,
      travelType,
      travelDate: "August 2026",
      reviewTitle: reviewTitle || "Fantastic Bali Experience",
      reviewText,
    });
    setReviewText("");
    setReviewTitle("");
    setIsReviewFormOpen(false);
  };

  const similarProducts = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.destinationId === product.destinationId))
    .slice(0, 3);

  const displayTitle = language === "id" && product.titleId ? product.titleId : product.title;

  return (
    <div className="bg-[#faf9f6] min-h-screen pb-24 lg:pb-16">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center space-x-1.5 truncate">
            <button onClick={onBack} className="hover:text-[#0d4a44] font-medium flex items-center space-x-1 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span>/</span>
            <span className="hover:text-[#0d4a44] cursor-pointer" onClick={onBack}>{product.destinationName}</span>
            <span>/</span>
            <span className="hover:text-[#0d4a44] cursor-pointer" onClick={onBack}>{product.categoryName}</span>
            <span>/</span>
            <span className="text-stone-800 font-semibold truncate max-w-[200px]">{displayTitle}</span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-1.5 rounded-lg border flex items-center space-x-1 cursor-pointer ${
                wishlisted ? "bg-rose-50 text-rose-600 border-rose-200" : "text-stone-600 hover:bg-stone-50 border-stone-200"
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose-600" : ""}`} />
              <span className="hidden sm:inline text-xs font-semibold">{wishlisted ? "Saved" : "Save"}</span>
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Activity link copied to clipboard!");
                }
              }}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center space-x-1 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Title & Ratings Header */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#0d4a44] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              {product.categoryName}
            </span>
            <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-amber-700" />
              <span>{product.destinationName}, Bali</span>
            </span>
            {product.isBestseller && (
              <span className="bg-[#c85a32] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                ★ Bestseller Experience
              </span>
            )}
            <span className="text-xs text-stone-500 font-medium">
              Operated by <strong className="text-stone-800">{product.supplierName}</strong> (Official Partner)
            </span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight">
            {displayTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-200/60">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="text-sm">{product.rating.toFixed(2)}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount} verified reviews)</span>
            </div>
            <span className="text-stone-500 font-medium">
              🔥 <strong className="text-stone-800">{product.bookingCount.toLocaleString()}</strong> travelers booked this season
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>{product.instantConfirmation ? "Instant Mobile Confirmation" : "Confirmation in 24h"}</span>
            </span>
          </div>
        </div>

        {/* Media Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-8">
          {/* Main Large Image Display */}
          <div className="lg:col-span-8 aspect-[16/10] rounded-3xl overflow-hidden shadow-md bg-stone-100 relative group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={displayTitle}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
              Photo {activeImageIndex + 1} of {product.images.length}
            </div>
          </div>

          {/* Thumbnails Column */}
          <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-2.5">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? "border-[#0d4a44] ring-2 ring-[#0d4a44]/30" : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Content + Sticky Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Descriptions, Highlights, Packages, Terms & FAQs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-5 h-5 text-[#0d4a44] shrink-0" />
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Duration</p>
                  <p className="text-xs font-bold text-stone-800">{product.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Globe className="w-5 h-5 text-[#0d4a44] shrink-0" />
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Languages</p>
                  <p className="text-xs font-bold text-stone-800">{product.languages.join(", ")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Car className="w-5 h-5 text-[#0d4a44] shrink-0" />
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Hotel Pickup</p>
                  <p className="text-xs font-bold text-stone-800">{product.pickupAvailable ? "Included" : "Self Arrival"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Cancellation</p>
                  <p className="text-xs font-bold text-emerald-800">Free up to 24h</p>
                </div>
              </div>
            </div>

            {/* Experience Highlights */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Experience Highlights</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-stone-700 leading-relaxed">
                    <Check className="w-4 h-4 text-[#0d4a44] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Package Options Selector (CRITICAL Interactive Area) */}
            <div id="packages-section" className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900">Select Your Package Option</h2>
                  <p className="text-xs text-stone-500">Choose the ideal tier, inclusions, and participant quantity</p>
                </div>
                <span className="text-xs font-bold text-[#0d4a44] bg-teal-50 px-2.5 py-1 rounded-full">
                  {product.packages.length} Packages Available
                </span>
              </div>

              <div className="space-y-3">
                {product.packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageChange(pkg)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#0d4a44] bg-teal-50/50 shadow-sm"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="package_selection"
                              checked={isSelected}
                              onChange={() => handlePackageChange(pkg)}
                              className="accent-[#0d4a44] cursor-pointer"
                            />
                            <h3 className="text-sm font-bold text-stone-900">{pkg.name}</h3>
                          </div>
                          <p className="text-xs text-stone-600 pl-5">{pkg.description}</p>
                        </div>
                        <div className="text-right shrink-0 pl-3">
                          <span className="text-[10px] text-stone-400 block font-medium">Per Adult</span>
                          <span className="font-serif font-black text-base text-[#0d4a44]">
                            {formatCurrency(pkg.priceIdr, currency, exchangeRates)}
                          </span>
                        </div>
                      </div>

                      {/* Package inclusions / exclusions */}
                      <div className="mt-3 pt-3 border-t border-stone-100 pl-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <p className="font-bold text-emerald-800 mb-1 flex items-center space-x-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Inclusions:</span>
                          </p>
                          <ul className="space-y-0.5 text-stone-600">
                            {pkg.inclusions.map((inc, idx) => (
                              <li key={idx}>• {inc}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-bold text-rose-800 mb-1 flex items-center space-x-1">
                            <XIcon className="w-3 h-3 text-rose-600" />
                            <span>Exclusions:</span>
                          </p>
                          <ul className="space-y-0.5 text-stone-600">
                            {pkg.exclusions.map((exc, idx) => (
                              <li key={idx}>• {exc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Interactive Date & Time Picker */}
              <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0d4a44]" />
                    <span>Select Travel Date</span>
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4a44]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#0d4a44]" />
                    <span>Select Time Slot</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPackage.timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          selectedTimeSlot === slot
                            ? "bg-[#0d4a44] text-white border-[#0d4a44]"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Participants Counter */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <label className="block text-xs font-bold text-stone-700 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-[#0d4a44]" />
                  <span>Number of Participants</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Adults */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800">Adult (12+ yrs)</p>
                      <p className="text-[10px] text-stone-500">{formatCurrency(adultPrice, currency, exchangeRates)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-6 h-6 rounded-full bg-white border border-stone-300 font-bold text-xs flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-6 h-6 rounded-full bg-white border border-stone-300 font-bold text-xs flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800">Child (3-11 yrs)</p>
                      <p className="text-[10px] text-stone-500">{formatCurrency(childPrice, currency, exchangeRates)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-6 h-6 rounded-full bg-white border border-stone-300 font-bold text-xs flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-6 h-6 rounded-full bg-white border border-stone-300 font-bold text-xs flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800">Infant (0-2 yrs)</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">Free (Rp 0)</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                        className="w-6 h-6 rounded-full bg-white border border-stone-300 font-bold text-xs flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants(infants + 1)}
                        className="w-6 h-6 rounded-full bg-white border border-stone-300 font-bold text-xs flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Description & What to Bring */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-stone-900">About This Activity</h2>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{product.fullDescription}</p>

              <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <h3 className="font-bold text-stone-800 mb-1.5">🎒 What to Bring</h3>
                  <ul className="space-y-1 text-stone-600">
                    {product.whatToBring.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-stone-800 mb-1.5">👗 Dress Code & Etiquette</h3>
                  <p className="text-stone-600 leading-relaxed">{product.dressCode || "Comfortable casual or resort attire."}</p>
                </div>
              </div>
            </div>

            {/* Policies, Terms & FAQs */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-stone-900">Policies & Frequently Asked Questions</h2>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#0d4a44] font-bold">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Free Cancellation Guarantee</span>
                  </div>
                  <p className="text-stone-600">
                    Cancel up to 24 hours prior to your scheduled pickup for a 100% full refund with zero cancellation penalty fees.
                  </p>
                </div>

                {product.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-stone-200 rounded-xl p-3.5 space-y-1">
                    <p className="font-bold text-stone-900 flex items-center space-x-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>{faq.question}</span>
                    </p>
                    <p className="text-stone-600 pl-5">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Customer Reviews Section */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900">Verified Customer Reviews</h2>
                  <p className="text-xs text-stone-500">Only travelers who completed this tour can submit reviews</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="px-3.5 py-1.5 bg-[#0d4a44] text-white text-xs font-semibold rounded-xl hover:bg-[#16655e] transition-colors cursor-pointer"
                >
                  {isReviewFormOpen ? "Cancel Review" : "Write a Review"}
                </button>
              </div>

              {/* Review Form */}
              {isReviewFormOpen && (
                <form onSubmit={handleReviewSubmit} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 animate-in fade-in">
                  <h3 className="text-xs font-bold text-stone-900">Submit Your Feedback</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-stone-600">Rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating ? "fill-amber-400 text-amber-400" : "text-stone-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Review headline (e.g. Unforgettable Bali day out!)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4a44]"
                  />

                  <textarea
                    required
                    rows={3}
                    placeholder="Share specific details about the guide, driver, food, and highlights..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4a44]"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Post Verified Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4 pt-2">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="border-b border-stone-100 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-[#0d4a44] font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{rev.userName}</p>
                          <p className="text-[10px] text-stone-400">
                            {rev.userNationality || "Verified Guest"} • {rev.travelType} • {rev.travelDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-amber-50 text-amber-900 font-bold text-xs px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{rev.ratingOverall}.0</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-stone-800">{rev.reviewTitle}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{rev.reviewText}</p>

                    {/* Supplier Response */}
                    {rev.supplierResponse && (
                      <div className="bg-stone-50 border-l-2 border-[#0d4a44] p-2.5 rounded-r-xl text-[11px] space-y-1">
                        <p className="font-bold text-[#0d4a44]">Response from {rev.supplierResponse.respondedBy}:</p>
                        <p className="text-stone-600">{rev.supplierResponse.text}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-[11px] text-stone-400 pt-1">
                      <button
                        type="button"
                        onClick={() => voteHelpful(rev.id)}
                        className="flex items-center space-x-1 hover:text-stone-700 cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful ({rev.helpfulVotes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Activities */}
            {similarProducts.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="font-serif font-bold text-lg text-stone-900">You Might Also Love in Bali</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similarProducts.map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => {
                        setSelectedProductId(sim.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                        <img src={sim.images[0]} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="p-3 space-y-1">
                        <h3 className="font-bold text-xs text-stone-900 line-clamp-1">{sim.title}</h3>
                        <p className="text-[11px] text-stone-500">{sim.destinationName}</p>
                        <p className="font-serif font-bold text-xs text-[#0d4a44] pt-1">
                          {formatCurrency(sim.startingPriceIdr, currency, exchangeRates)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Desktop Sticky Booking Sidebar */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xl space-y-5">
              <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">Total Estimated Price</span>
                  <span className="font-serif font-black text-2xl text-[#0d4a44]">
                    {formatCurrency(totalCalculatedIdr, currency, exchangeRates)}
                  </span>
                </div>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Best Price Direct
                </span>
              </div>

              {/* Selection Summary */}
              <div className="space-y-2.5 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-500">Package:</span>
                  <span className="font-bold text-stone-900 text-right truncate max-w-[170px]">{selectedPackage.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-500">Date & Slot:</span>
                  <span className="font-bold text-stone-900">{travelDate} ({selectedTimeSlot})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-500">Guests:</span>
                  <span className="font-bold text-stone-900">
                    {adults} Adult{adults > 1 ? "s" : ""}{children ? `, ${children} Child` : ""}{infants ? `, ${infants} Inf` : ""}
                  </span>
                </div>
              </div>

              {/* Main Booking Action */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-gradient-to-r from-[#0d4a44] to-[#16655e] hover:from-[#16655e] hover:to-[#0d4a44] text-white font-bold text-sm rounded-2xl shadow-lg transition-all transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{t("bookNow")}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Reassurances */}
              <div className="space-y-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <div className="flex items-center space-x-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant QR voucher generated upon payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Free cancellation up to 24 hours prior</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>24/7 Bali WhatsApp Concierge Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Action Bar (Bottom) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] text-stone-400 font-bold block uppercase">Total ({adults + children} pax)</span>
          <span className="font-serif font-black text-lg text-[#0d4a44]">
            {formatCurrency(totalCalculatedIdr, currency, exchangeRates)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCheckoutClick}
          className="px-6 py-2.5 bg-[#0d4a44] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
        >
          <span>{t("bookNow")}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
