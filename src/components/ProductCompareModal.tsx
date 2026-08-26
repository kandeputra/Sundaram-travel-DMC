import React from "react";
import { X, Scale, Star, Zap, ShieldCheck, Check, Clock, Globe, ArrowRight } from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { formatCurrency } from "../utils/currency";

export const ProductCompareModal: React.FC = () => {
  const {
    activeCompareProductIds,
    toggleCompareProduct,
    clearCompareProducts,
    products,
    currency,
    exchangeRates,
    setSelectedProductId,
    setActiveTab,
  } = useTravelStore();

  if (activeCompareProductIds.length === 0) return null;

  const comparedProducts = products.filter((p) => activeCompareProductIds.includes(p.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-5xl mx-auto bg-stone-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-stone-700 p-4 pointer-events-auto animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span className="font-serif font-bold text-sm">
              Activity Comparison ({comparedProducts.length} Selected)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={clearCompareProducts}
              className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 overflow-x-auto">
          {comparedProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-stone-800/90 rounded-xl p-3 border border-stone-700 space-y-2 relative"
            >
              <button
                onClick={() => toggleCompareProduct(prod.id)}
                className="absolute top-2 right-2 p-1 text-stone-400 hover:text-white rounded-full bg-stone-700/80 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-2">
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-xs text-stone-100 truncate">{prod.title}</h4>
                  <p className="text-[10px] text-amber-300 font-serif font-bold">
                    {formatCurrency(prod.startingPriceIdr, currency, exchangeRates)}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-stone-300 space-y-1 pt-1 border-t border-stone-700/60">
                <p>📍 {prod.destinationName}</p>
                <p>⏱️ Duration: {prod.duration}</p>
                <p>★ Rating: {prod.rating} ({prod.reviewCount} reviews)</p>
                <p>
                  ⚡ Instant:{" "}
                  <span className={prod.instantConfirmation ? "text-emerald-400 font-bold" : "text-stone-500"}>
                    {prod.instantConfirmation ? "Yes" : "No"}
                  </span>
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedProductId(prod.id);
                  setActiveTab("product_detail");
                }}
                className="w-full py-1.5 bg-[#0d4a44] hover:bg-[#16655e] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
