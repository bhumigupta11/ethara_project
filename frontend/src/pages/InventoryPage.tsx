import { useMemo } from "react";
import { HiBeaker, HiShieldCheck } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
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
    }),
    [products]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Inventory Tracking" subtitle="Stock levels, status, and alerts">
          <p className="text-slate-400">Monitor inventory status in real time and keep your warehouse stocked with smart insights.</p>
        </Card>
        <Card title="Health metrics" subtitle="Stock performance">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/70 p-4 text-center">
              <p className="text-3xl font-semibold text-white">{totals.total}</p>
              <p className="mt-2 text-sm text-slate-500">Total units</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-4 text-center">
              <p className="text-3xl font-semibold text-white">{totals.outOfStock}</p>
              <p className="mt-2 text-sm text-slate-500">Out of stock</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Inventory status" subtitle="Real-time stock health">
        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-center text-slate-400">Loading inventory...</div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-4 py-4">SKU</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Quantity</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => {
                  const status = product.stock_quantity === 0 ? "out of stock" : product.stock_quantity <= 10 ? "low stock" : "in stock";
                  return (
                    <tr key={product.id} className="border-t border-white/5 hover:bg-slate-900/80">
                      <td className="px-4 py-4 text-slate-200">{product.sku}</td>
                      <td className="px-4 py-4 text-slate-200">{product.name}</td>
                      <td className="px-4 py-4 text-slate-200">{product.stock_quantity}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Inventory controls" subtitle="Stock alerts and actions">
        <div className="rounded-3xl border border-white/10 bg-violet-500/10 p-5 text-slate-200">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <HiBeaker className="h-5 w-5 text-violet-300" />
            <span>Automatically flag low stock and out-of-stock products.</span>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
            <HiShieldCheck className="h-5 w-5 text-violet-300" />
            <span>Inventory updates are recorded for audit and compliance.</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InventoryPage;
