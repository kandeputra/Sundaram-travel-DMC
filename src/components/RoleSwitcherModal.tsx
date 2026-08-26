import React from "react";
import { X, ShieldCheck, UserCheck, CheckCircle2, Building2, UserPlus, Car, DollarSign, Headphones, Edit3, ShieldAlert, Zap } from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { UserRole } from "../types";

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole, setActiveTab } = useTravelStore();

  if (!isOpen) return null;

  const roles: {
    role: UserRole;
    title: string;
    description: string;
    icon: any;
    color: string;
    demoName: string;
    badge: string;
  }[] = [
    {
      role: "customer",
      title: "1. Customer",
      description: "Discover experiences, book packages, pay in 8 currencies, download QR vouchers, view Sundaram Rewards.",
      icon: UserCheck,
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      demoName: "Sarah Jenkins (Australia)",
      badge: "Voyager Tier (1,250 pts)",
    },
    {
      role: "supplier",
      title: "2. Supplier / Travel Partner",
      description: "Manage products & package options, daily capacity manifests, voucher scanning, and payout requests.",
      icon: Building2,
      color: "bg-blue-50 text-blue-800 border-blue-200",
      demoName: "I Ketut Suweta (PT. Bali Sundaram Tours & Fleet)",
      badge: "Verified Local Operator",
    },
    {
      role: "sales_agent",
      title: "3. Sales Agent",
      description: "Handle custom Bali trip inquiries, build manual quotations, apply markups, send WhatsApp proposals.",
      icon: UserPlus,
      color: "bg-amber-50 text-amber-800 border-amber-200",
      demoName: "Kadek Mahadewi (Senior Travel Consultant)",
      badge: "Sales Team",
    },
    {
      role: "operations",
      title: "4. Operations Team",
      description: "Daily airport arrival/departure schedule, vehicle and driver assignments, guide rosters, on-ground status.",
      icon: Car,
      color: "bg-teal-50 text-teal-800 border-teal-200",
      demoName: "Made Wardana (Fleet & Dispatch Manager)",
      badge: "Bali Ops Hub",
    },
    {
      role: "finance",
      title: "5. Finance Team",
      description: "Reconcile payments (Midtrans, Stripe, Xendit), process refunds, review supplier commission payouts, update exchange rates.",
      icon: DollarSign,
      color: "bg-indigo-50 text-indigo-800 border-indigo-200",
      demoName: "Nyoman Suryani (Head of Accounts)",
      badge: "Financial Control",
    },
    {
      role: "customer_service",
      title: "6. Customer Service",
      description: "24/7 ticket support desk, booking reschedule requests, live chat assistance, emergency WhatsApp logs.",
      icon: Headphones,
      color: "bg-rose-50 text-rose-800 border-rose-200",
      demoName: "Putu Arianti (Customer Care Specialist)",
      badge: "24/7 Concierge",
    },
    {
      role: "content_editor",
      title: "7. Content Editor",
      description: "Manage Bali travel guides, destination articles, SEO metadata, FAQs, and homepage promotional banners.",
      icon: Edit3,
      color: "bg-cyan-50 text-cyan-800 border-cyan-200",
      demoName: "Bagus Pratama (Content & Media Lead)",
      badge: "Editorial Desk",
    },
    {
      role: "admin",
      title: "8. Administrator",
      description: "Full marketplace business overview, product approvals, discount & promo controls, user records.",
      icon: ShieldCheck,
      color: "bg-orange-50 text-orange-800 border-orange-200",
      demoName: "I Wayan Sundaram (Managing Director)",
      badge: "Executive Admin",
    },
    {
      role: "super_admin",
      title: "9. Super Administrator",
      description: "System master control: audit logs, role permissions, database schema migrations, and security settings.",
      icon: ShieldAlert,
      color: "bg-purple-50 text-purple-800 border-purple-200",
      demoName: "PT. Bali Sundaram Super Administrator",
      badge: "Root Control",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0d4a44] text-white flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">Role-Based Access Simulation</h3>
              <p className="text-xs text-stone-500">Switch persona to test specialized dashboards & workflows</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: List of 9 Roles */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {roles.map((item) => {
            const Icon = item.icon;
            const isCurrent = currentUser.role === item.role;
            return (
              <div
                key={item.role}
                onClick={() => {
                  switchRole(item.role);
                  onClose();
                  if (item.role !== "customer") {
                    setActiveTab("dashboard");
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                  isCurrent
                    ? "border-[#0d4a44] bg-teal-50/70 ring-2 ring-[#0d4a44]/20 shadow-xs"
                    : "border-stone-200 hover:border-stone-400 hover:bg-stone-50/80"
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${item.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {item.badge}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="flex items-center space-x-1 text-xs font-bold text-[#0d4a44]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-[11px] text-stone-500 font-medium mt-1">
                    👤 Logged in as: <span className="text-stone-800 font-semibold">{item.demoName}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Active Role: <strong className="text-stone-800 capitalize">{currentUser.role.replace("_", " ")}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0d4a44] text-white font-semibold rounded-lg hover:bg-[#16655e] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
