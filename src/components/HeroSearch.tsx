import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  Compass,
  Ticket,
  Mountain,
  Car,
  Palmtree,
  Waves,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
} from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { getTranslation } from "../utils/i18n";

export const HeroSearch: React.FC = () => {
  const {
    destinations,
    categories,
    searchQuery,
    setSearchQuery,
    setSelectedDestinationId,
    setSelectedCategoryId,
    setActiveTab,
    setIsPlanMyTripOpen,
    language,
  } = useTravelStore();

  const t = (key: any) => getTranslation(language, key);

  const [selectedDest, setSelectedDest] = useState<string>("");
  const [travelDate, setTravelDate] = useState<string>("2026-08-28");
  const [guestCount, setGuestCount] = useState<number>(2);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDest) {
      setSelectedDestinationId(selectedDest);
    }
    setActiveTab("explore");
  };

  const categoryIcons: Record<string, any> = {
    "cat-tours": Compass,
    "cat-attractions": Ticket,
    "cat-activities": Mountain,
    "cat-transfers": Car,
    "cat-wellness": Sparkles,
    "cat-culinary": Palmtree,
    "cat-water-sports": Waves,
    "cat-packages": Palmtree,
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#044D29]/10 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-[#044D29] bg-[#044D29]/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {t("searchDestinations")}
            </span>
            <h3 className="font-bold text-xl sm:text-2xl text-[#1A1A1A] mt-1">
              Find & Customize Bali Experiences
            </h3>
          </div>
          <p className="text-xs text-stone-500 max-w-sm">
            Over 150+ verified excursions, temple day tours, private luxury chauffeurs, and instant QR e-vouchers.
          </p>
        </div>

        {/* Global Multi-Criteria Search Card */}
        <div className="bg-[#FDFBF7] text-[#1A1A1A] rounded-3xl p-3 sm:p-4 border border-[#044D29]/10">
          <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* 1. Destination Dropdown */}
            <div className="md:col-span-4 p-2.5 sm:p-3 bg-white rounded-2xl hover:bg-[#F2C94C]/10 transition-colors border border-[#044D29]/10">
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                {t("searchDestinations")}
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#E26D5C] shrink-0" />
                <select
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1A1A1A] focus:outline-none cursor-pointer"
                >
                  <option value="">All Bali Regions (Ubud, Uluwatu, Penida...)</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.activityCount} experiences)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Travel Date Picker */}
            <div className="md:col-span-3 p-2.5 sm:p-3 bg-white rounded-2xl hover:bg-[#F2C94C]/10 transition-colors border border-[#044D29]/10">
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                {t("selectDates")}
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#044D29] shrink-0" />
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#1A1A1A] focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Guests Selector */}
            <div className="md:col-span-3 p-2.5 sm:p-3 bg-white rounded-2xl hover:bg-[#F2C94C]/10 transition-colors border border-[#044D29]/10 relative">
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                {t("guests")}
              </label>
              <button
                type="button"
                onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1A1A1A] focus:outline-none cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#044D29] shrink-0" />
                  <span>{guestCount} Travelers</span>
                </div>
              </button>

              {isGuestDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#044D29]/10 p-3 z-30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1A1A]">Participants</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-7 h-7 rounded-full bg-[#FDFBF7] text-stone-700 hover:bg-[#F2C94C]/20 font-bold flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-[#1A1A1A]">{guestCount}</span>
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                        className="w-7 h-7 rounded-full bg-[#FDFBF7] text-stone-700 hover:bg-[#F2C94C]/20 font-bold flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Search Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-full min-h-[48px] bg-[#044D29] hover:bg-[#033c20] text-white font-bold text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-xs transition-all transform active:scale-95 cursor-pointer py-3"
              >
                <Search className="w-4 h-4" />
                <span>{t("searchButton")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Category Quick Chips Grid */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id] || Compass;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedDestinationId(null);
                    setActiveTab("explore");
                  }}
                  className="group flex flex-col items-center justify-center p-3 bg-[#FDFBF7] hover:bg-[#F2C94C]/15 rounded-2xl border border-[#044D29]/10 transition-all text-center cursor-pointer hover:-translate-y-0.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#044D29]/10 text-[#044D29] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1A1A1A] group-hover:text-[#044D29] leading-tight">
                    {language === "id" ? cat.nameId : cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
