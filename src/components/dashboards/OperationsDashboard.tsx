import React, { useState } from "react";
import {
  Car,
  Plane,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useTravelStore } from "../../store/travelStore";

export const OperationsDashboard: React.FC = () => {
  const {
    currentUser,
    bookings,
    updateBookingDriver,
    setIsQRScannerOpen,
  } = useTravelStore();

  const [selectedDriver, setSelectedDriver] = useState<string>("I Wayan Darma (+62 812-9988-7711)");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("Toyota Innova Reborn (DK 1945 BS)");
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  const driversList = [
    { name: "I Wayan Darma", phone: "+62 812-9988-7711", vehicle: "Toyota Innova Reborn (DK 1945 BS)" },
    { name: "Made Suardika", phone: "+62 813-7766-5544", vehicle: "Toyota HiAce Commuter 14-Pax (DK 2024 ST)" },
    { name: "Ketut Agus Widana", phone: "+62 819-3322-1100", vehicle: "Hyundai Staria Luxury VIP (DK 7777 AB)" },
    { name: "Putu Gede Wirata", phone: "+62 812-5544-3322", vehicle: "Toyota Fortuner 4x4 (DK 8888 BS)" },
  ];

  const handleAssign = (bookingId: string) => {
    updateBookingDriver(bookingId, selectedDriver);
    setActiveBookingId(null);
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-[#0d4a44] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Car className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-white">
                  Bali On-Ground Operations & Fleet Dispatch
                </h1>
                <span className="bg-emerald-400 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Live Dispatch Control
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Officer in charge: {currentUser.name} • PT. Bali Sundaram Transport Division
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsQRScannerOpen(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs rounded-2xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Traveler Voucher</span>
          </button>
        </div>

        {/* Fleet Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {driversList.map((d, idx) => (
            <div key={idx} className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">{d.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#0d4a44] font-semibold">{d.vehicle}</p>
              <p className="text-[10px] text-stone-400 font-mono">{d.phone}</p>
            </div>
          ))}
        </div>

        {/* Active Dispatch Board */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Today's Vehicle & Driver Dispatch Roster
              </h3>
              <p className="text-xs text-stone-500">
                Assign chauffeurs, monitor hotel pickups, and coordinate DPS airport arrivals
              </p>
            </div>
            <span className="text-xs font-bold text-[#0d4a44] bg-teal-50 px-3 py-1 rounded-full">
              {bookings.length} Operations Queued
            </span>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-[#0d4a44] bg-white px-2 py-0.5 rounded border border-stone-200">
                      {b.bookingReference}
                    </span>
                    <span className="font-bold text-xs text-stone-900">{b.leadGuestName}</span>
                    <span className="text-stone-400 text-xs font-mono">({b.leadGuestPhone})</span>
                  </div>
                  <p className="text-xs text-stone-700 font-medium">
                    Activity: <strong>{b.productTitle}</strong> ({b.packageName})
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{b.travelDate} at {b.timeSlot}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#c85a32]" />
                      <span className="truncate max-w-[200px]">{b.pickupLocation}</span>
                    </span>
                    <span className="flex items-center space-x-1 font-bold text-emerald-800">
                      <Car className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Driver: {b.driverAssigned || "Unassigned"}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  <button
                    onClick={() => setActiveBookingId(b.id)}
                    className="px-3.5 py-1.5 bg-[#0d4a44] text-white text-xs font-bold rounded-xl hover:bg-[#16655e] cursor-pointer"
                  >
                    Assign Driver / Fleet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Driver Assignment Modal */}
      {activeBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Assign Chauffeur & Vehicle
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Local Chauffeur</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                >
                  {driversList.map((d, i) => (
                    <option key={i} value={`${d.name} (${d.phone})`}>
                      {d.name} • {d.vehicle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveBookingId(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAssign(activeBookingId)}
                  className="px-4 py-2 bg-[#0d4a44] text-white font-bold rounded-xl"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
