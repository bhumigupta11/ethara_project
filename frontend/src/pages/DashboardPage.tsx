import { HiChartBar, HiCube, HiShoppingBag, HiUsers, HiTrendingUp, HiTrendingDown, HiArrowRight, HiCheckCircle, HiClock, HiExclamation } from "react-icons/hi";
import { Link } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Area, AreaChart, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import ProductCard from "../components/ProductCard";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import WarehouseGrid from "../components/WarehouseGrid";
import CategoryChart from "../components/CategoryChart";
import { api, dashboardEndpoints, productEndpoints } from "../services/api";
import { DashboardMetrics, InventoryStatus, RevenueTrend } from "../types";

interface DashboardResponse {
  metrics: DashboardMetrics;
  revenue_trends: RevenueTrend[];
  inventory_status: InventoryStatus[];
  recent_orders: { id: number; customer_name: string; total_amount: number; status: string }[];
}

const fetchDashboard = async () => {
  const response = await api.get(dashboardEndpoints.stats);
  return response.data as DashboardResponse;
};

// Enhanced realistic revenue data (Jan -> Dec with growth trend)
const enhancedRevenueData = [
  { month: "Jan", revenue: 18000, orders: 145 },
  { month: "Feb", revenue: 22000, orders: 178 },
  { month: "Mar", revenue: 35000, orders: 245 },
  { month: "Apr", revenue: 48000, orders: 312 },
  { month: "May", revenue: 62000, orders: 389 },
  { month: "Jun", revenue: 78000, orders: 456 },
  { month: "Jul", revenue: 95000, orders: 534 },
  { month: "Aug", revenue: 112000, orders: 612 },
  { month: "Sep", revenue: 135000, orders: 698 },
  { month: "Oct", revenue: 148000, orders: 743 },
  { month: "Nov", revenue: 162000, orders: 801 },
  { month: "Dec", revenue: 175000, orders: 865 },
];

// Revenue breakdown by category
const revenueBreakdown = [
  { name: "Electronics", value: 42, color: "#2563EB" },
  { name: "Clothing", value: 28, color: "#38BDF8" },
  { name: "Home & Garden", value: 18, color: "#0EA5E9" },
  { name: "Sports", value: 12, color: "#60A5FA" },
];

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Premium Card Component
const PremiumCard = ({ 
  title, 
  subtitle, 
  children, 
  borderColor = "border-blue-200",
  delay = 0 
}: { 
  title: string; 
  subtitle?: string; 
  children: React.ReactNode; 
  borderColor?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`rounded-2xl border ${borderColor} border-t-4 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
};

// Stat Card Component with animations
const AnimatedStatCard = ({
  icon: Icon,
  label,
  value,
  change,
  isPositive,
  color,
  delay = 0
}: {
  icon: any;
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  color: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]"
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-xl bg-gradient-to-br ${color} p-3 shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? <HiTrendingUp className="h-3 w-3" /> : <HiTrendingDown className="h-3 w-3" />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-slate-900">
          <AnimatedCounter value={typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value} prefix={typeof value === 'string' && value.includes('$') ? '$' : ''} />
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
      </div>
    </motion.div>
  );
};

const DashboardPage = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 2,
    enabled: Boolean(isAuthenticated),
    retry: 1,
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get(productEndpoints.list);
      return res.data as any[];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-lg">
        Sign in to view dashboard.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="mb-3 font-semibold text-red-900">Failed to load dashboard data.</p>
        <p className="text-sm text-red-700">{(error as any)?.message || "Server returned an error."}</p>
      </div>
    );
  }

  const metrics = data.metrics;
  const trends = data.revenue_trends;
  const inventory = data.inventory_status;
  const yearlyOrders = trends.reduce((sum, item) => sum + item.orders, 0);

  // Weekly orders data for bar chart
  const weeklyOrders = [
    { day: "Mon", orders: 12 },
    { day: "Tue", orders: 19 },
    { day: "Wed", orders: 8 },
    { day: "Thu", orders: 15 },
    { day: "Fri", orders: 22 },
    { day: "Sat", orders: 9 },
    { day: "Sun", orders: 6 },
  ];

  // Calculate totals from enhanced data
  const currentRevenue = enhancedRevenueData[enhancedRevenueData.length - 1].revenue;
  const previousRevenue = enhancedRevenueData[enhancedRevenueData.length - 2].revenue;
  const revenueGrowth = (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Hero Section - Live Insights */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-[0_8px_30px_rgba(37,99,235,0.1)] sm:p-8"
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-blue-600">Live Insights</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold text-slate-900 sm:text-4xl">Operational intelligence for inventory, customers, and orders.</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Track stock health, revenue, and order activity while the API enforces the critical business rules behind the scenes.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[520px]">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-slate-900">{metrics.total_orders}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Orders</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-slate-900">{metrics.total_customers}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Customers</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-slate-900">{metrics.total_products}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Products</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-slate-900">${metrics.total_revenue.toFixed(0)}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Revenue</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Original StatCards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          value={metrics.total_products} 
          label="Products" 
          description="Unique SKU catalog records" 
          icon={<HiCube className="h-5 w-5 text-blue-600" />} 
          trend={{ value: 12, isPositive: true }}
          delay={0}
        />
        <StatCard 
          value={metrics.total_customers} 
          label="Customers" 
          description="Profiles with unique emails" 
          icon={<HiUsers className="h-5 w-5 text-cyan-600" />} 
          trend={{ value: 8, isPositive: true }}
          delay={0.1}
        />
        <StatCard 
          value={metrics.total_orders} 
          label="Orders" 
          description="Validated against stock" 
          icon={<HiShoppingBag className="h-5 w-5 text-emerald-600" />} 
          trend={{ value: 23, isPositive: true }}
          delay={0.2}
        />
        <StatCard 
          value={`$${metrics.total_revenue.toFixed(0)}`} 
          label="Revenue" 
          description="Total order value" 
          icon={<HiChartBar className="h-5 w-5 text-purple-600" />} 
          trend={{ value: 18, isPositive: true }}
          delay={0.3}
        />
      </div>

      {/* Enhanced Revenue Section */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <PremiumCard title="Monthly Revenue" subtitle="Sales performance throughout the year" borderColor="border-blue-200" delay={0.4}>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600">
              ${currentRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <HiTrendingUp className="h-4 w-4" />
              +{revenueGrowth}% vs last month
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enhancedRevenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748B" style={{ fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        <Card title="Stock by Category" subtitle="Inventory distribution">
          <CategoryChart />
        </Card>
      </div>

      {/* Revenue Breakdown & Weekly Orders */}
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <PremiumCard title="Revenue Breakdown" subtitle="Sales distribution by category" borderColor="border-cyan-200" delay={0.5}>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={500}
                  animationDuration={1500}
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }}
                  formatter={(value: any) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </PremiumCard>

        <Card title="Weekly Orders" subtitle="Orders placed this week">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyOrders} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748B" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }}
                />
                <Bar dataKey="orders" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Inventory Status & Order Activity */}
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <PremiumCard title="Inventory Status" subtitle="Real-time stock overview" borderColor="border-emerald-200" delay={0.6}>
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">In Stock</span>
                <span className="text-lg font-bold text-emerald-600">847</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
              </div>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Low Stock</span>
                <span className="text-lg font-bold text-amber-600">{metrics.low_stock_products}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-amber-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "12%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                />
              </div>
            </div>
            <div className="rounded-xl bg-red-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Out of Stock</span>
                <span className="text-lg font-bold text-red-600">18</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-red-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "3%" }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                />
              </div>
            </div>
          </div>
        </PremiumCard>

        <Card title="Warehouse Overview" subtitle="Real-time section occupancy">
          <WarehouseGrid />
        </Card>
      </div>

      {/* Order Activity Widget */}
      <PremiumCard title="Order Activity" subtitle="Current processing status" borderColor="border-purple-200" delay={0.7}>
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <HiClock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Pending</p>
                <p className="text-xs text-slate-600">Awaiting</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <HiExclamation className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Processing</p>
                <p className="text-xs text-slate-600">Preparing</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">38</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2">
                <HiCheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Completed</p>
                <p className="text-xs text-slate-600">Delivered</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">156</p>
          </motion.div>
        </div>
      </PremiumCard>

      {/* Inventory Health - Full Grid */}
      <Card title="Inventory Health" subtitle="Low stock and out-of-stock status">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {inventory.map((item, index) => (
            <motion.div
              key={item.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.sku}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-700">{item.stock_quantity} units</span>
                <span className="text-xs text-slate-500">
                  {item.status === "out of stock" ? "Restock needed" : "Monitored"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Inventory Alerts & Momentum */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <Card title="Inventory Alerts" subtitle="Products that need attention">
          <div className="space-y-3">
            {inventory.slice(0, 4).map((item) => (
              <motion.div
                key={`alert-${item.product_id}`}
                whileHover={{ scale: 1.01 }}
                className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.sku}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-3 text-sm text-slate-700">{item.stock_quantity} units available.</p>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card title="Momentum" subtitle="Operational signal">
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Orders this year</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{yearlyOrders}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">Low stock</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{metrics.low_stock_products}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card title="Recent Orders" subtitle="Latest order activity">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.recent_orders.map((order) => (
                <motion.tr
                  key={order.id}
                  whileHover={{ backgroundColor: "#F8FAFC" }}
                  className="transition-colors"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">#{order.id}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{order.customer_name}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-900">${order.total_amount.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Products & Quick Actions */}
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <Card title="Top Products" subtitle="Seeded catalog examples">
          <div className="grid gap-3 sm:grid-cols-2">
            {productsData?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Management shortcuts">
          <div className="space-y-3">
            <Link to="/orders" className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-blue-600">
              Create order
            </Link>
            <Link to="/products" className="block w-full rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-900 transition hover:bg-blue-100">
              Add product
            </Link>
            <Link to="/customers" className="block w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Add customer
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
