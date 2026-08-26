import React, { useState } from "react";
import {
  Headphones,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Send,
  User,
  ShieldCheck,
} from "lucide-react";
import { useTravelStore } from "../../store/travelStore";
import { SupportTicket } from "../../types";

export const CustomerServiceDashboard: React.FC = () => {
  const {
    currentUser,
    supportTickets,
    updateTicketStatus,
  } = useTravelStore();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    supportTickets[0] || null
  );
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);

  const handleResolve = (ticketId: string) => {
    updateTicketStatus(ticketId, "resolved");
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: "resolved" });
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setReplySent(true);
    setTimeout(() => {
      setReplySent(false);
      setReplyText("");
      handleResolve(selectedTicket.id);
    }, 1500);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Headphones className="w-7 h-7 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-white">
                  24/7 Bali Customer Care & Reschedule Helpdesk
                </h1>
                <span className="bg-teal-400 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Live Support Agent
                </span>
              </div>
              <p className="text-xs text-teal-200 mt-0.5">
                Specialist: {currentUser.name} • PT. Bali Sundaram Travel
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Col: Tickets List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Support Inquiries ({supportTickets.length})
            </h3>

            <div className="space-y-3">
              {supportTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedTicket?.id === t.id
                      ? "bg-teal-50/80 border-teal-500 shadow-sm ring-2 ring-teal-500/20"
                      : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">{t.subject}</h4>
                      <p className="text-[11px] text-stone-500">{t.userName} • {t.userPhone}</p>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        t.status === "resolved"
                          ? "bg-stone-100 text-stone-700"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">{t.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Ticket Interaction & Response */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">{selectedTicket.subject}</h3>
                    <p className="text-xs text-stone-500">
                      From: {selectedTicket.userName} ({selectedTicket.userEmail}) • {selectedTicket.createdAt}
                    </p>
                  </div>
                  <button
                    onClick={() => handleResolve(selectedTicket.id)}
                    className="px-3 py-1 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Mark as Resolved
                  </button>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  {selectedTicket.message}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-stone-700">
                    Dispatch Resolution / WhatsApp Concierge Response
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official response or reschedule confirmation..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-teal-900 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Customer Resolution</span>
                    </button>
                  </div>

                  {replySent && (
                    <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold text-center">
                      ✓ Response dispatched and ticket resolved!
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-stone-400">
                Select a ticket to respond.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
