import { useMemo } from "react";
import { HiBeaker, HiShieldCheck, HiExclamationCircle } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api, productEndpoints } from "../services/api";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { Product } from "../types";

const fetchProducts = async () => {
  const response = await api.get(productEndpoints.list);
  return response.data as Product[];
};

const InventoryPage = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["inventory"],
    queryFn: fetchProducts,
  });

  const totals = useMemo(
    () => ({
      total: products?.reduce((acc, item) => acc + item.stock_quantity, 0) ?? 0,
      outOfStock: products?.filter((item) => item.stock_quantity === 0).length ?? 0,
      lowStock: products?.filter((item) => item.stock_quantity > 0 && item.stock_quantity <= 10).length ?? 0,
    }),
    [products]
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card title="Inventory Tracking" subtitle="Stock levels & alerts">
          <p className="text-slate-600">Monitor inventory status in real-time and keep your warehouse stocked with smart insights.</p>
        </Card>
        <Card title="Stock Health Metrics" subtitle="Real-time performance">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-center shadow-sm transition hover:shadow-md"
          >
            <p className="text-3xl font-bold text-blue-700">{totals.total}</p>
            <p className="mt-2 text-sm font-medium text-blue-600">Total Units</p>
          </motion.div>
        </Card>
        <Card title="" subtitle="">
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-2xl font-bold text-amber-700">{totals.lowStock}</p>
              <p className="mt-2 text-xs font-medium text-amber-600">Low Stock</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-2xl font-bold text-red-700">{totals.outOfStock}</p>
              <p className="mt-2 text-xs font-medium text-red-600">Out of Stock</p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Inventory Status Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card title="Inventory Status" subtitle="Real-time stock health and availability">
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
              <p className="mt-4">Loading inventory...</p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {products?.map((product, index) => {
                    const status = product.stock_quantity === 0 ? "out of stock" : product.stock_quantity <= 10 ? "low stock" : "in stock";
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ backgroundColor: "#F8FAFC" }}
                        className="transition-colors"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">{product.sku}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{product.name}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-900">{product.stock_quantity}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">${product.price.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                          <StatusBadge status={status} />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <HiBeaker className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 font-medium">No inventory data</p>
              <p className="text-sm">Add products to track inventory</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Inventory Controls & Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <Card title="Inventory Controls" subtitle="Automated stock management">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-blue-100 bg-blue-50 p-5 transition hover:bg-blue-100 space-y-4"
          >
            <div className="flex items-start gap-3">
              <HiBeaker className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Auto Low Stock Flag</p>
                <p className="text-sm text-slate-600">Products with ≤10 units are automatically flagged for reorder</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Audit Logging</p>
                <p className="text-sm text-slate-600">All inventory updates are recorded for compliance and traceability</p>
              </div>
            </div>
          </motion.div>
        </Card>

        <Card title="Out-of-Stock Alerts" subtitle="Immediate action required">
          {totals.outOfStock > 0 ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-red-100 bg-red-50 p-5 transition hover:bg-red-100"
            >
              <div className="flex items-center gap-3">
                <HiExclamationCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">{totals.outOfStock} products out of stock</p>
                  <p className="text-sm text-red-700 mt-1">Restock these items to prevent lost sales</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 transition hover:bg-emerald-100"
            >
              <div className="flex items-center gap-3">
                <HiShieldCheck className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-900">All items in stock</p>
                  <p className="text-sm text-emerald-700 mt-1">Your warehouse is fully stocked</p>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default InventoryPage;
