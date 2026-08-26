import React from "react";
import {
  Compass,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Heart,
  Globe,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { useTravelStore } from "../store/travelStore";

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedDestinationId } = useTravelStore();

  return (
    <footer className="bg-[#033c20] text-stone-300 pt-16 pb-24 md:pb-12 border-t border-[#044D29]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#044D29] border border-[#F2C94C]/30 flex items-center justify-center text-[#F2C94C] font-serif font-black text-xl shadow-xs">
                S
              </div>
              <div className="leading-tight">
                <span className="font-bold tracking-tight text-xl text-white block">
                  SUNDARAM<span className="text-[#E26D5C]">.TRAVEL</span>
                </span>
                <span className="text-[10px] text-emerald-200 font-sans tracking-wider uppercase block">
                  PT. Bali Sundaram Travel • DMC
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300/80 leading-relaxed max-w-sm">
              Bali's premier licensed Destination Management Company and curated experience marketplace. Connecting travelers directly to verified local Balinese drivers, temple guides, and certified marine operators.
            </p>

            <div className="space-y-1.5 text-[11px] text-stone-300/90">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F2C94C] shrink-0" />
                <span>Govt Tourism License: <strong>No. 551.2/184/DIPARDA</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-[#F2C94C] shrink-0" />
                <span>ASITA Certified Member: <strong>0420/XVII/DPP/2012</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2: Top Destinations */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Bali Destinations
            </h4>
            <ul className="space-y-2 text-xs text-stone-300/80">
              <li>
                <button
                  onClick={() => {
                    setSelectedDestinationId("dest-1");
                    setActiveTab("explore");
                  }}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Ubud Culture & Waterfalls
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDestinationId("dest-3");
                    setActiveTab("explore");
                  }}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Nusa Penida & Lembongan
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDestinationId("dest-4");
                    setActiveTab("explore");
                  }}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Uluwatu Clifftops & Beaches
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDestinationId("dest-2");
                    setActiveTab("explore");
                  }}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Seminyak & Canggu
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDestinationId("dest-5");
                    setActiveTab("explore");
                  }}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Mount Batur & Kintamani
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Experiences & Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Experiences
            </h4>
            <ul className="space-y-2 text-xs text-stone-300/80">
              <li>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Volcano Sunrise Treks
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Fast Boat to Gili & Penida
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Private Car & Chauffeur Hire
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  DPS Airport VIP Fast-Track
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="hover:text-[#F2C94C] transition-colors cursor-pointer"
                >
                  Traditional Balinese Spa & Healing
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              24/7 Concierge
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300/80">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-[#F2C94C] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+62 812-3456-7890 (WhatsApp)</span>
              </a>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-emerald-300" />
                <span>concierge@sundaram.travel</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#E26D5C] shrink-0 mt-0.5" />
                <span>Jl. Bypass Ngurah Rai No. 88, Sanur, Denpasar Selatan, Bali 80228</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Security Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-[#F2C94C]" />
            <span>Secure 256-Bit SSL Checkout • Midtrans, Xendit, Stripe, QRIS, BCA, Visa, Mastercard</span>
          </div>

          <div className="text-center md:text-right text-[11px] text-stone-400">
            © {new Date().getFullYear()} PT. Bali Sundaram Travel. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

