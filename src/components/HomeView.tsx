import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  RotateCcw,
  Compass,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Sun,
  Waves,
  Award,
  Users,
  CheckCircle2,
  Heart,
  Car,
  Ticket,
  Mountain,
} from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { HeroSearch } from "./HeroSearch";
import { ProductCard } from "./ProductCard";
import { formatCurrency } from "../utils/currency";
import { getTranslation } from "../utils/i18n";

export const HomeView: React.FC = () => {
  const {
    products,
    destinations,
    categories,
    bookings,
    setSelectedDestinationId,
    setSelectedCategoryId,
    setSelectedProductId,
    setActiveTab,
    setIsPlanMyTripOpen,
    currency,
    exchangeRates,
    language,
  } = useTravelStore();

  const t = (key: any) => getTranslation(language, key);

  const [activeProductTab, setActiveProductTab] = useState<"bestsellers" | "top_rated" | "instant">("bestsellers");

  // Top seller product for the spotlight bento card
  const topSellerProduct = products.find((p) => p.isBestseller) || products[0];

  // Filter products for the tabs
  const featuredProducts = products.filter((p) => {
    if (activeProductTab === "bestsellers") return p.isBestseller;
    if (activeProductTab === "top_rated") return p.rating >= 4.9;
    if (activeProductTab === "instant") return p.instantConfirmation;
    return true;
  });

  const handleDestinationClick = (destId: string) => {
    setSelectedDestinationId(destId);
    setActiveTab("explore");
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategoryId(catId);
    setActiveTab("explore");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      {/* 1. Primary BENTO GRID Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Bento Cell 1: Featured Hero Destination (col-span-8) */}
        <div className="md:col-span-12 lg:col-span-8 rounded-3xl overflow-hidden relative shadow-md group min-h-[380px] lg:min-h-[440px] flex flex-col justify-end">
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
          <div className="absolute inset-0 bg-[#044D29]/20">
            <div
              className="w-full h-full bg-[url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1400')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative p-6 sm:p-10 z-20 w-full">
            <span className="bg-[#F2C94C] text-[#044D29] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block shadow-xs">
              Featured Destination
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
              Escape to the Heart<br />of Spiritual Ubud
            </h1>
            <p className="text-stone-200 text-xs sm:text-sm max-w-lg mb-5 line-clamp-2">
              Immerse yourself in UNESCO jungle rice terraces, sacred water temple blessings at Tirta Empul, and artisan craft villages.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => {
                  setSelectedDestinationId("dest-1");
                  setActiveTab("explore");
                }}
                className="bg-[#E26D5C] hover:bg-[#d15d4d] text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer"
              >
                Explore Tours
              </button>
              <button
                onClick={() => setIsPlanMyTripOpen(true)}
                className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm hover:bg-white/30 transition-all cursor-pointer"
              >
                Plan Itinerary
              </button>
            </div>
          </div>
        </div>

        {/* Bento Cell 2: Popular Categories & Quick Status (col-span-4) */}
        <div className="md:col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-[#044D29]/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#1A1A1A]">Popular Categories</h3>
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setActiveTab("explore");
                }}
                className="text-[#044D29] text-xs font-bold hover:underline cursor-pointer"
              >
                See All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => handleCategoryClick("cat-activities")}
                className="bg-[#FDFBF7] border border-[#044D29]/10 p-3.5 rounded-2xl hover:bg-[#F2C94C]/10 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-1.5">🛶</div>
                <div className="text-sm font-bold text-[#1A1A1A]">Rafting</div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">12 Activities</div>
              </div>

              <div
                onClick={() => handleCategoryClick("cat-tours")}
                className="bg-[#FDFBF7] border border-[#044D29]/10 p-3.5 rounded-2xl hover:bg-[#F2C94C]/10 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-1.5">🌋</div>
                <div className="text-sm font-bold text-[#1A1A1A]">Volcano</div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">8 Packages</div>
              </div>

              <div
                onClick={() => handleCategoryClick("cat-water-sports")}
                className="bg-[#FDFBF7] border border-[#044D29]/10 p-3.5 rounded-2xl hover:bg-[#F2C94C]/10 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-1.5">🏖️</div>
                <div className="text-sm font-bold text-[#1A1A1A]">Beach & Sea</div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">24 Experiences</div>
              </div>

              <div
                onClick={() => handleCategoryClick("cat-wellness")}
                className="bg-[#FDFBF7] border border-[#044D29]/10 p-3.5 rounded-2xl hover:bg-[#F2C94C]/10 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-1.5">🧘</div>
                <div className="text-sm font-bold text-[#1A1A1A]">Wellness</div>
                <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">15 Retreats</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-[#044D29] rounded-2xl flex items-center justify-between text-white">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Trip Status</div>
              <div className="text-xs font-bold truncate max-w-[130px]">
                {bookings.length > 0 ? `${bookings.length} active booking(s)` : "No active bookings"}
              </div>
            </div>
            <button
              onClick={() => {
                if (bookings.length > 0) {
                  setActiveTab("bookings");
                } else {
                  setIsPlanMyTripOpen(true);
                }
              }}
              className="bg-[#F2C94C] text-[#044D29] px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-[#ebd54b] transition-colors cursor-pointer"
            >
              {bookings.length > 0 ? "View Voucher" : "Plan Now"}
            </button>
          </div>
        </div>

        {/* Bento Cell 3: Transport / Airport Transfers (col-span-3 or 6) */}
        <div
          onClick={() => handleCategoryClick("cat-transfers")}
          className="col-span-12 sm:col-span-6 lg:col-span-2 bg-[#E26D5C] rounded-3xl p-6 text-white flex flex-col justify-end relative overflow-hidden cursor-pointer group hover:shadow-md transition-all min-h-[170px]"
        >
          <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
            <Car className="w-4 h-4" />
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">Transport</div>
          <div className="text-xl font-bold leading-tight">Airport<br />Transfers</div>
          <div className="mt-3 text-xs font-medium bg-black/15 py-1 px-2 rounded-lg inline-block w-fit">
            Starting from IDR 150k
          </div>
        </div>

        {/* Bento Cell 4: Limited Offers (col-span-3 or 6) */}
        <div
          onClick={() => {
            setActiveProductTab("bestsellers");
            setActiveTab("explore");
          }}
          className="col-span-12 sm:col-span-6 lg:col-span-2 bg-[#044D29] rounded-3xl p-6 text-white flex flex-col justify-end relative overflow-hidden cursor-pointer group hover:shadow-md transition-all min-h-[170px]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-[#F2C94C]" />
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">Exclusive</div>
          <div className="text-xl font-bold leading-tight">Limited<br />Offers</div>
          <div className="mt-3 text-xs font-bold bg-[#F2C94C] text-[#044D29] py-1 px-2 rounded-lg inline-block w-fit">
            Save up to 45%
          </div>
        </div>

        {/* Bento Cell 5: Spotlight Top Seller (col-span-8) */}
        {topSellerProduct && (
          <div
            onClick={() => {
              setSelectedProductId(topSellerProduct.id);
              setActiveTab("product_detail");
            }}
            className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#044D29]/5 flex flex-col sm:flex-row items-center gap-5 cursor-pointer group hover:border-[#044D29]/20 transition-all"
          >
            <div
              className="w-full sm:w-36 h-36 rounded-2xl bg-cover bg-center shrink-0 shadow-inner group-hover:scale-102 transition-transform duration-300"
              style={{ backgroundImage: `url(${topSellerProduct.images[0]})` }}
            />
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[#F2C94C] text-sm">★★★★★</span>
                <span className="text-[10px] text-[#044D29] bg-[#044D29]/10 font-bold uppercase px-2 py-0.5 rounded-full">
                  Top Seller
                </span>
                <span className="text-xs text-stone-400 font-medium">({topSellerProduct.rating} / 5.0)</span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-[#044D29] group-hover:text-[#E26D5C] transition-colors leading-snug line-clamp-1">
                {language === "id" && topSellerProduct.titleId ? topSellerProduct.titleId : topSellerProduct.title}
              </h4>

              <p className="text-xs text-stone-500 line-clamp-2">
                {topSellerProduct.highlights?.join(" • ") || topSellerProduct.description}
              </p>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-bold text-[#E26D5C]">
                    {formatCurrency(topSellerProduct.startingPriceIdr, currency, exchangeRates)}
                  </span>
                  {topSellerProduct.originalPriceIdr && (
                    <span className="text-xs text-stone-400 line-through">
                      {formatCurrency(topSellerProduct.originalPriceIdr, currency, exchangeRates)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="bg-[#044D29] text-white hover:bg-[#033c20] px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Global Multi-Search Bar */}
      <HeroSearch />

      {/* 3. Bali Weather & Island Conditions Live Bar */}
      <section className="bg-white p-5 rounded-3xl border border-[#044D29]/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F2C94C]/20 text-[#044D29] flex items-center justify-center shrink-0 font-bold">
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#1A1A1A] block">
              Live Bali Island Conditions
            </span>
            <p className="text-[11px] text-stone-500">
              Updated hourly by Bali Meteorological Centre & Harbour Master
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium">
          <div className="bg-[#FDFBF7] px-3.5 py-1.5 rounded-xl border border-[#044D29]/10 flex items-center space-x-2">
            <span className="text-[#044D29] font-bold">Ubud:</span>
            <span className="text-stone-700">28°C • Light Tropical Breeze</span>
          </div>
          <div className="bg-[#FDFBF7] px-3.5 py-1.5 rounded-xl border border-[#044D29]/10 flex items-center space-x-2">
            <span className="text-[#044D29] font-bold">Uluwatu:</span>
            <span className="text-stone-700">30°C • 5-6ft Swell (Clean Waves)</span>
          </div>
          <div className="bg-[#FDFBF7] px-3.5 py-1.5 rounded-xl border border-[#044D29]/10 flex items-center space-x-2">
            <span className="text-[#044D29] font-bold">Nusa Penida Sea:</span>
            <span className="text-stone-700">Calm Waters (Fastboats Active)</span>
          </div>
        </div>
      </section>

      {/* 4. Popular Bali Destinations Carousel / Bento Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#044D29] bg-[#044D29]/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {t("popularDestinations")}
            </span>
            <h2 className="font-bold text-xl sm:text-2xl text-[#1A1A1A] mt-1.5">
              Iconic Regions of Bali & Offshore Islands
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedDestinationId(null);
              setActiveTab("explore");
            }}
            className="text-xs font-bold text-[#044D29] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Regions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleDestinationClick(dest.id)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 border border-[#044D29]/5"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <h3 className="font-bold text-sm leading-tight group-hover:text-[#F2C94C] transition-colors">
                  {dest.name}
                </h3>
                <p className="text-[10px] text-stone-300 font-medium">
                  {dest.activityCount} Experiences
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AI "Plan My Trip" Bento Card */}
      <section className="bg-gradient-to-br from-[#044D29] via-[#066336] to-[#044D29] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-md border border-[#044D29]/20">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#F2C94C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs text-[#F2C94C] font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Itinerary Assistant</span>
          </div>

          <h2 className="font-bold text-2xl sm:text-3xl text-white leading-tight">
            Design your bespoke Bali dream holiday in 30 seconds
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Tell our AI your travel duration, party composition, and favorite Bali vibe (waterfalls, spiritual temples, beach clubs, or family fun). Get a realistic, cost-estimated itinerary with verified local chauffeurs and guides.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsPlanMyTripOpen(true)}
              className="px-6 py-3 bg-[#F2C94C] hover:bg-[#ebd54b] text-[#044D29] font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#044D29]" />
              <span>Generate My Custom Bali Itinerary</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Handpicked Featured Experiences (Bestsellers / Top Rated / Instant) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#E26D5C] bg-[#E26D5C]/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {t("handpicked")}
            </span>
            <h2 className="font-bold text-xl sm:text-2xl text-[#1A1A1A] mt-1.5">
              Top-Ranked Bali Activities & Day Tours
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-[#044D29]/10">
            <button
              onClick={() => setActiveProductTab("bestsellers")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeProductTab === "bestsellers"
                  ? "bg-[#044D29] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              ★ Bestsellers
            </button>
            <button
              onClick={() => setActiveProductTab("top_rated")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeProductTab === "top_rated"
                  ? "bg-[#044D29] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Top Rated (4.9+)
            </button>
            <button
              onClick={() => setActiveProductTab("instant")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeProductTab === "instant"
                  ? "bg-[#044D29] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              ⚡ Instant Confirm
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveTab("explore")}
            className="px-6 py-2.5 bg-white border border-[#044D29]/20 hover:border-[#044D29] text-[#044D29] font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
          >
            Explore All 100+ Bali Experiences & Packages →
          </button>
        </div>
      </section>

      {/* 7. DMC Credentials & Guarantees Bento Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#044D29]/10 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#044D29]/10 text-[#044D29] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] leading-tight">
              Official Bali DMC
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Licensed local operator (ASITA 0420)
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#044D29]/10 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#E26D5C]/10 text-[#E26D5C] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] leading-tight">
              Instant Mobile QR
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Direct check-in with drivers & venues
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#044D29]/10 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] leading-tight">
              Free 24h Cancel
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              100% money-back peace of mind
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#044D29]/10 shadow-xs flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F2C94C]/20 text-[#044D29] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-[#044D29]" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] leading-tight">
              Best Price Direct
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Zero middleman markups
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

