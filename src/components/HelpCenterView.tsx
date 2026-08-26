import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTravelStore } from "../store/travelStore";

export const HelpCenterView: React.FC = () => {
  const { faqs, addSupportTicket, currentUser } = useTravelStore();

  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Ticket Form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("booking_change");
  const [ticketSent, setTicketSent] = useState(false);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    addSupportTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      subject,
      message,
      category: category as any,
      priority: "medium",
    });

    setTicketSent(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setTicketSent(false), 3000);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="bg-teal-50 text-[#0d4a44] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            24/7 Bali Concierge Support Desk
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900">
            How can PT. Bali Sundaram Travel assist you?
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Find answers to booking changes, weather policies, airport pickup instructions, or open a live support ticket.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative pt-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics (e.g. refund, rain, driver, QRIS)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-full shadow-xs focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-emerald-600 text-white rounded-3xl shadow-sm hover:bg-emerald-500 transition-all text-center space-y-2 cursor-pointer"
          >
            <MessageSquare className="w-6 h-6 mx-auto" />
            <h3 className="font-bold text-sm">24/7 WhatsApp Concierge</h3>
            <p className="text-xs text-emerald-100">+62 812-3456-7890 (Instant reply)</p>
          </a>

          <a
            href="mailto:support@sundaram.travel"
            className="p-5 bg-white border border-stone-200 rounded-3xl shadow-xs hover:border-stone-300 transition-all text-center space-y-2 cursor-pointer"
          >
            <Mail className="w-6 h-6 mx-auto text-[#0d4a44]" />
            <h3 className="font-bold text-sm text-stone-900">Email Operations</h3>
            <p className="text-xs text-stone-500">support@sundaram.travel</p>
          </a>

          <div className="p-5 bg-white border border-stone-200 rounded-3xl shadow-xs text-center space-y-2">
            <ShieldCheck className="w-6 h-6 mx-auto text-[#c85a32]" />
            <h3 className="font-bold text-sm text-stone-900">Bali HQ Office</h3>
            <p className="text-xs text-stone-500">Bypass Ngurah Rai No. 88, Sanur</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#0d4a44]" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.id}
                  className="border border-stone-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-between hover:bg-stone-50 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed bg-stone-50/50 border-t border-stone-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Ticket Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-stone-900">
            Submit a Support Request Ticket
          </h2>
          <p className="text-xs text-stone-500">
            Our Denpasar customer service team typically responds within 15 minutes during operating hours.
          </p>

          {ticketSent ? (
            <div className="p-6 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm">Ticket Successfully Dispatched!</h3>
              <p className="text-xs text-emerald-700">
                Ticket reference created. Check your Customer Dashboard or email for updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Inquiry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                  >
                    <option value="booking_change">Booking Reschedule / Date Change</option>
                    <option value="refund">Refund or Cancellation Request</option>
                    <option value="driver_location">Driver / Vehicle Arrival Status</option>
                    <option value="custom_quote">Custom Group / Corporate Inquiry</option>
                    <option value="other">General Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Subject Headline</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Reschedule Ubud tour to 29 August"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide your booking reference number and details..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0d4a44] hover:bg-[#16655e] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
