import React, { useState } from "react";
import {
  UserPlus,
  Send,
  MessageSquare,
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Car,
  FileText,
} from "lucide-react";
import { useTravelStore } from "../../store/travelStore";
import { formatCurrency } from "../../utils/currency";
import { TripInquiry } from "../../types";

export const SalesAgentDashboard: React.FC = () => {
  const {
    currentUser,
    tripInquiries,
    currency,
    exchangeRates,
  } = useTravelStore();

  const [selectedInquiry, setSelectedInquiry] = useState<TripInquiry | null>(
    tripInquiries[0] || null
  );

  const [markupPercent, setMarkupPercent] = useState(15);
  const [customPriceAdjustment, setCustomPriceAdjustment] = useState(0);
  const [proposalSent, setProposalSent] = useState(false);

  const handleSendWhatsAppProposal = (inquiry: TripInquiry) => {
    const baseCost = inquiry.generatedItinerary?.estimatedCostPerPersonIdr || 4500000;
    const finalPricePerPax = baseCost * (1 + markupPercent / 100) + customPriceAdjustment;
    const text = encodeURIComponent(
      `Om Swastyastu ${inquiry.customerName}, this is Kadek Mahadewi from PT. Bali Sundaram Travel!\n\nHere is your custom ${inquiry.durationDays}-Day ${inquiry.travelStyle} Bali Itinerary proposal for ${inquiry.paxCount} travelers:\n\n✨ Total Quotation: ${formatCurrency(
        finalPricePerPax * inquiry.paxCount,
        currency,
        exchangeRates
      )} (All inclusive of private transport, licensed guide, entrance tickets, and taxes).\n\nLet me know if you would like to adjust any temple visits or beach club stops!`
    );

    window.open(`https://wa.me/${inquiry.customerPhone.replace(/\D/g, "")}?text=${text}`, "_blank");
    setProposalSent(true);
    setTimeout(() => setProposalSent(false), 3000);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <UserPlus className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-white">
                  Custom Travel Consultant & Quotation Desk
                </h1>
                <span className="bg-amber-400 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Senior Sales Agent
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-0.5">
                Consultant: {currentUser.name} • PT. Bali Sundaram Travel Sales Division
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Col: Inquiries List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Inbound Travel Inquiries ({tripInquiries.length})
            </h3>

            <div className="space-y-3">
              {tripInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedInquiry?.id === inq.id
                      ? "bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-500/20"
                      : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">{inq.customerName}</h4>
                      <p className="text-[11px] text-stone-500">{inq.customerEmail} • {inq.customerPhone}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full">
                      {inq.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-stone-600">
                    <span>📅 {inq.durationDays} Days</span>
                    <span>•</span>
                    <span>👥 {inq.paxCount} Pax</span>
                    <span>•</span>
                    <span>✨ {inq.travelStyle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Interactive Quotation Builder */}
          <div className="lg:col-span-7">
            {selectedInquiry ? (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Proposal & Quotation Builder
                    </h3>
                    <p className="text-xs text-stone-500">
                      Inquiry Ref: {selectedInquiry.id} • Lead: {selectedInquiry.customerName}
                    </p>
                  </div>
                </div>

                {/* Generated Itinerary Summary */}
                {selectedInquiry.generatedItinerary && (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {selectedInquiry.generatedItinerary.tripTitle}
                    </h4>
                    <p className="text-stone-600">
                      {selectedInquiry.generatedItinerary.summary}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-1 text-[11px]">
                      {selectedInquiry.preferredRegions.map((reg, i) => (
                        <span key={i} className="bg-teal-50 text-[#0d4a44] px-2 py-0.5 rounded font-medium">
                          📍 {reg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing & Markup Controls */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    Pricing Adjustment & Commission Markup
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Agent Commission Markup ({markupPercent}%)
                      </label>
                      <input
                        type="range"
                        min={5}
                        max={30}
                        step={1}
                        value={markupPercent}
                        onChange={(e) => setMarkupPercent(Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Custom Discount / Add-on (IDR)
                      </label>
                      <input
                        type="number"
                        value={customPriceAdjustment}
                        onChange={(e) => setCustomPriceAdjustment(Number(e.target.value))}
                        step={50000}
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Grand Quote Calculation */}
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-900 uppercase block">
                        Final Client Package Quotation ({selectedInquiry.paxCount} Travelers)
                      </span>
                      <span className="font-serif font-black text-xl text-amber-950">
                        {formatCurrency(
                          ((selectedInquiry.generatedItinerary?.estimatedCostPerPersonIdr || 4500000) *
                            (1 + markupPercent / 100) +
                            customPriceAdjustment) *
                            selectedInquiry.paxCount,
                          currency,
                          exchangeRates
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSendWhatsAppProposal(selectedInquiry)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send WhatsApp Proposal</span>
                    </button>
                  </div>

                  {proposalSent && (
                    <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold text-center">
                      ✓ Proposal dispatched to client WhatsApp!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-stone-400">
                Select an inquiry from the left to build a quotation.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
