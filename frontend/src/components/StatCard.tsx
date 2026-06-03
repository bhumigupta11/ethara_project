import { motion } from "framer-motion";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import { ReactNode } from "react";

const StatCard = ({
  value,
  label,
  description,
  icon,
  trend,
  delay = 0,
}: {
  value: string | number;
  label: string;
  description?: string;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all hover:border-blue-300 hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="rounded-xl bg-slate-50 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-50">
            {icon}
          </div>
          {trend && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                trend.isPositive
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {trend.isPositive ? (
                <HiArrowUp className="h-3 w-3" />
              ) : (
                <HiArrowDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="mt-4"
        >
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-700">
            {label}
          </p>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </motion.div>

        {trend && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: delay + 0.4, duration: 0.6 }}
            className={`mt-4 h-1 rounded-full ${
              trend.isPositive
                ? "bg-gradient-to-r from-emerald-500 to-emerald-200"
                : "bg-gradient-to-r from-red-500 to-red-200"
            }`}
          />
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
