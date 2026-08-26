import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  X,
  Printer,
  Share2,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Download,
  CheckCircle2,
  Car,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Booking } from "../types";
import { useTravelStore } from "../store/travelStore";
import { formatCurrency } from "../utils/currency";

interface VoucherModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ booking, isOpen, onClose }) => {
  const { currency, exchangeRates } = useTravelStore();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (booking) {
      QRCode.toDataURL(
        JSON.stringify({
          ref: booking.bookingReference,
          product: booking.productTitle,
          date: booking.travelDate,
          lead: booking.leadGuestName,
          pax: booking.adultCount + booking.childCount,
          status: booking.status,
        }),
        {
          width: 256,
          margin: 1.5,
          color: {
            dark: "#0d4a44",
            light: "#ffffff",
          },
        }
      )
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Code generation error", err));
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello PT. Bali Sundaram Travel, here is my booking voucher:\nReference: ${booking.bookingReference}\nActivity: ${booking.productTitle}\nDate: ${booking.travelDate}\nLead: ${booking.leadGuestName}`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Actions Bar (Hidden when printing) */}
        <div className="no-print bg-[#0d4a44] px-6 py-3 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-xs">Official Electronic Travel Voucher</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Share</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-teal-200 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Voucher Body */}
        <div id="printable-voucher" className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white flex-1">
          {/* Header of Voucher */}
          <div className="flex items-start justify-between border-b-2 border-dashed border-stone-200 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-xl text-[#0d4a44]">SUNDARAM</span>
                <span className="text-xs font-extrabold text-[#c85a32]">.TRAVEL</span>
              </div>
              <p className="text-[11px] font-bold text-stone-700">PT. Bali Sundaram Travel</p>
              <p className="text-[10px] text-stone-500">
                Licensed Bali DMC: 551.2/184/DIPARDA • Denpasar, Bali
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                ✓ {booking.status}
              </span>
              <p className="text-[11px] font-mono font-bold text-stone-800 mt-1.5">
                Ref: <span className="text-[#0d4a44]">{booking.bookingReference}</span>
              </p>
            </div>
          </div>

          {/* QR Code & Main Trip Summary Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-stone-50 p-5 rounded-2xl border border-stone-200">
            {/* Scannable QR Code */}
            <div className="bg-white p-2.5 rounded-xl border border-stone-300 shadow-xs shrink-0 text-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Voucher QR Code" className="w-36 h-36 mx-auto" />
              ) : (
                <div className="w-36 h-36 bg-stone-100 animate-pulse rounded-lg" />
              )}
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1 block">
                Scan for Staff Check-in
              </span>
            </div>

            {/* Core Details */}
            <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
              <span className="text-[11px] font-bold text-[#0d4a44] uppercase tracking-wider">
                Experience Voucher
              </span>
              <h2 className="font-serif font-bold text-base text-stone-900 leading-snug">
                {booking.productTitle}
              </h2>
              <p className="text-xs text-stone-600 font-medium">
                Tier: <strong className="text-stone-900">{booking.packageName}</strong>
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center space-x-1.5 text-stone-700">
                  <Calendar className="w-3.5 h-3.5 text-[#0d4a44]" />
                  <span>{booking.travelDate}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-[#0d4a44]" />
                  <span>{booking.timeSlot}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-stone-700 col-span-2">
                  <User className="w-3.5 h-3.5 text-[#0d4a44]" />
                  <span>
                    Party: <strong>{booking.adultCount} Adult{booking.adultCount > 1 ? "s" : ""}</strong>
                    {booking.childCount > 0 ? `, ${booking.childCount} Child` : ""}
                    {booking.infantCount > 0 ? `, ${booking.infantCount} Infant` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guest & Logistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Lead Guest */}
            <div className="p-4 rounded-xl border border-stone-200 space-y-1 bg-stone-50/50">
              <p className="text-[10px] font-bold text-stone-400 uppercase">Primary Traveler</p>
              <p className="font-bold text-stone-900 text-sm">{booking.leadGuestName}</p>
              <p className="text-stone-600">{booking.leadGuestEmail}</p>
              <p className="text-stone-600 font-mono">{booking.leadGuestPhone}</p>
            </div>

            {/* Pickup & Vehicle Logistics */}
            <div className="p-4 rounded-xl border border-stone-200 space-y-1 bg-stone-50/50">
              <p className="text-[10px] font-bold text-stone-400 uppercase">Bali Hotel Pickup</p>
              <p className="font-bold text-stone-900">{booking.pickupLocation || "Self Arrival at Meeting Point"}</p>
              <p className="text-stone-600">
                Driver assigned: <strong className="text-stone-800">{booking.driverAssigned || "I Wayan Darma (+62 812-9988-7711)"}</strong>
              </p>
              <p className="text-[11px] text-teal-800 font-medium">Vehicle: Toyota Innova Reborn (DK 1945 BS)</p>
            </div>
          </div>

          {/* Important On-Ground Instructions */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-xs text-amber-950">
            <p className="font-bold flex items-center space-x-1 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Important Traveler Instructions:</span>
            </p>
            <ul className="space-y-1 text-[11px] pl-4 list-disc text-amber-900">
              <li>Please be ready in the hotel lobby 10 minutes prior to your scheduled pickup time ({booking.timeSlot}).</li>
              <li>Present this electronic QR voucher directly on your mobile device (no paper printout required).</li>
              <li>Temples in Bali require sarongs and shoulder coverings (provided during the tour).</li>
              <li>Bring sunscreen, waterproof camera/phone case, and comfortable walking shoes.</li>
            </ul>
          </div>

          {/* Emergency 24/7 Bali Concierge */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-200 text-xs gap-2">
            <div className="flex items-center space-x-2 text-[#0d4a44]">
              <Phone className="w-4 h-4 text-teal-600" />
              <div>
                <p className="font-bold">24/7 Bali Operations Emergency Desk</p>
                <p className="text-[11px] text-stone-600">WhatsApp / Call: +62 812-3456-7890</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-stone-400 uppercase font-bold">Total Paid Amount</p>
              <p className="font-serif font-black text-sm text-[#0d4a44]">
                {formatCurrency(booking.totalPriceIdr, currency, exchangeRates)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="no-print bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>SUNDARAM.TRAVEL • A trusted Bali Experience Marketplace</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0d4a44] text-white font-semibold rounded-lg hover:bg-[#16655e] cursor-pointer"
          >
            Close Voucher
          </button>
        </div>
      </div>
    </div>
  );
};
