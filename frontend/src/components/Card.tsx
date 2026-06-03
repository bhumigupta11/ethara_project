import { motion } from "framer-motion";
import { ReactNode } from "react";

const Card = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)] sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 transition group-hover:text-blue-700">{title}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        </div>
      </div>
      <div>{children}</div>
    </motion.div>
  );
};

export default Card;
