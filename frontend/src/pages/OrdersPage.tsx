import { useMemo, useState } from "react";
import { HiShoppingBag, HiTag, HiPlus, HiX } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api, customerEndpoints, orderEndpoints, productEndpoints } from "../services/api";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { Customer, Order, OrderFormInput, Product } from "../types";

const inputClass = "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const fetchOrders = async (search: string) => {
  const response = await api.get(orderEndpoints.list, { params: { search } });
  return response.data as Order[];
};

const fetchCustomers = async () => {
  const response = await api.get(customerEndpoints.list, { params: { limit: 100 } });
  return response.data as Customer[];
};

const fetchProducts = async () => {
  const response = await api.get(productEndpoints.list, { params: { limit: 100 } });
  return response.data as Product[];
};

const createOrder = async (payload: OrderFormInput) => {
  const response = await api.post(orderEndpoints.create, payload);
  return response.data as Order;
};

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<Order[], Error>({
    queryKey: ["orders", search],
    queryFn: () => fetchOrders(search),
  });
  const { data: customers } = useQuery<Customer[]>({ queryKey: ["customers", "order-form"], queryFn: fetchCustomers });
  const { data: products } = useQuery<Product[]>({ queryKey: ["products", "order-form"], queryFn: fetchProducts });

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      setProductId("");
      setQuantity("1");
      setMessage("Order created and stock was reduced automatically.");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: any) => {
      setMessage(error?.response?.data?.detail || "Could not create order.");
    },
  });

  const customerMap = useMemo(() => new Map(customers?.map((customer) => [customer.id, customer.name]) ?? []), [customers]);
  const selectedProduct = products?.find((product) => product.id === Number(productId));
  const selectedQuantity = Number(quantity);
  const previewTotal = selectedProduct ? selectedProduct.price * selectedQuantity : 0;
  const hasInsufficientStock = selectedProduct ? selectedQuantity > selectedProduct.stock_quantity : false;
  const totalRevenue = useMemo(() => orders?.reduce((sum, order) => sum + order.total_amount, 0) ?? 0, [orders]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    createMutation.mutate({
      customer_id: Number(customerId),
      status: "pending",
      items: [{ product_id: Number(productId), quantity: selectedQuantity }],
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card title="Order Management" subtitle="Track orders and fulfillment">
          <p className="text-slate-600">Create orders from live product stock. The backend blocks insufficient-stock orders and deducts inventory automatically.</p>
        </Card>
        <Card title="Revenue Snapshot" subtitle="Order performance">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 text-center shadow-sm transition hover:shadow-md"
          >
            <p className="text-3xl font-bold text-emerald-700">${totalRevenue.toFixed(2)}</p>
            <p className="mt-2 text-sm font-medium text-emerald-600">Total Order Value</p>
          </motion.div>
        </Card>
      </motion.div>

      {/* Search & Validation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]"
      >
        <Card title="Search Orders" subtitle="Find orders instantly">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by status or customer..."
              className={`${inputClass} flex-1`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-blue-600 p-2.5 text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
            >
              <HiTag className="h-5 w-5" />
            </motion.button>
          </div>
        </Card>
        <Card title="Validation Rules" subtitle="Order requirements">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 transition hover:bg-emerald-100"
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <HiShoppingBag className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-slate-900">Valid References</span>
              </div>
              <p className="text-xs text-slate-600 ml-7">Customer & product must exist</p>
              <div className="flex items-center gap-2 mt-3">
                <HiTag className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-slate-900">Stock Check</span>
              </div>
              <p className="text-xs text-slate-600 ml-7">Insufficient stock rejected</p>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Create Order Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card title="Create New Order" subtitle="Automatic inventory deduction after placement">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Select Customer</label>
                <select
                  className={inputClass}
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  required
                >
                  <option value="">Choose a customer...</option>
                  {customers?.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Select Product</label>
                <select
                  className={inputClass}
                  value={productId}
                  onChange={(event) => setProductId(event.target.value)}
                  required
                >
                  <option value="">Choose a product...</option>
                  {products?.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.sku} - {product.name} (${product.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Quantity</label>
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-700 hover:to-green-700 disabled:opacity-60"
                  disabled={createMutation.isPending || hasInsufficientStock}
                >
                  <HiPlus className="h-5 w-5" />
                  {createMutation.isPending ? "Creating..." : "Create Order"}
                </motion.button>
              </div>
            </div>

            {/* Order Preview */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-blue-100 bg-blue-50 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-600">Available Stock</p>
                  <p className="text-lg font-bold text-slate-900">{selectedProduct ? selectedProduct.stock_quantity : "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Preview Total</p>
                  <p className="text-lg font-bold text-blue-600">${previewTotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-end">
                  {hasInsufficientStock && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2">
                      <HiX className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-medium text-red-700">Insufficient stock</span>
                    </div>
                  )}
                </div>
              </div>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm font-medium text-emerald-600"
                >
                  ✓ {message}
                </motion.p>
              )}
            </motion.div>
          </form>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card title="Order History" subtitle="All transactions">
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"></div>
              <p className="mt-4">Loading orders...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {orders?.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ backgroundColor: "#F8FAFC" }}
                      className="transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">#{order.id}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{customerMap.get(order.customer_id) || `Customer ${order.customer_id}`}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-900">${order.total_amount.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <StatusBadge status={order.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <HiShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 font-medium">No orders yet</p>
              <p className="text-sm">Create your first order to get started</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default OrdersPage;
