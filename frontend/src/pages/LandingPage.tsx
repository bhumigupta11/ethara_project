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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),_transparent_30%),bg-slate-950] text-slate-100">
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
                className="inline-flex rounded-full bg-violet-500/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-violet-200 cursor-pointer"
              >
                Inventory built for modern teams
              </motion.span>
              <motion.h1
                variants={itemVariants}
                className="text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              >
                Ethara delivers intelligent stock and order control at startup speed.
              </motion.h1>
              <motion.p variants={itemVariants} className="max-w-xl text-slate-400">
                Build stronger supply chains with real-time product visibility, customer workflows, and beautiful analytics powered by React, FastAPI, and Tailwind.
              </motion.p>
            </div>
            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] transition hover:bg-violet-400 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                >
                  Get started free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-violet-400 hover:bg-slate-900"
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
            className="group rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-glow backdrop-blur-xl transition-all hover:shadow-[0_0_60px_rgba(139,92,246,0.3)]"
          >
            <div className="mb-6 rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Live demo ready</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">Try manager and viewer access instantly.</h2>
              <p className="mt-3 text-slate-400">Sample credentials are seeded automatically so you can explore product, customer and order workflows straight away.</p>
            </div>
            <div className="grid gap-4">
              <motion.div
                whileHover={{ scale: 1.03, x: 5 }}
                className="group/card cursor-pointer rounded-3xl bg-slate-950/75 p-5 transition-all hover:bg-slate-900/90 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xl font-bold text-white shadow-lg">
                    M
                  </div>
                  <div className="flex-1">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Manager Demo</p>
                    <p className="mt-1 text-lg font-semibold text-white">manager@ethara.io</p>
                  </div>
                </div>
                <div className="mt-3 rounded-xl bg-slate-950/80 px-3 py-2">
                  <p className="text-sm text-slate-400">Password: <span className="font-mono text-slate-300">Manager123!</span></p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, x: 5 }}
                className="group/card cursor-pointer rounded-3xl bg-slate-950/75 p-5 transition-all hover:bg-slate-900/90 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xl font-bold text-white shadow-lg">
                    V
                  </div>
                  <div className="flex-1">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Viewer Demo</p>
                    <p className="mt-1 text-lg font-semibold text-white">viewer@ethara.io</p>
                  </div>
                </div>
                <div className="mt-3 rounded-xl bg-slate-950/80 px-3 py-2">
                  <p className="text-sm text-slate-400">Password: <span className="font-mono text-slate-300">Viewer123!</span></p>
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
              className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow transition-all hover:border-violet-400/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]"
            >
              <div className="relative">
                <p className="text-sm uppercase tracking-[0.35em] text-violet-300">{stat.label}</p>
                <h3 className="mt-4 text-3xl font-semibold text-white transition group-hover:text-violet-200">{stat.title}</h3>
                <p className="mt-3 text-slate-400">{stat.desc}</p>
                <div className="absolute -right-2 -top-2 h-20 w-20 rounded-full bg-violet-500/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
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
              className="text-sm uppercase tracking-[0.35em] text-violet-300"
            >
              Everything you need
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-4 text-4xl font-semibold text-white"
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
                    <div className="flex items-start gap-3 text-slate-300">
                      <div className="rounded-xl bg-violet-500/10 p-3">
                        <Icon className="h-6 w-6 text-violet-300" />
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
