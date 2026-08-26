import React, { useState } from "react";
import { TravelStoreProvider, useTravelStore } from "./store/travelStore";
import { Header } from "./components/Header";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { Footer } from "./components/Footer";
import { HomeView } from "./components/HomeView";
import { ExploreView } from "./components/ExploreView";
import { ProductDetailView } from "./components/ProductDetailView";
import { BookingFlow } from "./components/BookingFlow";
import { TravelGuidesView } from "./components/TravelGuidesView";
import { HelpCenterView } from "./components/HelpCenterView";
import { ProductCompareModal } from "./components/ProductCompareModal";

// Modals
import { RoleSwitcherModal } from "./components/RoleSwitcherModal";
import { AuthModal } from "./components/AuthModal";
import { PlanMyTripModal } from "./components/PlanMyTripModal";
import { VoucherModal } from "./components/VoucherModal";
import { QRScannerModal } from "./components/QRScannerModal";

// Role-based Dashboards
import { CustomerDashboard } from "./components/dashboards/CustomerDashboard";
import { SupplierDashboard } from "./components/dashboards/SupplierDashboard";
import { OperationsDashboard } from "./components/dashboards/OperationsDashboard";
import { SalesAgentDashboard } from "./components/dashboards/SalesAgentDashboard";
import { FinanceDashboard } from "./components/dashboards/FinanceDashboard";
import { CustomerServiceDashboard } from "./components/dashboards/CustomerServiceDashboard";
import { ContentEditorDashboard } from "./components/dashboards/ContentEditorDashboard";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";

import { Booking } from "./types";

const AppContent: React.FC = () => {
  const {
    currentUser,
    activeTab,
    selectedProductId,
    bookings,
    setIsAuthModalOpen,
    setIsRoleSwitcherOpen,
  } = useTravelStore();

  const [activeVoucherBooking, setActiveVoucherBooking] = useState<Booking | null>(null);

  const handleOpenVoucher = (booking: Booking) => {
    setActiveVoucherBooking(booking);
  };

  const handleBookingComplete = (bookingId: string) => {
    const createdBooking = bookings.find((b) => b.id === bookingId);
    if (createdBooking) {
      setActiveVoucherBooking(createdBooking);
    }
  };

  // Render the appropriate role dashboard
  const renderDashboard = () => {
    switch (currentUser.role) {
      case "customer":
        return <CustomerDashboard onOpenVoucher={handleOpenVoucher} />;
      case "supplier":
        return <SupplierDashboard />;
      case "operations":
        return <OperationsDashboard />;
      case "sales_agent":
        return <SalesAgentDashboard />;
      case "finance":
        return <FinanceDashboard />;
      case "customer_service":
        return <CustomerServiceDashboard />;
      case "content_editor":
        return <ContentEditorDashboard />;
      case "admin":
      case "super_admin":
        return <AdminDashboard />;
      default:
        return <CustomerDashboard onOpenVoucher={handleOpenVoucher} />;
    }
  };

  // Main Tab Router
  const renderMainContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeView />;
      case "explore":
        return <ExploreView />;
      case "product_detail":
        return selectedProductId ? (
          <ProductDetailView />
        ) : (
          <ExploreView />
        );
      case "booking":
        return selectedProductId ? (
          <BookingFlow onBookingComplete={handleBookingComplete} />
        ) : (
          <ExploreView />
        );
      case "guides":
        return <TravelGuidesView />;
      case "help":
        return <HelpCenterView />;
      case "dashboard":
        return renderDashboard();
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1A1A] font-sans selection:bg-[#F2C94C]/40 selection:text-[#044D29]">
      {/* Top Fixed Header */}
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {renderMainContent()}
      </main>

      {/* Global Comparison Tray */}
      <ProductCompareModal />

      {/* Footer */}
      <Footer />

      {/* Mobile Navigation Bar */}
      <MobileBottomNav />

      {/* Global Modals */}
      <RoleSwitcherModal />
      <AuthModal />
      <PlanMyTripModal />
      <VoucherModal
        booking={activeVoucherBooking}
        onClose={() => setActiveVoucherBooking(null)}
      />
      <QRScannerModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TravelStoreProvider>
      <AppContent />
    </TravelStoreProvider>
  );
};

export default App;
