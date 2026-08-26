import React, { useState } from "react";
import {
  Compass,
  Heart,
  Calendar,
  User as UserIcon,
  Globe,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  QrCode,
  SlidersHorizontal,
  Layers,
  MapPin,
  Menu,
  X,
  Phone,
  ArrowRightLeft,
} from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { CurrencyCode, LanguageCode, UserRole } from "../types";
import { CURRENCY_NAMES, CURRENCY_SYMBOLS } from "../utils/currency";
import { getTranslation } from "../utils/i18n";

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenRoleSwitcher: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenRoleSwitcher }) => {
  const {
    currency,
    setCurrency,
    language,
    setLanguage,
    currentUser,
    wishlistIds,
    bookings,
    activeTab,
    setActiveTab,
    setSelectedProductId,
    setSelectedDestinationId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    setIsPlanMyTripOpen,
    setIsQRScannerOpen,
    activeCompareProductIds,
  } = useTravelStore();

  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const t = (key: any) => getTranslation(language, key);

  const currencies: CurrencyCode[] = ["IDR", "USD", "AUD", "SGD", "MYR", "INR", "EUR", "GBP"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedProductId(null);
      setSelectedDestinationId(null);
      setSelectedCategoryId(null);
      setActiveTab("explore");
    }
  };

  const navLinks = [
    { id: "home", label: t("home") },
    { id: "explore", label: t("explore") },
    { id: "tours", label: t("tours"), categoryId: "cat-tours" },
    { id: "attractions", label: t("attractions"), categoryId: "cat-attractions" },
    { id: "activities", label: t("activities"), categoryId: "cat-activities" },
    { id: "transport", label: t("transport"), categoryId: "cat-transfers" },
    { id: "guides", label: t("travelGuides") },
    { id: "help", label: t("helpCenter") },
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return { label: "Super Admin", color: "bg-purple-900 text-purple-200 border-purple-700" };
      case "admin":
        return { label: "Admin", color: "bg-red-900 text-red-200 border-red-700" };
      case "supplier":
        return { label: "Supplier Partner", color: "bg-blue-900 text-blue-200 border-blue-700" };
      case "operations":
        return { label: "Operations Team", color: "bg-emerald-900 text-emerald-200 border-emerald-700" };
      case "sales_agent":
        return { label: "Sales Agent", color: "bg-amber-900 text-amber-200 border-amber-700" };
      case "finance":
        return { label: "Finance Team", color: "bg-indigo-900 text-indigo-200 border-indigo-700" };
      case "customer_service":
        return { label: "Customer Service", color: "bg-teal-900 text-teal-200 border-teal-700" };
      case "content_editor":
        return { label: "Content Editor", color: "bg-cyan-900 text-cyan-200 border-cyan-700" };
      default:
        return { label: "Customer", color: "bg-stone-800 text-stone-200 border-stone-700" };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#044D29]/10 transition-all">
      {/* Top Banner: DMC License & Role Simulation Indicator */}
      <div className="bg-[#044D29] text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="font-bold tracking-wide text-[#F2C94C]">PT. BALI SUNDARAM TRAVEL</span>
            <span className="hidden sm:inline text-emerald-200">• Licensed Bali DMC No. 551.2/184/DIPARDA</span>
            <span className="hidden md:inline text-emerald-300">• 24/7 Concierge WhatsApp: +62 812-3456-7890</span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Quick Role Switcher Button */}
            <button
              onClick={onOpenRoleSwitcher}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              title="Click to switch role simulation persona"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F2C94C]" />
              <span>Role: {roleInfo.label}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {/* Staff QR Scanner Button (if staff/supplier/admin) */}
            {currentUser.role !== "customer" && (
              <button
                onClick={() => setIsQRScannerOpen(true)}
                className="hidden sm:flex items-center space-x-1 bg-[#F2C94C] hover:bg-[#ebd54b] text-[#044D29] font-bold px-2.5 py-0.5 rounded-full text-xs transition-colors cursor-pointer"
              >
                <QrCode className="w-3 h-3" />
                <span>Scan Voucher</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => {
              setSelectedProductId(null);
              setSelectedDestinationId(null);
              setSelectedCategoryId(null);
              setActiveTab("home");
            }}
            className="flex items-center space-x-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#044D29] flex items-center justify-center text-white shadow-xs">
              <span className="font-serif font-black text-xl text-[#F2C94C]">S</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#044D29]">
              SUNDARAM<span className="text-[#E26D5C]">.TRAVEL</span>
            </div>
          </div>

          {/* Global Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <div className="flex items-center bg-[#F5F5F5] rounded-full px-4 py-2 w-full border border-transparent focus-within:border-[#F2C94C] transition-all">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Explore Ubud, Nusa Penida, Uluwatu..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none text-[#1A1A1A] placeholder-stone-400"
              />
              <button
                type="submit"
                className="bg-[#044D29] text-white hover:bg-[#033c20] text-xs font-bold px-3 py-1 rounded-full transition-colors cursor-pointer shrink-0 ml-2"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-sm font-medium">
            {/* Custom Trip / AI Planner Trigger */}
            <button
              onClick={() => setIsPlanMyTripOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 bg-[#E26D5C] hover:bg-[#d15d4d] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{t("planMyTrip")}</span>
            </button>

            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                  setIsLangMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-stone-100 rounded-xl border border-[#044D29]/10 transition-colors cursor-pointer"
              >
                <span className="opacity-60">{currency}</span>
                <span className="hidden sm:inline font-normal">{CURRENCY_NAMES[currency]}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isCurrencyMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-[#044D29]/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Currency
                  </div>
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#FDFBF7] cursor-pointer ${
                        currency === c ? "text-[#044D29] font-bold bg-[#044D29]/5" : "text-stone-700"
                      }`}
                    >
                      <span className="truncate">{CURRENCY_NAMES[c]}</span>
                      <span className="font-mono text-stone-500 text-[11px]">{CURRENCY_SYMBOLS[c]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangMenuOpen(!isLangMenuOpen);
                  setIsCurrencyMenuOpen(false);
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-stone-100 rounded-xl border border-[#044D29]/10 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span className="uppercase">{language}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-2xl shadow-xl border border-[#044D29]/10 py-1.5 z-50">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-[#FDFBF7] cursor-pointer ${
                      language === "en" ? "text-[#044D29] font-bold bg-[#044D29]/5" : "text-stone-700"
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("id");
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-[#FDFBF7] cursor-pointer ${
                      language === "id" ? "text-[#044D29] font-bold bg-[#044D29]/5" : "text-stone-700"
                    }`}
                  >
                    <span>🇮🇩</span>
                    <span>Bahasa Indonesia</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Shortcut */}
            <button
              onClick={() => {
                setSelectedProductId(null);
                setActiveTab("wishlist");
              }}
              className="relative p-2 text-stone-600 hover:text-[#E26D5C] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E26D5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* My Bookings Shortcut */}
            <button
              onClick={() => {
                setSelectedProductId(null);
                setActiveTab("bookings");
              }}
              className="relative p-2 text-stone-600 hover:text-[#044D29] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="My Bookings"
            >
              <Calendar className="w-5 h-5" />
              {bookings.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#044D29] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {bookings.length}
                </span>
              )}
            </button>

            {/* User Account / Dashboard Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 bg-[#044D29]/5 hover:bg-[#044D29]/10 rounded-full text-xs font-bold text-[#044D29] transition-colors cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#F2C94C] text-[#044D29] flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name.split(" ")[0]}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-[#044D29]/10 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F2C94C]/20 text-[#044D29]">
                      Tier: {currentUser.membershipTier || "Explorer"} • {currentUser.rewardPoints || 0} pts
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-[#044D29]/5 hover:text-[#044D29] font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-[#044D29]" />
                      <span>{roleInfo.label} Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("bookings");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-stone-400" />
                      <span>{t("myBookings")}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("wishlist");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-stone-400" />
                      <span>{t("wishlist")}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("affiliate");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Sundaram Affiliate Portal</span>
                    </button>
                  </div>

                  <div className="border-t border-stone-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        onOpenRoleSwitcher();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#044D29] hover:bg-[#044D29]/5 font-bold flex items-center space-x-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#044D29]" />
                      <span>Switch Role Persona</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-500 hover:bg-stone-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-stone-400" />
                      <span>Switch / Log In Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links Bar */}
        <nav className="hidden md:flex items-center space-x-6 pt-2.5 mt-1 border-t border-[#044D29]/5 text-xs font-semibold text-stone-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setSelectedProductId(null);
                if (link.categoryId) {
                  setSelectedCategoryId(link.categoryId);
                  setActiveTab("explore");
                } else {
                  setSelectedCategoryId(null);
                  setActiveTab(link.id);
                }
              }}
              className={`pb-1 transition-colors hover:text-[#044D29] cursor-pointer ${
                activeTab === link.id ? "text-[#044D29] border-b-2 border-[#044D29] font-bold" : ""
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedProductId(null);
              setActiveTab("packages");
            }}
            className="text-[#E26D5C] hover:text-[#d15d4d] font-bold flex items-center space-x-1 cursor-pointer"
          >
            <span>✨ {t("travelPackages")}</span>
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-stone-100 mt-2 space-y-2">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full pl-9 pr-20 py-2 text-xs bg-stone-100 border border-[#044D29]/10 rounded-full"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#044D29] text-white text-[11px] font-bold px-3 py-1 rounded-full"
              >
                Search
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-stone-700">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setSelectedProductId(null);
                    if (link.categoryId) {
                      setSelectedCategoryId(link.categoryId);
                      setActiveTab("explore");
                    } else {
                      setSelectedCategoryId(null);
                      setActiveTab(link.id);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 bg-white rounded-xl border border-[#044D29]/5 hover:bg-[#044D29]/5 hover:text-[#044D29]"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsPlanMyTripOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-[#E26D5C] hover:bg-[#d15d4d] text-white font-bold text-xs py-2.5 rounded-2xl shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t("planMyTrip")} (AI Itinerary Generator)</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
