import { useState, useRef } from "react";
import {
  HiCube,
  HiEye,
  HiEyeOff,
  HiLockClosed,
  HiShieldCheck,
  HiUsers,
  HiArrowRight,
  HiCheckCircle,
  HiLightningBolt,
  HiTrendingUp,
  HiChartSquareBar,
  HiClock,
  HiChartBar,
  HiShoppingCart,
  HiClipboardList,
  HiSparkles,
  HiCloud,
  HiChip,
  HiPhone,
  HiMail,
  HiLocationMarker,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const demoAccounts = [
    { label: "Manager", email: "manager@ethara.io", password: "Manager123!" },
    { label: "Viewer", email: "viewer@ethara.io", password: "Viewer123!" },
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid credentials or server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation component for scroll-triggered animations
  const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50">
      {/* Floating background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-100/40 to-cyan-100/30 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-32 top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/30 to-indigo-100/40 blur-3xl"
        />
      </div>

      {/* SECTION 1: Hero + Login */}
      <section className="relative min-h-screen">
        <div className="relative grid min-h-screen lg:grid-cols-[55fr_45fr]">
          {/* Left Hero Content */}
          <div className="flex items-center justify-center px-6 py-16 lg:px-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-2xl"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8 flex items-center gap-3"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30">
                  <HiCube className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Ethara</h1>
                  <p className="text-sm text-blue-600">Inventory Management</p>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h2 className="mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 bg-clip-text text-4xl font-bold leading-tight text-transparent lg:text-5xl xl:text-6xl">
                  Modern Inventory Management Made Simple
                </h2>
                <p className="mb-10 text-lg leading-relaxed text-slate-600 lg:text-xl">
                  Real-time visibility, automated workflows, and intelligent insights for your warehouse operations.
                  Everything you need in one platform.
                </p>
              </motion.div>

              {/* KPI Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "10K+", label: "Products Managed", icon: HiCube, color: "from-blue-500 to-cyan-400" },
                  { value: "99.9%", label: "Uptime SLA", icon: HiCheckCircle, color: "from-emerald-500 to-teal-400" },
                  { value: "50ms", label: "Response Time", icon: HiLightningBolt, color: "from-purple-500 to-pink-400" },
                  { value: "500+", label: "Active Teams", icon: HiUsers, color: "from-orange-500 to-yellow-400" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${stat.color} p-2.5 shadow-sm`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Login Card */}
          <div className="flex items-center justify-center px-6 py-16 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-full max-w-md"
            >
              {/* Premium Glassmorphic Login Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
              >
                {/* Header */}
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30"
                  >
                    <HiLockClosed className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="mb-2 bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-3xl font-bold text-transparent">
                    Welcome Back
                  </h3>
                  <p className="text-slate-600">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="group relative">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="name@company.com"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="group relative">
                    <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Enter your password"
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                      </motion.button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                      />
                      <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </a>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-60"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <HiSparkles className="h-5 w-5" />
                          </motion.div>
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-6">
                  <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Quick Demo Access
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {demoAccounts.map((account, index) => (
                      <motion.button
                        key={account.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDemoLogin(account.email, account.password)}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-lg"
                      >
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-sm">
                          {account.label.charAt(0)}
                        </div>
                        <div className="text-xs font-medium text-slate-500 transition group-hover:text-blue-600">
                          {account.label}
                        </div>
                        <div className="mt-1 truncate text-xs text-slate-400">{account.email}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Register Link */}
                <p className="mt-6 text-center text-sm text-slate-600">
                  New to Ethara?{" "}
                  <Link to="/register" className="font-semibold text-blue-600 transition hover:text-blue-700">
                    Create an account
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Features */}
      <section className="relative bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
                Everything You Need to Manage Inventory
              </h2>
              <p className="text-lg text-slate-600">
                Powerful features to streamline your operations and boost productivity
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: HiChartSquareBar,
                title: "Smart Inventory Tracking",
                description: "Real-time stock updates, low-stock alerts, and product categorization",
                color: "from-blue-500 to-cyan-400",
              },
              {
                icon: HiShoppingCart,
                title: "Order Management",
                description: "Create orders, track shipments, and manage returns effortlessly",
                color: "from-purple-500 to-pink-400",
              },
              {
                icon: HiUsers,
                title: "Customer Management",
                description: "Customer profiles, purchase history, and detailed analytics",
                color: "from-emerald-500 to-teal-400",
              },
              {
                icon: HiChartBar,
                title: "Analytics Dashboard",
                description: "Revenue tracking, inventory forecasting, and performance reports",
                color: "from-orange-500 to-yellow-400",
              },
            ].map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
                >
                  <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Dashboard Showcase */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
                Powerful Dashboard Analytics
              </h2>
              <p className="text-lg text-slate-600">
                Make data-driven decisions with real-time insights
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Revenue Analytics Chart */}
                <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">Revenue Analytics</h4>
                      <p className="mt-1 text-2xl font-bold text-blue-600">$124,850</p>
                      <p className="text-xs text-slate-500">Last 7 days</p>
                    </div>
                    <HiTrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex h-40 items-end justify-between gap-2">
                    {[
                      { day: "Mon", value: 65, amount: "$15,200" },
                      { day: "Tue", value: 78, amount: "$18,400" },
                      { day: "Wed", value: 55, amount: "$12,800" },
                      { day: "Thu", value: 88, amount: "$21,200" },
                      { day: "Fri", value: 95, amount: "$23,500" },
                      { day: "Sat", value: 72, amount: "$17,200" },
                      { day: "Sun", value: 82, amount: "$16,550" },
                    ].map((bar, index) => (
                      <motion.div
                        key={bar.day}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${bar.value}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="group relative flex-1"
                      >
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-cyan-400 transition-all hover:from-blue-600 hover:to-cyan-500"
                          style={{ height: "100%" }}
                        >
                          {/* Tooltip on hover */}
                          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                            {bar.amount}
                          </div>
                        </div>
                        <p className="mt-2 text-center text-xs text-slate-600">{bar.day}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Inventory Status */}
                <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">Inventory Status</h4>
                      <p className="mt-1 text-2xl font-bold text-purple-600">8,547</p>
                      <p className="text-xs text-slate-500">Total products</p>
                    </div>
                    <HiCube className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="space-y-4">
                    {[
                      { category: "Electronics", count: 2847, percentage: 85, color: "from-blue-500 to-cyan-400" },
                      { category: "Clothing", count: 1925, percentage: 65, color: "from-purple-500 to-pink-400" },
                      { category: "Home & Garden", count: 1682, percentage: 72, color: "from-emerald-500 to-teal-400" },
                      { category: "Sports", count: 1093, percentage: 45, color: "from-orange-500 to-yellow-400" },
                      { category: "Books", count: 1000, percentage: 90, color: "from-indigo-500 to-blue-400" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.category}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{item.category}</span>
                          <span className="text-slate-500">{item.count} units</span>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-white/50">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.percentage}%` }}
                            transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                            className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="md:col-span-2">
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900">Recent Orders</h4>
                      <HiClipboardList className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          id: "#ORD-2847",
                          product: "Wireless Bluetooth Headphones",
                          customer: "John Anderson",
                          quantity: 2,
                          amount: "$189.99",
                          status: "Completed",
                          icon: "🎧",
                        },
                        {
                          id: "#ORD-2846",
                          product: "Smart Watch Series 5",
                          customer: "Emma Wilson",
                          quantity: 1,
                          amount: "$399.00",
                          status: "Processing",
                          icon: "⌚",
                        },
                        {
                          id: "#ORD-2845",
                          product: "Professional Camera Kit",
                          customer: "Michael Brown",
                          quantity: 1,
                          amount: "$1,249.99",
                          status: "Completed",
                          icon: "📷",
                        },
                        {
                          id: "#ORD-2844",
                          product: "Gaming Laptop Pro",
                          customer: "Sarah Davis",
                          quantity: 1,
                          amount: "$2,499.00",
                          status: "Shipped",
                          icon: "💻",
                        },
                      ].map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-4 rounded-lg bg-white/70 p-4 shadow-sm transition hover:bg-white hover:shadow-md"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl shadow-lg">
                            {order.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{order.product}</span>
                              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                                {order.id}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                              <span>{order.customer}</span>
                              <span>•</span>
                              <span>Qty: {order.quantity}</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-700">{order.amount}</span>
                            </div>
                          </div>
                          <div
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              order.status === "Completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "Processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {order.status}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 4: Why Choose Us */}
      <section className="relative bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
                Why Businesses Trust Ethara
              </h2>
              <p className="text-lg text-slate-600">
                Enterprise-grade features built for modern teams
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: HiCheckCircle, title: "99.9% Uptime", description: "Rock-solid reliability you can count on" },
              { icon: HiChartBar, title: "Real-Time Analytics", description: "Instant insights for faster decisions" },
              { icon: HiCloud, title: "Secure Cloud Storage", description: "Enterprise-grade security & backups" },
              { icon: HiChip, title: "AI-Powered Forecasting", description: "Predict demand with machine learning" },
              { icon: HiUsers, title: "Multi-User Access", description: "Collaborate with your entire team" },
              { icon: HiLightningBolt, title: "Lightning Fast", description: "Optimized performance at scale" },
            ].map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 p-3 shadow-lg">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Testimonials */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
                Loved by Teams Worldwide
              </h2>
              <p className="text-lg text-slate-600">
                See what our customers have to say
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote: "This platform reduced our inventory management time by 60%. Game-changing!",
                author: "Sarah Johnson",
                role: "Operations Manager",
                company: "TechCorp",
                avatar: "SJ",
              },
              {
                quote: "The real-time analytics have transformed how we make decisions. Highly recommended!",
                author: "Michael Chen",
                role: "Supply Chain Director",
                company: "RetailPro",
                avatar: "MC",
              },
              {
                quote: "Best inventory management solution we've used. The ROI was immediate.",
                author: "Emily Rodriguez",
                role: "Warehouse Manager",
                company: "LogisticsHub",
                avatar: "ER",
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={testimonial.author} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <HiSparkles key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-slate-700">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.author}</div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role} · {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Metrics */}
      <section className="relative bg-gradient-to-r from-blue-600 to-cyan-500 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "10,000+", label: "Products Managed" },
              { value: "500+", label: "Businesses" },
              { value: "99.9%", label: "Uptime" },
              { value: "1M+", label: "Orders Processed" },
            ].map((metric, index) => (
              <AnimatedSection key={metric.label} delay={index * 0.1}>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                    className="mb-2 text-5xl font-bold"
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-lg text-blue-100">{metric.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section className="relative bg-white py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-slate-600">
                Everything you need to know about Ethara
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {[
              {
                q: "How secure is the platform?",
                a: "We use enterprise-grade encryption, regular security audits, and comply with international data protection standards.",
              },
              {
                q: "Can I manage multiple warehouses?",
                a: "Yes! Ethara supports unlimited warehouses with location-based inventory tracking and management.",
              },
              {
                q: "Is there a mobile app?",
                a: "Our responsive web app works perfectly on mobile devices. Native apps are coming soon.",
              },
              {
                q: "How does inventory forecasting work?",
                a: "Our AI analyzes historical data, seasonal trends, and sales patterns to predict future inventory needs.",
              },
            ].map((faq, index) => (
              <AnimatedSection key={faq.q} delay={index * 0.05}>
                <details className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                    {faq.q}
                    <HiCheckCircle className="h-5 w-5 text-blue-600 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-slate-600">{faq.a}</p>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 to-cyan-500 py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <AnimatedSection>
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="mb-10 text-xl text-blue-100">
              Join thousands of businesses streamlining their operations with Ethara
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-xl transition hover:shadow-2xl"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-white px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Book Demo
              </motion.button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 9: Footer */}
      <footer className="relative border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                  <HiCube className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">Ethara</span>
              </div>
              <p className="text-sm text-slate-600">
                Modern inventory management for modern businesses.
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="mb-4 font-semibold text-slate-900">Features</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Inventory Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Order Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 font-semibold text-slate-900">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 font-semibold text-slate-900">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <HiMail className="h-4 w-4" />
                  contact@ethara.io
                </li>
                <li className="flex items-center gap-2">
                  <HiPhone className="h-4 w-4" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <HiLocationMarker className="h-4 w-4" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2024 Ethara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
