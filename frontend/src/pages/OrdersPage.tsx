import { useMemo, useState } from "react";
import { HiShoppingBag, HiTag } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, customerEndpoints, orderEndpoints, productEndpoints } from "../services/api";
import Card from "../components/Card";
import SearchInput from "../components/SearchInput";
import StatusBadge from "../components/StatusBadge";
import { Customer, Order, OrderFormInput, Product } from "../types";

const inputClass = "rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-500";

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
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Order management" subtitle="Track orders and fulfillment">
          <p className="text-slate-400">Create orders from live product stock. The backend blocks insufficient-stock orders and deducts inventory after successful placement.</p>
        </Card>
        <Card title="Revenue snapshot" subtitle="Order performance">
          <div className="rounded-3xl bg-slate-950/70 p-4 text-center">
            <p className="text-3xl font-semibold text-white">${totalRevenue.toFixed(2)}</p>
            <p className="mt-2 text-sm text-slate-500">Total order value</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <Card title="Search orders" subtitle="Find orders instantly">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by status or customer" />
        </Card>
        <Card title="Assessment rules" subtitle="Order validation">
          <div className="rounded-3xl border border-white/10 bg-violet-500/10 p-4 text-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <HiShoppingBag className="h-5 w-5 text-violet-300" />
              <span>Orders require an existing customer and product</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
              <HiTag className="h-5 w-5 text-violet-300" />
              <span>Insufficient stock is rejected by the API</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Create order" subtitle="Automatic inventory deduction after placement">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
          <select className={inputClass} value={customerId} onChange={(event) => setCustomerId(event.target.value)} required>
            <option value="">Select customer</option>
            {customers?.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
          <select className={inputClass} value={productId} onChange={(event) => setProductId(event.target.value)} required>
            <option value="">Select product</option>
            {products?.map((product) => (
              <option key={product.id} value={product.id}>{product.sku} - {product.name}</option>
            ))}
          </select>
          <input className={inputClass} type="number" min="1" step="1" placeholder="Quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
          <button className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60" disabled={createMutation.isPending || hasInsufficientStock}>
            {createMutation.isPending ? "Creating..." : "Create order"}
          </button>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300 md:col-span-4">
            <span>Available: {selectedProduct ? selectedProduct.stock_quantity : "-"}</span>
            <span className="mx-3 text-slate-600">|</span>
            <span>Preview total: ${previewTotal.toFixed(2)}</span>
            {hasInsufficientStock && <span className="ml-3 text-rose-300">Not enough stock for this quantity.</span>}
            {message && <p className="mt-3 text-slate-300">{message}</p>}
          </div>
        </form>
      </Card>

      <Card title="Order history">
        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-center text-slate-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-4 py-4">Order ID</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Items</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order.id} className="border-t border-white/5 hover:bg-slate-900/80">
                    <td className="px-4 py-4 text-slate-200">#{order.id}</td>
                    <td className="px-4 py-4 text-slate-200">{customerMap.get(order.customer_id) || `Customer ${order.customer_id}`}</td>
                    <td className="px-4 py-4 text-slate-200">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td className="px-4 py-4 text-slate-200">${order.total_amount.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrdersPage;
