import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  MapPin,
  Star,
  Zap,
  ShieldCheck,
  RotateCcw,
  ArrowUpDown,
  Filter,
  X,
  Compass,
} from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { ProductCard } from "./ProductCard";
import { formatCurrency } from "../utils/currency";
import { getTranslation } from "../utils/i18n";
import { Product } from "../types";

export const ExploreView: React.FC = () => {
  const {
    products,
    destinations,
    categories,
    searchQuery,
    setSearchQuery,
    selectedDestinationId,
    setSelectedDestinationId,
    selectedCategoryId,
    setSelectedCategoryId,
    currency,
    exchangeRates,
    language,
  } = useTravelStore();

  const t = (key: any) => getTranslation(language, key);

  // Filter States
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [onlyInstant, setOnlyInstant] = useState(false);
  const [onlyFreeCancel, setOnlyFreeCancel] = useState(false);
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    "recommended" | "price_asc" | "price_desc" | "rating" | "popular"
  >("recommended");

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset Filters
  const handleReset = () => {
    setSearchQuery("");
    setSelectedDestinationId(null);
    setSelectedCategoryId(null);
    setMaxPrice(3000000);
    setOnlyInstant(false);
    setOnlyFreeCancel(false);
    setOnlyBestsellers(false);
    setMinRating(0);
    setSortBy("recommended");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesDest = p.destinationName.toLowerCase().includes(q);
          const matchesCat = p.categoryName.toLowerCase().includes(q);
          const matchesDesc = p.shortDescription.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDest && !matchesCat && !matchesDesc) return false;
        }

        // Destination
        if (selectedDestinationId && p.destinationId !== selectedDestinationId) {
          return false;
        }

        // Category
        if (selectedCategoryId && p.categoryId !== selectedCategoryId) {
          return false;
        }

        // Max Price
        if (p.startingPriceIdr > maxPrice) {
          return false;
        }

        // Instant Confirmation
        if (onlyInstant && !p.instantConfirmation) {
          return false;
        }

        // Free Cancellation
        if (onlyFreeCancel && !p.freeCancellation) {
          return false;
        }

        // Bestseller
        if (onlyBestsellers && !p.isBestseller) {
          return false;
        }

        // Rating
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.startingPriceIdr - b.startingPriceIdr;
        if (sortBy === "price_desc") return b.startingPriceIdr - a.startingPriceIdr;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "popular") return b.bookingCount - a.bookingCount;
        return 0; // recommended
      });
  }, [
    products,
    searchQuery,
    selectedDestinationId,
    selectedCategoryId,
    maxPrice,
    onlyInstant,
    onlyFreeCancel,
    onlyBestsellers,
    minRating,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedDestinationId ? 1 : 0) +
    (selectedCategoryId ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (onlyInstant ? 1 : 0) +
    (onlyFreeCancel ? 1 : 0) +
    (onlyBestsellers ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 3000000 ? 1 : 0);

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900">
              Explore Bali Experiences & Tours
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Showing <strong className="text-stone-800">{filteredProducts.length}</strong> verified activities from licensed local DMC suppliers
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#0d4a44]" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer text-xs"
              >
                <option value="recommended">Featured / Recommended</option>
                <option value="popular">Most Booked</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Horizontal Quick Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategoryId === null
                ? "bg-[#0d4a44] text-white"
                : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(selectedCategoryId === c.id ? null : c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategoryId === c.id
                  ? "bg-[#0d4a44] text-white"
                  : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              {language === "id" ? c.nameId : c.name}
            </button>
          ))}
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (Left Col) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-serif font-bold text-sm text-stone-900 flex items-center space-x-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-[#0d4a44]" />
                  <span>Filter Catalog</span>
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-[#c85a32] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {/* Destination Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                  Bali Destinations
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {destinations.map((d) => (
                    <label
                      key={d.id}
                      className="flex items-center justify-between text-xs text-stone-700 hover:bg-stone-50 p-1.5 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedDestinationId === d.id}
                          onChange={() =>
                            setSelectedDestinationId(selectedDestinationId === d.id ? null : d.id)
                          }
                          className="accent-[#0d4a44]"
                        />
                        <span>{d.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">{d.activityCount}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-[#0d4a44]">
                    {formatCurrency(maxPrice, currency, exchangeRates)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={3000000}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0d4a44] cursor-pointer"
                />
              </div>

              {/* Quick Perks Toggles */}
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                <label className="flex items-center space-x-2 text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInstant}
                    onChange={(e) => setOnlyInstant(e.target.checked)}
                    className="accent-[#0d4a44]"
                  />
                  <span>⚡ Instant Confirmation Only</span>
                </label>

                <label className="flex items-center space-x-2 text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFreeCancel}
                    onChange={(e) => setOnlyFreeCancel(e.target.checked)}
                    className="accent-[#0d4a44]"
                  />
                  <span>🛡️ Free 24h Cancellation</span>
                </label>

                <label className="flex items-center space-x-2 text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyBestsellers}
                    onChange={(e) => setOnlyBestsellers(e.target.checked)}
                    className="accent-[#0d4a44]"
                  />
                  <span>★ Bestsellers Only</span>
                </label>
              </div>

              {/* Minimum Rating */}
              <div className="pt-3 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                  Guest Rating
                </label>
                <div className="flex space-x-1.5">
                  {[0, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(minRating === r ? 0 : r)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        minRating === r
                          ? "bg-amber-500 text-stone-950 border-amber-500 font-bold"
                          : "bg-stone-50 border-stone-200 text-stone-700"
                      }`}
                    >
                      {r === 0 ? "All" : `★ ${r}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Cards Grid (Right Col) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-stone-200">
                <Compass className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-stone-800">
                  No matching Bali activities found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing some filter criteria or searching for different keywords like "Ubud", "Temple", or "Boat".
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-[#0d4a44] text-white text-xs font-bold rounded-xl hover:bg-[#16655e] cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between animate-in slide-in-from-right">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-serif font-bold text-base text-stone-900">Filters</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Destination Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Destinations</label>
                <div className="space-y-1.5">
                  {destinations.map((d) => (
                    <label key={d.id} className="flex items-center space-x-2 text-xs text-stone-700">
                      <input
                        type="checkbox"
                        checked={selectedDestinationId === d.id}
                        onChange={() =>
                          setSelectedDestinationId(selectedDestinationId === d.id ? null : d.id)
                        }
                        className="accent-[#0d4a44]"
                      />
                      <span>{d.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Perks */}
              <div className="space-y-2 text-xs">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={onlyInstant}
                    onChange={(e) => setOnlyInstant(e.target.checked)}
                    className="accent-[#0d4a44]"
                  />
                  <span>Instant Confirmation</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={onlyFreeCancel}
                    onChange={(e) => setOnlyFreeCancel(e.target.checked)}
                    className="accent-[#0d4a44]"
                  />
                  <span>Free Cancellation</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-[#0d4a44] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
