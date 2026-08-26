import React, { useState } from "react";
import {
  Calendar,
  Heart,
  Award,
  QrCode,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  User,
  Star,
} from "lucide-react";
import { useTravelStore } from "../../store/travelStore";
import { formatCurrency } from "../../utils/currency";
import { Booking } from "../../types";

interface CustomerDashboardProps {
  onOpenVoucher: (booking: Booking) => void;
  onOpenReviewModal?: (booking: Booking) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onOpenVoucher }) => {
  const {
    currentUser,
    bookings,
    wishlistIds,
    products,
    currency,
    exchangeRates,
    requestRefund,
    setSelectedProductId,
    setActiveTab,
  } = useTravelStore();

  const [activeTab, setActiveTabLocal] = useState<"bookings" | "wishlist" | "rewards" | "refunds">("bookings");
  const [refundReason, setRefundReason] = useState("");
  const [selectedBookingForRefund, setSelectedBookingForRefund] = useState<Booking | null>(null);
  const [refundSubmitted, setRefundSubmitted] = useState(false);

  const myBookings = bookings.filter(
    (b) => b.userId === currentUser.id || b.leadGuestEmail === currentUser.email || true
  );

  const myWishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForRefund) return;

    requestRefund(selectedBookingForRefund.id, refundReason || "Customer travel plan change");
    setRefundSubmitted(true);
    setTimeout(() => {
      setRefundSubmitted(false);
      setSelectedBookingForRefund(null);
      setRefundReason("");
    }, 2000);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-[#0d4a44] to-[#16655e] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-2xl">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-white">{currentUser.name}</h1>
                <span className="bg-amber-400 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  {currentUser.membershipTier || "Explorer"} Member
                </span>
              </div>
              <p className="text-xs text-teal-100 mt-0.5">{currentUser.email} • {currentUser.phone}</p>
            </div>
          </div>

          {/* Reward Points Box */}
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center space-x-4">
            <Award className="w-8 h-8 text-amber-300 shrink-0" />
            <div>
              <span className="text-[10px] text-teal-100 uppercase tracking-wider block font-semibold">
                Sundaram Reward Balance
              </span>
              <span className="font-serif font-black text-xl text-amber-300">
                {currentUser.rewardPoints || 0} Points
              </span>
              <span className="text-[10px] text-teal-200 block">
                ≈ {formatCurrency((currentUser.rewardPoints || 0) * 100, currency, exchangeRates)} value
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex space-x-2 border-b border-stone-200 bg-white p-1.5 rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveTabLocal("bookings")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === "bookings"
                ? "bg-[#0d4a44] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings ({myBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTabLocal("wishlist")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === "wishlist"
                ? "bg-[#0d4a44] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({myWishlistProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTabLocal("rewards")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === "rewards"
                ? "bg-[#0d4a44] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Rewards Tier</span>
          </button>
        </div>

        {/* Tab 1: Bookings List */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-bold text-stone-800">No active bookings yet</h3>
                <p className="text-xs text-stone-500">Discover handpicked Bali tours and save your dates.</p>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="px-4 py-2 bg-[#0d4a44] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Explore Experiences
                </button>
              </div>
            ) : (
              myBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#0d4a44] bg-teal-50 px-2.5 py-0.5 rounded-md">
                        {b.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          b.status === "completed"
                            ? "bg-stone-100 text-stone-700"
                            : b.status === "refunded"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                      {b.productTitle}
                    </h3>

                    <p className="text-xs text-stone-500">
                      Option: <strong className="text-stone-700">{b.packageName}</strong> • Travel Date:{" "}
                      <strong className="text-stone-700">{b.travelDate}</strong> ({b.timeSlot})
                    </p>

                    <p className="text-xs text-stone-500">
                      Party: {b.adultCount} Adults, {b.childCount} Children • Pickup: {b.pickupLocation}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 font-bold block uppercase">Paid Amount</span>
                      <span className="font-serif font-black text-base text-[#0d4a44]">
                        {formatCurrency(b.totalPriceIdr, currency, exchangeRates)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onOpenVoucher(b)}
                        className="px-3.5 py-1.5 bg-[#0d4a44] hover:bg-[#16655e] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View QR Voucher</span>
                      </button>

                      {b.status !== "refunded" && (
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForRefund(b)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs cursor-pointer"
                          title="Request Cancellation / Refund"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist Grid */}
        {activeTab === "wishlist" && (
          <div>
            {myWishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
                <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-bold text-stone-800">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500">Click the heart icon on any Bali experience to save for later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myWishlistProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setActiveTab("product_detail");
                    }}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#0d4a44] bg-teal-50 px-2 py-0.5 rounded">
                        {prod.destinationName}
                      </span>
                      <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{prod.title}</h4>
                      <p className="font-serif font-bold text-sm text-[#0d4a44]">
                        {formatCurrency(prod.startingPriceIdr, currency, exchangeRates)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Rewards Details */}
        {activeTab === "rewards" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Sundaram Rewards Tier Privileges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-600 block">Tier 1: Explorer</span>
                <p className="text-stone-500">Earn 5% cashback in points on every booked tour. Free digital itineraries.</p>
              </div>
              <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/60 space-y-2">
                <span className="font-bold text-amber-900 block">Tier 2: Voyager (Your Active Tier)</span>
                <p className="text-stone-700">Earn 8% cashback points, priority 24/7 WhatsApp concierge, free cold towels in vehicles.</p>
              </div>
              <div className="p-4 rounded-2xl border border-stone-200 space-y-2">
                <span className="font-bold text-[#0d4a44] block">Tier 3: Island VIP</span>
                <p className="text-stone-500">Earn 12% cashback, complimentary airport fast-track lounge pass, dedicated senior guide.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation & Refund Modal */}
      {selectedBookingForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Request Free Cancellation / Refund
            </h3>
            <p className="text-xs text-stone-600">
              Booking: <strong className="text-stone-900">{selectedBookingForRefund.bookingReference}</strong> (
              {selectedBookingForRefund.productTitle})
            </p>

            {refundSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold text-center">
                Refund request successfully submitted. PT. Bali Sundaram Finance will process in 24h.
              </div>
            ) : (
              <form onSubmit={handleRefundSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Reason for Cancellation</label>
                  <textarea
                    rows={3}
                    required
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="e.g. Flight schedule change / unwell / weather..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForRefund(null)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl"
                  >
                    Confirm Refund Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
