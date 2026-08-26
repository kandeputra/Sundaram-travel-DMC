import React, { useState } from "react";
import {
  Building2,
  Calendar,
  DollarSign,
  QrCode,
  CheckCircle2,
  Users,
  Plus,
  Edit,
  TrendingUp,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useTravelStore } from "../../store/travelStore";
import { formatCurrency } from "../../utils/currency";
import { Product } from "../../types";

export const SupplierDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    bookings,
    currency,
    exchangeRates,
    setIsQRScannerOpen,
  } = useTravelStore();

  const [activeTab, setActiveTab] = useState<"manifest" | "products" | "payouts">("manifest");
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Filter products for this supplier
  const supplierProducts = products.filter((p) => p.supplierId === currentUser.supplierId || true);

  // Today's Manifest Bookings
  const todayBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "paid");

  // Calculate earnings (85% supplier share, 15% platform commission)
  const totalGrossRevenue = bookings.reduce((sum, b) => sum + b.totalPriceIdr, 0);
  const supplierNetPayout = totalGrossRevenue * 0.85;

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 3000);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Building2 className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-white">
                  PT. Bali Sundaram Tours & Fleet Hub
                </h1>
                <span className="bg-blue-400 text-blue-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Verified DMC Partner
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Managed by {currentUser.name} • Supplier ID: {currentUser.supplierId || "SUP-BALI-01"}
              </p>
            </div>
          </div>

          {/* QR Scanner Trigger */}
          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs rounded-2xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Passenger QR Scanner</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Today's Manifest Passengers
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif font-black text-2xl text-stone-900">
                {todayBookings.reduce((sum, b) => sum + b.adultCount + b.childCount, 0)} Pax
              </span>
              <span className="text-xs text-emerald-700 font-semibold">
                ({todayBookings.length} Bookings)
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Available Net Payout Balance
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif font-black text-2xl text-[#0d4a44]">
                {formatCurrency(supplierNetPayout, currency, exchangeRates)}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Supplier Quality Score
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif font-black text-2xl text-amber-600">
                ★ 4.96 / 5.0
              </span>
              <span className="text-xs text-stone-500 font-medium">(2,450+ Reviews)</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-2 border-b border-stone-200 bg-white p-1.5 rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveTab("manifest")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "manifest"
                ? "bg-blue-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Today's Tour Manifest ({todayBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-blue-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Manage Product Catalog ({supplierProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("payouts")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "payouts"
                ? "bg-blue-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            BCA Bank Payouts & Settlements
          </button>
        </div>

        {/* Tab 1: Manifest Table */}
        {activeTab === "manifest" && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Guest Arrivals & Activity Dispatch Manifest
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time list of travelers scheduled for today's tours
                </p>
              </div>
              <button
                onClick={() => setIsQRScannerOpen(true)}
                className="px-3.5 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Guest Voucher</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Ref & Guest</th>
                    <th className="pb-3">Tour / Package</th>
                    <th className="pb-3">Party Size</th>
                    <th className="pb-3">Pickup Location</th>
                    <th className="pb-3">Time Slot</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {todayBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="py-3">
                        <span className="font-mono font-bold text-blue-900 block">
                          {b.bookingReference}
                        </span>
                        <span className="font-semibold text-stone-800">{b.leadGuestName}</span>
                        <span className="text-[11px] text-stone-400 block">{b.leadGuestPhone}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-stone-900 block">{b.productTitle}</span>
                        <span className="text-stone-500 text-[11px]">{b.packageName}</span>
                      </td>
                      <td className="py-3 font-semibold text-stone-800">
                        {b.adultCount} Adults {b.childCount ? `, ${b.childCount} Kids` : ""}
                      </td>
                      <td className="py-3 text-stone-600 max-w-[180px] truncate">
                        {b.pickupLocation}
                      </td>
                      <td className="py-3 font-bold text-stone-800">{b.timeSlot}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            b.status === "completed"
                              ? "bg-stone-100 text-stone-700"
                              : "bg-emerald-100 text-emerald-900"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalog */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Your Published Experience Offerings
              </h3>
              <button className="px-3.5 py-1.5 bg-[#0d4a44] text-white text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Submit New Bali Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supplierProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex space-x-4 items-center"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-[#0d4a44] bg-teal-50 px-2 py-0.5 rounded">
                      {p.destinationName}
                    </span>
                    <h4 className="font-bold text-xs text-stone-900 truncate">{p.title}</h4>
                    <p className="text-[11px] text-stone-500">
                      Rate: <strong className="text-stone-800">{formatCurrency(p.startingPriceIdr, currency, exchangeRates)}</strong>
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] text-stone-400">
                      <span>★ {p.rating} ({p.reviewCount})</span>
                      <span>•</span>
                      <span>{p.bookingCount} bookings</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Payouts */}
        {activeTab === "payouts" && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Supplier Payout Reconciliation (Bank Central Asia)
            </h3>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Registered Beneficiary Bank:</span>
                <strong className="text-stone-900">Bank Central Asia (BCA) - Kuta Branch</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Account Number:</span>
                <strong className="text-stone-900 font-mono">7720-9988-1122</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Account Holder:</span>
                <strong className="text-stone-900">PT. BALI SUNDARAM TOURS & FLEET</strong>
              </div>
            </div>

            {payoutRequested ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold text-center">
                ✓ Payout settlement of {formatCurrency(supplierNetPayout, currency, exchangeRates)} requested. PT. Bali Sundaram Finance will disburse via BI-FAST within 24h.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestPayout}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Request Immediate Bank Transfer Settlement
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
