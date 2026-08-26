import React, { useState } from "react";
import { BookOpen, Clock, Tag, User, ArrowRight, X, Sparkles, MapPin } from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { TravelGuide } from "../types";

export const TravelGuidesView: React.FC = () => {
  const { travelGuides } = useTravelStore();
  const [selectedGuide, setSelectedGuide] = useState<TravelGuide | null>(null);

  return (
    <div className="bg-[#faf9f6] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            PT. Bali Sundaram Editorial Desk
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900">
            Bali Insider Travel Guides & Secrets
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Expertly curated tips on local etiquette, secret waterfalls, volcano safety, and authentic culinary journeys.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {travelGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col cursor-pointer group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0d4a44] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  {guide.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] text-stone-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{guide.readTimeMinutes} min read</span>
                    <span>•</span>
                    <span>{guide.publishedDate}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#0d4a44] transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#0d4a44]">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative aspect-[16/9] w-full bg-stone-900">
              <img
                src={selectedGuide.coverImage}
                alt={selectedGuide.title}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setSelectedGuide(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center space-x-2 text-xs text-stone-500">
                <span className="font-bold text-[#0d4a44] bg-teal-50 px-2 py-0.5 rounded">
                  {selectedGuide.category}
                </span>
                <span>•</span>
                <span>By {selectedGuide.author}</span>
                <span>•</span>
                <span>{selectedGuide.publishedDate}</span>
              </div>

              <h2 className="font-serif font-black text-2xl text-stone-900">
                {selectedGuide.title}
              </h2>

              <div className="prose prose-stone text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3 whitespace-pre-line">
                {selectedGuide.content}
              </div>

              <div className="pt-4 border-t border-stone-200 flex flex-wrap gap-1.5">
                {selectedGuide.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
