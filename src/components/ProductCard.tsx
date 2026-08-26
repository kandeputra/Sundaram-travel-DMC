import React from "react";
import { Star, Heart, Zap, ShieldCheck, MapPin, ArrowRight, Check, Scale } from "lucide-react";
import { Product } from "../types";
import { useTravelStore } from "../store/travelStore";
import { formatCurrency } from "../utils/currency";
import { getTranslation } from "../utils/i18n";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const {
    currency,
    exchangeRates,
    language,
    toggleWishlist,
    isWishlisted,
    setSelectedProductId,
    setActiveTab,
    activeCompareProductIds,
    toggleCompareProduct,
  } = useTravelStore();

  const t = (key: any) => getTranslation(language, key);
  const wishlisted = isWishlisted(product.id);
  const isCompared = activeCompareProductIds.includes(product.id);

  const displayTitle = language === "id" && product.titleId ? product.titleId : product.title;

  const handleClick = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      setSelectedProductId(product.id);
      setActiveTab("product_detail");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-3xl border border-[#044D29]/10 overflow-hidden shadow-xs hover:shadow-md hover:border-[#044D29]/25 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-0.5 relative"
    >
      {/* Product Image & Floating Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FDFBF7]">
        <img
          src={product.images[0]}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="bg-[#E26D5C] text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              ★ {t("bestseller")}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="bg-[#F2C94C] text-[#044D29] font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              Save {product.discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer shadow-xs ${
            wishlisted
              ? "bg-[#E26D5C] text-white scale-105"
              : "bg-white/80 text-stone-700 hover:bg-white hover:text-[#E26D5C]"
          }`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Bottom image overlay: Destination & Duration */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium z-10">
          <span className="flex items-center space-x-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
            <MapPin className="w-3 h-3 text-[#F2C94C]" />
            <span>{product.destinationName}</span>
          </span>
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">{product.duration}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Verified Tag */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium mb-1">
            <span className="text-[#044D29] font-bold">{product.categoryName}</span>
            <span className="text-stone-400 truncate max-w-[120px]">{product.supplierName}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-[#1A1A1A] line-clamp-2 leading-snug group-hover:text-[#E26D5C] transition-colors">
            {displayTitle}
          </h3>

          {/* Rating & Bookings Counter */}
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <div className="flex items-center space-x-1 text-[#044D29] font-bold bg-[#F2C94C]/20 px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-[#044D29] text-[#044D29]" />
              <span>{product.rating.toFixed(2)}</span>
            </div>
            <span className="text-stone-400 text-[11px]">({product.reviewCount} {t("reviews")})</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 text-[11px] font-medium">{product.bookingCount.toLocaleString()} {t("booked")}</span>
          </div>

          {/* Key Service Highlights Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.instantConfirmation && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-medium text-[#044D29] bg-[#044D29]/5 px-2 py-0.5 rounded-full border border-[#044D29]/10">
                <Zap className="w-2.5 h-2.5 text-[#044D29]" />
                <span>{t("instantConfirmation")}</span>
              </span>
            )}
            {product.freeCancellation && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
                <span>{t("freeCancellation")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing Footer & Compare Tool */}
        <div className="pt-3 border-t border-[#044D29]/10 flex items-end justify-between">
          <div>
            <span className="text-[10px] text-stone-400 font-medium block uppercase tracking-wider">
              {t("startingFrom")}
            </span>
            <div className="flex items-baseline space-x-1.5">
              {product.originalPriceIdr && product.originalPriceIdr > product.startingPriceIdr && (
                <span className="text-xs text-stone-400 line-through">
                  {formatCurrency(product.originalPriceIdr, currency, exchangeRates)}
                </span>
              )}
              <span className="font-bold text-base text-[#044D29]">
                {formatCurrency(product.startingPriceIdr, currency, exchangeRates)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Compare Checkbox */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCompareProduct(product.id);
              }}
              className={`p-1.5 rounded-xl border text-[11px] flex items-center space-x-1 transition-colors cursor-pointer ${
                isCompared
                  ? "bg-[#F2C94C]/30 border-[#F2C94C] text-[#044D29] font-bold"
                  : "border-[#044D29]/10 text-stone-400 hover:text-stone-700 hover:bg-[#FDFBF7]"
              }`}
              title="Compare with other activities"
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">{isCompared ? "Compared" : "Compare"}</span>
            </button>

            {/* Quick Action Arrow */}
            <div className="w-8 h-8 rounded-full bg-[#FDFBF7] border border-[#044D29]/10 group-hover:bg-[#044D29] group-hover:text-white text-stone-600 flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
