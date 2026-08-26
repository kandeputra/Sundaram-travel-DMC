import React, { useState } from "react";
import { X, Mail, Phone, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTravelStore } from "../store/travelStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, currentUser } = useTravelStore();
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "forgot") {
      setSuccessMessage(`Password reset instructions have been dispatched to ${email || phone}.`);
      setTimeout(() => {
        setSuccessMessage("");
        setTab("login");
      }, 2500);
      return;
    }

    const targetEmail = email || (phone ? `${phone.replace(/\D/g, "")}@sundaram.customer` : "guest.traveler@example.com");
    loginUser(targetEmail);
    setSuccessMessage(`Welcome back to SUNDARAM.TRAVEL!`);
    setTimeout(() => {
      setSuccessMessage("");
      onClose();
    }, 1200);
  };

  const handleGoogleLogin = () => {
    loginUser("sarah.jenkins@example.com");
    setSuccessMessage("Successfully authenticated with Google account!");
    setTimeout(() => {
      setSuccessMessage("");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-[#0d4a44] px-6 pt-6 pb-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-teal-200 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="font-serif font-black text-xl text-amber-300">SUNDARAM</span>
            <span className="text-xs font-bold text-amber-100 tracking-wider">.TRAVEL</span>
          </div>
          <p className="text-xs text-teal-100 mt-1">
            {tab === "login"
              ? "Sign in to manage your Bali bookings and reward points."
              : tab === "register"
              ? "Create your travel account and earn 500 Welcome Points."
              : "Reset your account access credentials."}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
              tab === "login" ? "text-[#0d4a44] border-b-2 border-[#0d4a44] bg-white" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
              tab === "register" ? "text-[#0d4a44] border-b-2 border-[#0d4a44] bg-white" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="py-8 text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-stone-900">{successMessage}</p>
              <p className="text-xs text-stone-500">Redirecting to your travel dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Google Social Login */}
              {tab !== "forgot" && (
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors text-xs font-semibold text-stone-700 cursor-pointer shadow-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-stone-400 font-medium">Or continue with</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle email or phone */}
              {tab !== "forgot" && (
                <div className="flex space-x-2 bg-stone-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAuthMethod("email")}
                    className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      authMethod === "email" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod("phone")}
                    className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      authMethod === "phone" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                    }`}
                  >
                    Phone / WhatsApp
                  </button>
                </div>
              )}

              {/* Name for registration */}
              {tab === "register" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              {/* Email or Phone Field */}
              {authMethod === "email" || tab === "forgot" ? (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number (with Country Code)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+62 812 3456 7890"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              {/* Password */}
              {tab !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">Password</label>
                    {tab === "login" && (
                      <button
                        type="button"
                        onClick={() => setTab("forgot")}
                        className="text-[11px] text-[#c85a32] hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0d4a44] focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0d4a44] hover:bg-[#16655e] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <span>
                  {tab === "login" ? "Sign In" : tab === "register" ? "Create Free Account" : "Send Reset Link"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {tab === "forgot" && (
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="w-full text-center text-xs text-stone-500 hover:text-stone-800 font-medium pt-1 cursor-pointer"
                >
                  Back to Sign In
                </button>
              )}
            </form>
          )}

          {/* Current user fast indicator */}
          <div className="mt-4 pt-4 border-t border-stone-100 text-center">
            <p className="text-[11px] text-stone-400">
              Current active persona: <strong className="text-stone-700">{currentUser.name}</strong> ({currentUser.role})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
