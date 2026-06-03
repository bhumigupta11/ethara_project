import { NavLink } from "react-router-dom";
import { HiChartSquareBar, HiCube, HiUsers, HiShoppingBag, HiClipboardList, HiCog } from "react-icons/hi";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: HiChartSquareBar },
  { label: "Products", path: "/products", icon: HiCube },
  { label: "Customers", path: "/customers", icon: HiUsers },
  { label: "Orders", path: "/orders", icon: HiShoppingBag },
  { label: "Inventory", path: "/inventory", icon: HiClipboardList },
  { label: "Settings", path: "/settings", icon: HiCog },
];

const Sidebar = () => {
  return (
    <div className="flex h-full flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div>
        <div className="mb-6 flex items-center gap-3 lg:block">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-lg font-bold text-white shadow-lg shadow-blue-500/30 lg:mb-4"
          >
            E
          </motion.div>
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-slate-400">Ethara</div>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">StockFlow</h1>
          </div>
        </div>
        <nav className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:block lg:space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-3 py-3 text-xs font-medium transition-all lg:min-h-0 lg:flex-row lg:justify-start lg:gap-3 lg:text-sm ${
                    isActive 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-600"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 lg:block">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">System Status</div>
        <p className="mt-3 text-sm leading-6 text-slate-600">Products, customers, orders, and stock rules are connected to the live API.</p>
      </div>
    </div>
  );
};

export default Sidebar;
