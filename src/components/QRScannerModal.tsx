import React, { useState } from "react";
import { X, QrCode, CheckCircle2, AlertTriangle, Search, User, Calendar, ShieldCheck, Zap } from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { Booking } from "../types";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { bookings, redeemBookingVoucher, currentUser } = useTravelStore();

  const [inputRef, setInputRef] = useState("");
  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleLookup = (refToFind: string) => {
    setErrorMessage("");
    setRedeemSuccess(false);
    const cleaned = refToFind.trim().toUpperCase();
    const found = bookings.find(
      (b) => b.bookingReference.toUpperCase() === cleaned || b.id === cleaned
    );

    if (found) {
      setMatchedBooking(found);
    } else {
      setMatchedBooking(null);
      setErrorMessage(`No active booking found for reference "${cleaned}". Please check digits.`);
    }
  };

  const handleQuickDemoScan = (booking: Booking) => {
    setInputRef(booking.bookingReference);
    handleLookup(booking.bookingReference);
  };

  const handleRedeemConfirm = () => {
    if (!matchedBooking) return;

    if (matchedBooking.status === "completed") {
      setErrorMessage("⚠️ Warning: This voucher has already been redeemed earlier!");
      return;
    }

    const success = redeemBookingVoucher(matchedBooking.bookingReference, currentUser.name);
    if (success) {
      setRedeemSuccess(true);
      // refresh matched
      const updated = bookings.find((b) => b.id === matchedBooking.id);
      if (updated) setMatchedBooking(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="bg-[#0d4a44] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif font-bold text-base">On-Ground Staff Voucher Scanner</h3>
              <p className="text-[11px] text-teal-200">PT. Bali Sundaram Travel Partner Terminal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-teal-200 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Simulated Camera Viewfinder */}
          <div className="relative aspect-[16/10] bg-stone-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 border border-stone-800">
            <div className="w-44 h-44 border-2 border-dashed border-emerald-400 rounded-xl relative flex items-center justify-center animate-pulse">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-bounce" />
              <QrCode className="w-20 h-20 text-stone-600" />
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-medium">
              Align guest digital voucher QR code within scanner frame
            </p>
          </div>

          {/* Quick Demo Test Buttons */}
          <div>
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Quick Test Recent Traveler Vouchers:
            </p>
            <div className="flex flex-wrap gap-2">
              {bookings.slice(0, 3).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleQuickDemoScan(b)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-stone-100 hover:bg-teal-50 hover:text-[#0d4a44] border border-stone-200 transition-colors cursor-pointer"
                >
                  {b.bookingReference} ({b.leadGuestName.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup(inputRef);
            }}
            className="flex space-x-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputRef}
                onChange={(e) => setInputRef(e.target.value)}
                placeholder="Enter Booking Reference (e.g. BST-260826-A8F4)"
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0d4a44] text-white text-xs font-bold rounded-xl hover:bg-[#16655e] cursor-pointer"
            >
              Verify
            </button>
          </form>

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold border border-rose-200 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Matched Voucher Card */}
          {matchedBooking && (
            <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-3 animate-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#0d4a44] uppercase tracking-wider block">
                    Voucher Verified
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-900 leading-tight">
                    {matchedBooking.productTitle}
                  </h4>
                  <p className="text-xs text-stone-600">Option: {matchedBooking.packageName}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                    matchedBooking.status === "completed"
                      ? "bg-stone-200 text-stone-700"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  }`}
                >
                  {matchedBooking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 pt-2 border-t border-teal-200/60">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Lead Guest:</span>
                  <span className="font-bold text-stone-900">{matchedBooking.leadGuestName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Party Size:</span>
                  <span className="font-bold text-stone-900">
                    {matchedBooking.adultCount} Adults, {matchedBooking.childCount} Kids
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Travel Date:</span>
                  <span>{matchedBooking.travelDate} ({matchedBooking.timeSlot})</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Hotel Pickup:</span>
                  <span className="truncate block">{matchedBooking.pickupLocation}</span>
                </div>
              </div>

              {redeemSuccess ? (
                <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Voucher Successfully Redeemed & Logged!</span>
                </div>
              ) : matchedBooking.status === "completed" ? (
                <div className="p-2.5 bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold text-center">
                  This voucher was already checked-in and completed.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRedeemConfirm}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Confirm Guest Party Check-in</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Logged in as: <strong className="text-stone-800">{currentUser.name}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
