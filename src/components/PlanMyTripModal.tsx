import React, { useState } from "react";
import {
  X,
  Sparkles,
  Calendar,
  Users,
  Compass,
  DollarSign,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Car,
  Palmtree,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { formatCurrency } from "../utils/currency";
import { GeneratedItinerary, TripInquiry } from "../types";

export const PlanMyTripModal: React.FC = () => {
  const {
    isPlanMyTripOpen,
    setIsPlanMyTripOpen,
    currentUser,
    currency,
    exchangeRates,
    addTripInquiry,
  } = useTravelStore();

  const [durationDays, setDurationDays] = useState(5);
  const [travelStyle, setTravelStyle] = useState<
    "Luxury" | "Cultural" | "Adventure" | "Family" | "Honeymoon" | "Wellness"
  >("Cultural");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    "Ubud",
    "Uluwatu",
    "Nusa Penida",
  ]);
  const [paxCount, setPaxCount] = useState(2);
  const [budgetTier, setBudgetTier] = useState<"Standard" | "Comfort" | "Luxury">("Comfort");
  const [specialNotes, setSpecialNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedItinerary | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  if (!isPlanMyTripOpen) return null;

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      if (selectedRegions.length > 1) {
        setSelectedRegions(selectedRegions.filter((r) => r !== region));
      }
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const response = await fetch("/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationDays,
          travelStyle,
          preferredRegions: selectedRegions,
          paxCount,
          budgetTier,
          specialNotes,
        }),
      });

      const data = await response.json();
      if (data.itinerary) {
        setGeneratedResult(data.itinerary);
      }
    } catch (err) {
      console.error("Failed to call itinerary generator", err);
      // Fallback preview
      setGeneratedResult({
        tripTitle: `${durationDays}-Day ${travelStyle} Essence of Bali`,
        summary: `Custom crafted journey exploring ${selectedRegions.join(", ")} with private air-conditioned vehicle and licensed English-speaking guide.`,
        days: Array.from({ length: durationDays }).map((_, i) => ({
          dayNumber: i + 1,
          title: `Day ${i + 1}: ${selectedRegions[i % selectedRegions.length]} Highlights`,
          region: selectedRegions[i % selectedRegions.length],
          morning: "Guided cultural exploration and temple blessing ceremony.",
          afternoon: "Scenic plantation lunch followed by waterfall nature hike.",
          evening: "Sunset viewpoint dinner and traditional dance performance.",
          mealsIncluded: ["Breakfast", "Lunch"],
          suggestedTransport: "Private Toyota Innova Chauffeur",
        })),
        estimatedCostPerPersonIdr: 4500000 + durationDays * 850000,
        currency: "IDR",
        inclusions: [
          "Private dedicated vehicle & fuel for all days",
          "Licensed Bali HPI English-speaking guide",
          "All temple entry tickets and sarongs",
          "Daily gourmet Balinese lunches",
          "24/7 dedicated WhatsApp concierge",
        ],
        insiderTips: [
          "Exchange currency only at authorized banks or PT. Bali Sundaram partner counters.",
          "Pack modest shoulder wraps for holy water springs.",
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToSalesDesk = () => {
    if (!generatedResult) return;

    addTripInquiry({
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone,
      durationDays,
      travelStyle,
      paxCount,
      preferredRegions: selectedRegions,
      budgetTier,
      specialNotes,
      generatedItinerary: generatedResult,
    });

    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setIsPlanMyTripOpen(false);
    }, 2500);
  };

  const allRegions = [
    "Ubud & Central Bali",
    "Seminyak & Canggu",
    "Uluwatu & Bukit Peninsula",
    "Nusa Penida & Lembongan",
    "Kintamani & Mount Batur",
    "Bedugul & Munduk",
    "Amed & East Bali",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d4a44] to-[#16655e] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg text-amber-200">
                AI Plan My Bali Trip
              </h3>
              <p className="text-xs text-teal-100">
                Custom DMC Itinerary Architect powered by PT. Bali Sundaram Travel
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPlanMyTripOpen(false)}
            className="p-1.5 text-teal-200 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50">
          {!generatedResult ? (
            <div className="space-y-5">
              {/* Duration & Pax */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-[#0d4a44]" />
                    <span>Trip Duration ({durationDays} Days)</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    {[3, 4, 5, 7, 10, 14].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDurationDays(d)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          durationDays === d
                            ? "bg-[#0d4a44] text-white border-[#0d4a44]"
                            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {d}D
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-[#0d4a44]" />
                    <span>Travel Party Size ({paxCount} Pax)</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                      className="w-8 h-8 rounded-lg bg-stone-100 font-bold text-sm text-stone-700 hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-stone-900 w-12 text-center">
                      {paxCount} Travelers
                    </span>
                    <button
                      type="button"
                      onClick={() => setPaxCount(paxCount + 1)}
                      className="w-8 h-8 rounded-lg bg-stone-100 font-bold text-sm text-stone-700 hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Travel Style */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Preferred Travel Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                  {[
                    "Cultural",
                    "Adventure",
                    "Luxury",
                    "Family",
                    "Honeymoon",
                    "Wellness",
                  ].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTravelStyle(st as any)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        travelStyle === st
                          ? "bg-teal-50 border-[#0d4a44] text-[#0d4a44] font-bold"
                          : "border-stone-200 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Bali Regions */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Select Desired Bali Regions
                </label>
                <div className="flex flex-wrap gap-2">
                  {allRegions.map((reg) => {
                    const isSelected = selectedRegions.includes(reg.split(" ")[0]);
                    return (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => toggleRegion(reg.split(" ")[0])}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#0d4a44] text-white border-[#0d4a44]"
                            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {reg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Specific Highlights or Notes (e.g. Floating breakfast, private yacht, baby stroller)
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Optional: Let our destination architects know your dreams..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                />
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerate}
                className={`w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Gemini AI is crafting your Bali master itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Custom Bali Itinerary</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Generated Itinerary Result Display */
            <div className="space-y-6 animate-in fade-in">
              {inquirySubmitted ? (
                <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif font-bold text-lg text-emerald-950">
                    Itinerary Dispatched to Sales Agent Desk!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Senior Travel Consultant Kadek Mahadewi will review your {durationDays}-day plan and WhatsApp you with customized pricing options within 2 hours.
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary Box */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-3 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="bg-teal-50 text-[#0d4a44] font-bold text-xs px-2.5 py-1 rounded-md">
                        {durationDays} Days • {travelStyle} Style • {paxCount} Travelers
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 font-bold block uppercase">
                          Estimated Per Person
                        </span>
                        <span className="font-serif font-black text-base text-[#0d4a44]">
                          {formatCurrency(
                            generatedResult.estimatedCostPerPersonIdr,
                            currency,
                            exchangeRates
                          )}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-serif font-bold text-xl text-stone-900">
                      {generatedResult.tripTitle}
                    </h2>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {generatedResult.summary}
                    </p>
                  </div>

                  {/* Day by Day Cards */}
                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      Daily Schedule & Routing
                    </h3>
                    {generatedResult.days.map((day) => (
                      <div
                        key={day.dayNumber}
                        className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                          <span className="font-bold text-xs text-[#0d4a44]">
                            {day.title}
                          </span>
                          <span className="text-[11px] text-stone-500 font-medium flex items-center space-x-1">
                            <Car className="w-3 h-3 text-[#c85a32]" />
                            <span>{day.suggestedTransport}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                          <div className="p-2 bg-stone-50 rounded-xl">
                            <span className="text-[10px] font-bold text-amber-800 uppercase block">
                              Morning
                            </span>
                            <span className="text-stone-700">{day.morning}</span>
                          </div>
                          <div className="p-2 bg-stone-50 rounded-xl">
                            <span className="text-[10px] font-bold text-amber-800 uppercase block">
                              Afternoon
                            </span>
                            <span className="text-stone-700">{day.afternoon}</span>
                          </div>
                          <div className="p-2 bg-stone-50 rounded-xl">
                            <span className="text-[10px] font-bold text-amber-800 uppercase block">
                              Evening
                            </span>
                            <span className="text-stone-700">{day.evening}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inclusions & Tips */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                    <h4 className="font-bold text-stone-900">Package Inclusions:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-stone-600">
                      {generatedResult.inclusions.map((inc, i) => (
                        <li key={i}>✓ {inc}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Dispatch Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setGeneratedResult(null)}
                      className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Adjust Preferences
                    </button>
                    <button
                      type="button"
                      onClick={handleSendToSalesDesk}
                      className="flex-1 py-2.5 bg-[#0d4a44] hover:bg-[#16655e] text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>Send Proposal to Bali Sales Consultant</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
