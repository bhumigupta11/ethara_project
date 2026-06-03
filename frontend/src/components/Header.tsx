import { useAuth } from "../context/AuthContext";
import { HiSearch, HiBell, HiChevronDown } from "react-icons/hi";
import { motion } from "framer-motion";
import { useState } from "react";

const Header = () => {
  const { email, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get initials from email
  const getInitials = (email: string) => {
    return email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="sticky top-4 z-40 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">Operations Workspace</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard Overview</h2>
        <p className="mt-2 text-sm text-slate-600">Real-time insights into your inventory operations</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-blue-300 md:flex">
          <HiSearch className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-32 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none lg:w-48"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:bg-slate-50"
        >
          <HiBell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600" />
        </motion.button>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            onClick={() => setShowDropdown(!showDropdown)}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 pr-3 shadow-sm transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/30">
              {getInitials(email || "")}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs text-slate-500">Signed in</div>
              <div className="max-w-32 truncate text-sm font-medium text-slate-900">{email || "User"}</div>
            </div>
            <HiChevronDown className="h-4 w-4 text-slate-400" />
          </motion.button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
            >
              <button
                onClick={logout}
                className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
