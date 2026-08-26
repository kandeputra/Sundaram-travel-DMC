import React from "react";
import { Home, Compass, Heart, Calendar, User, Sparkles } from "lucide-react";
import { useTravelStore } from "../store/travelStore";
import { getTranslation } from "../utils/i18n";

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedProductId,
    wishlistIds,
    bookings,
    language,
    currentUser,
  } = useTravelStore();

  const t = (key: any) => getTranslation(language, key);

  const items = [
    { id: "home", label: t("home"), icon: Home },
    { id: "explore", label: t("explore"), icon: Compass },
    { id: "wishlist", label: t("wishlist"), icon: Heart, badge: wishlistIds.length },
    { id: "bookings", label: t("myBookings"), icon: Calendar, badge: bookings.length },
    { id: "dashboard", label: t("account"), icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#044D29]/10 px-2 py-1.5 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedProductId(null);
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative ${
                isActive ? "text-[#044D29] font-bold" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#E26D5C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
