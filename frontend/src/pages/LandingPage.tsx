import { HiChartBar, HiCube, HiUsers, HiShoppingBag, HiSparkles, HiShieldCheck } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Card";

const features = [
  {
    title: "Smart Inventory",
    description: "Track every SKU in real time and know which items need restocking before they run out.",
    icon: HiCube,
  },
  {
    title: "Order Workflow",
    description: "Create, track and fulfill orders with stock-aware visibility and customer history.",
    icon: HiShoppingBag,
  },
  {
    title: "Customer CRM",
    description: "Manage customer relationships and sales activity from one beautiful dashboard.",
    icon: HiUsers,
  },
  {
    title: "Analytics & Insights",
    description: "Revenue trends, stock alerts and performance metrics all on one screen.",
    icon: HiChartBar,
  },
  {
    title: "Warehouse Visibility",
    description: "See inventory health and low-stock alerts for faster operational decisions.",
    icon: HiSparkles,
  },
  {
    title: "Role-based Access",
    description: "Demo accounts let you explore manager and viewer experiences instantly.",
    icon: HiShieldCheck,
  },
];

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
        >
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="max-w-2xl space-y-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs uppercase tracking-[0.35em] text-blue-700 cursor-pointer font-semibold"
              >
                Inventory built for modern teams
              </motion.span>
              <motion.h1
                variants={itemVariants}
                className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
              >
                Ethara delivers intelligent stock and order control at startup speed.
              </motion.h1>
              <motion.p variants={itemVariants} className="max-w-xl text-slate-600">
                Build stronger supply chains with real-time product visibility, customer workflows, and beautiful analytics powered by React, FastAPI, and Tailwind.
              </motion.p>
            </div>
            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] transition hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)]"
                >
                  Get started free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-400 hover:bg-blue-50"
                >
                  Sign in instead
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]"
          >
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-6">
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-600">Live demo ready</p>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">Try manager and viewer access instantly.</h2>
              <p className="mt-3 text-slate-600">Sample credentials are seeded automatically so you can explore product, customer and order workflows straight away.</p>
            </div>
            <div className="grid gap-4">
              <motion.div
                whileHover={{ scale: 1.03, x: 5 }}
                className="group/card cursor-pointer rounded-xl bg-slate-50 border border-slate-200 p-5 transition-all hover:bg-blue-50 hover:border-blue-200 hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-xl font-bold text-white shadow-lg">
                    M
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider font-semibold text-blue-600">Manager Demo</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">manager@ethara.io</p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-white px-3 py-2 border border-slate-200">
                  <p className="text-sm text-slate-600">Password: <span className="font-mono text-slate-800 font-semibold">Manager123!</span></p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, x: 5 }}
                className="group/card cursor-pointer rounded-xl bg-slate-50 border border-slate-200 p-5 transition-all hover:bg-cyan-50 hover:border-cyan-200 hover:shadow-[0_4px_12px_rgba(6,182,212,0.1)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-400 text-xl font-bold text-white shadow-lg">
                    V
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider font-semibold text-cyan-600">Viewer Demo</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">viewer@ethara.io</p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-white px-3 py-2 border border-slate-200">
                  <p className="text-sm text-slate-600">Password: <span className="font-mono text-slate-800 font-semibold">Viewer123!</span></p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 grid gap-6 lg:grid-cols-3"
        >
          {[
            { label: "10K+", title: "Products managed", desc: "Organize inventory with fast search, categories, and live stock status." },
            { label: "99.9%", title: "Performance SLA", desc: "Built for responsive dashboards and quick order processing across teams." },
            { label: "5 min", title: "Setup time", desc: "Deploy locally and explore seeded business data with a single command." },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-[0_4px_15px_rgba(15,23,42,0.05)] transition-all hover:border-blue-300 hover:shadow-[0_12px_25px_rgba(37,99,235,0.1)]"
            >
              <div className="relative">
                <p className="text-xs uppercase tracking-wider font-semibold text-blue-600">{stat.label}</p>
                <h3 className="mt-4 text-3xl font-bold text-slate-900 transition group-hover:text-blue-700">{stat.title}</h3>
                <p className="mt-3 text-slate-600">{stat.desc}</p>
                <div className="absolute -right-2 -top-2 h-20 w-20 rounded-full bg-blue-200/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="mb-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-xs uppercase tracking-wider font-semibold text-blue-600"
            >
              Everything you need
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-4 text-4xl font-bold text-slate-900"
            >
              Built for teams who want better inventory control.
            </motion.h2>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.08 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                >
                  <Card title={feature.title} subtitle={feature.description}>
                    <div className="flex items-start gap-3 text-slate-600">
                      <div className="rounded-lg bg-blue-100 p-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="mt-3">{feature.description}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
