import React, { useState } from "react";
import {
  DollarSign,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useTravelStore } from "../../store/travelStore";
import { formatCurrency, CURRENCY_NAMES } from "../../utils/currency";
import { CurrencyCode } from "../../types";

export const FinanceDashboard: React.FC = () => {
  const {
    currentUser,
    bookings,
    currency,
    exchangeRates,
    updateExchangeRate,
    processRefund,
  } = useTravelStore();

  const [activeTab, setActiveTab] = useState<"reconciliation" | "refunds" | "currencies">("reconciliation");

  // Currency exchange rates editing state
  const [editingRates, setEditingRates] = useState({ ...exchangeRates });
  const [rateSaved, setRateSaved] = useState(false);

  const totalGrossRevenueIdr = bookings.reduce((sum, b) => sum + b.totalPriceIdr, 0);
  const totalCompletedIdr = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalPriceIdr, 0);

  const pendingRefunds = bookings.filter(
    (b) => b.refundReason && b.status !== "refunded"
  );

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(editingRates).forEach(([curr, rate]) => {
      updateExchangeRate(curr as CurrencyCode, rate);
    });
    setRateSaved(true);
    setTimeout(() => setRateSaved(false), 2500);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <DollarSign className="w-7 h-7 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-white">
                  Financial Treasury & Multi-Gateway Reconciliation
                </h1>
                <span className="bg-indigo-400 text-indigo-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Head of Accounts
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Officer: {currentUser.name} • PT. Bali Sundaram Travel
              </p>
            </div>
          </div>
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Total Gross Marketplace Volume
            </span>
            <span className="font-serif font-black text-2xl text-stone-900">
              {formatCurrency(totalGrossRevenueIdr, currency, exchangeRates)}
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Platform Commission (15%)
            </span>
            <span className="font-serif font-black text-2xl text-emerald-700">
              {formatCurrency(totalGrossRevenueIdr * 0.15, currency, exchangeRates)}
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Pending Refund Requests
            </span>
            <span className="font-serif font-black text-2xl text-rose-600">
              {pendingRefunds.length} Queued
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-stone-200 bg-white p-1.5 rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveTab("reconciliation")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "reconciliation"
                ? "bg-indigo-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Payment Transactions ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("refunds")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "refunds"
                ? "bg-indigo-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Refund Approvals ({pendingRefunds.length})
          </button>
          <button
            onClick={() => setActiveTab("currencies")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "currencies"
                ? "bg-indigo-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Forex & Exchange Rates (8 Currencies)
          </button>
        </div>

        {/* Tab 1: Reconciliation Table */}
        {activeTab === "reconciliation" && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Gateway Transactions Audit Log (Midtrans / Xendit / Stripe / QRIS)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Ref & Date</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Gateway</th>
                    <th className="pb-3">Gross (IDR)</th>
                    <th className="pb-3">Platform Net (15%)</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="py-3 font-mono font-bold text-stone-900">
                        {b.bookingReference}
                        <span className="block text-[10px] text-stone-400 font-normal">{b.travelDate}</span>
                      </td>
                      <td className="py-3 font-semibold text-stone-800">{b.leadGuestName}</td>
                      <td className="py-3 uppercase font-bold text-indigo-700">{b.paymentMethod || "QRIS"}</td>
                      <td className="py-3 font-mono font-bold text-stone-900">
                        {formatCurrency(b.totalPriceIdr, "IDR", exchangeRates)}
                      </td>
                      <td className="py-3 font-mono font-bold text-emerald-700">
                        {formatCurrency(b.totalPriceIdr * 0.15, "IDR", exchangeRates)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            b.status === "refunded"
                              ? "bg-rose-100 text-rose-800"
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

        {/* Tab 2: Refund Approvals */}
        {activeTab === "refunds" && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Customer Cancellation & Refund Processing Desk
            </h3>

            {pendingRefunds.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">No pending refund requests.</p>
            ) : (
              <div className="space-y-3">
                {pendingRefunds.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-stone-900">{b.bookingReference}</span>
                      <p className="font-bold text-stone-800">{b.leadGuestName} • {b.productTitle}</p>
                      <p className="text-rose-700">Reason: {b.refundReason}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-serif font-bold text-sm text-stone-900">
                        {formatCurrency(b.totalPriceIdr, currency, exchangeRates)}
                      </span>
                      <button
                        onClick={() => processRefund(b.id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
                      >
                        Execute 100% Refund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Currency Rates Override */}
        {activeTab === "currencies" && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Foreign Exchange Rate Overrides (Base: IDR)
            </h3>

            <form onSubmit={handleSaveRates} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                {Object.entries(editingRates).map(([code, rate]) => (
                  <div key={code} className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <label className="block font-bold text-stone-700 mb-1 uppercase">
                      {code} ({CURRENCY_NAMES[code as CurrencyCode]})
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={rate}
                      onChange={(e) =>
                        setEditingRates({
                          ...editingRates,
                          [code]: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-xs text-stone-500">
                  Updates propagate instantly across all product cards and checkout forms.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 cursor-pointer"
                >
                  Save & Propagate Rates
                </button>
              </div>

              {rateSaved && (
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold text-center">
                  ✓ Exchange rates successfully updated across marketplace!
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
