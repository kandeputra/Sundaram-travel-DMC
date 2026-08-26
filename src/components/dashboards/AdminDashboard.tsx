import React, { useState } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Tag,
  Plus,
  CheckCircle2,
  Activity,
  Lock,
} from "lucide-react";
import { useTravelStore } from "../../store/travelStore";
import { formatCurrency } from "../../utils/currency";

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    products,
    bookings,
    promoCodes,
    auditLogs,
    currency,
    exchangeRates,
    createPromoCode,
  } = useTravelStore();

  const [activeTab, setActiveTab] = useState<"overview" | "promos" | "audit">("overview");

  // Promo Code Form
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minSpend, setMinSpend] = useState(500000);
  const [description, setDescription] = useState("");
  const [promoCreated, setPromoCreated] = useState(false);

  const totalGrossRevenueIdr = bookings.reduce((sum, b) => sum + b.totalPriceIdr, 0);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    createPromoCode({
      code: promoCode.toUpperCase(),
      discountPercent,
      minSpendIdr: minSpend,
      description,
      validUntil: "2026-12-31",
      usageLimit: 500,
    });

    setPromoCreated(true);
    setTimeout(() => {
      setPromoCreated(false);
      setIsAddPromoOpen(false);
      setPromoCode("");
      setDescription("");
    }, 1500);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#0d4a44] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-white">
                  PT. Bali Sundaram Travel Master Executive Suite
                </h1>
                <span className="bg-amber-400 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  {currentUser.role === "super_admin" ? "Super Admin" : "Executive Admin"}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Director: {currentUser.name} • License No. 551.2/184/DIPARDA
              </p>
            </div>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Marketplace Gross Volume
            </span>
            <span className="font-serif font-black text-2xl text-stone-900">
              {formatCurrency(totalGrossRevenueIdr, currency, exchangeRates)}
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Total Confirmed Bookings
            </span>
            <span className="font-serif font-black text-2xl text-[#0d4a44]">
              {bookings.length} Bookings
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Active Bali Experiences
            </span>
            <span className="font-serif font-black text-2xl text-blue-900">
              {products.length} Activities
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Platform Take Rate (15%)
            </span>
            <span className="font-serif font-black text-2xl text-emerald-700">
              {formatCurrency(totalGrossRevenueIdr * 0.15, currency, exchangeRates)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-stone-200 bg-white p-1.5 rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Live Bookings Overview ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("promos")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "promos"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Promo Codes Engine ({promoCodes.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Security & Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* Tab 1: Bookings */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              All Marketplace Customer Reservations
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Ref & Guest</th>
                    <th className="pb-3">Activity</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Gross Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="py-3">
                        <span className="font-mono font-bold text-stone-900 block">{b.bookingReference}</span>
                        <span className="text-stone-600">{b.leadGuestName}</span>
                      </td>
                      <td className="py-3 font-semibold text-stone-800">{b.productTitle}</td>
                      <td className="py-3 text-stone-600">{b.travelDate} ({b.timeSlot})</td>
                      <td className="py-3 font-mono font-bold text-stone-900">
                        {formatCurrency(b.totalPriceIdr, currency, exchangeRates)}
                      </td>
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

        {/* Tab 2: Promo Codes */}
        {activeTab === "promos" && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900">Active Discount Promo Codes</h3>
              <button
                onClick={() => setIsAddPromoOpen(true)}
                className="px-3.5 py-1.5 bg-[#0d4a44] text-white text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {promoCodes.map((p) => (
                <div key={p.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-[#0d4a44] bg-teal-50 px-2.5 py-1 rounded">
                      {p.code}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {p.discountPercent ? `${p.discountPercent}% OFF` : `Rp ${p.discountAmountIdr}`}
                    </span>
                  </div>
                  <p className="text-stone-600">{p.description}</p>
                  <p className="text-[10px] text-stone-400">
                    Min Spend: {formatCurrency(p.minSpendIdr || 0, currency, exchangeRates)} • Used: {p.usedCount} times
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Security & Audit Trail */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Immutable System Audit Trail & Security Logs</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">User & Role</th>
                    <th className="pb-3">Action Type</th>
                    <th className="pb-3">Details / Target</th>
                    <th className="pb-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50 font-mono text-[11px]">
                      <td className="py-2.5 text-stone-400">{log.timestamp}</td>
                      <td className="py-2.5 font-bold text-stone-800">{log.userName}</td>
                      <td className="py-2.5 text-[#0d4a44] font-semibold uppercase">{log.action}</td>
                      <td className="py-2.5 text-stone-600">{log.details}</td>
                      <td className="py-2.5 text-stone-400">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Promo Modal */}
      {isAddPromoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">Create New Promo Campaign</h3>

            {promoCreated ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold text-center">
                ✓ Promo code activated!
              </div>
            ) : (
              <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Promo Code (Uppercase)</label>
                  <input
                    type="text"
                    required
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="e.g. BALISUMMER15"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono uppercase font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Discount %</label>
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Min Spend (IDR)</label>
                    <input
                      type="number"
                      value={minSpend}
                      onChange={(e) => setMinSpend(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Campaign Description</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. 10% off for Bali summer arrivals"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPromoOpen(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0d4a44] text-white font-bold rounded-xl"
                  >
                    Activate Code
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
