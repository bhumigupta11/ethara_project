import { useMemo, useState } from "react";
import { HiCube, HiSparkles } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api, productEndpoints } from "../services/api";
import Card from "../components/Card";
import SearchInput from "../components/SearchInput";
import StatusBadge from "../components/StatusBadge";
import { Product, ProductFormInput } from "../types";

const inputClass = "rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-500";

const fetchProducts = async (search: string) => {
  const response = await api.get(productEndpoints.list, { params: { search } });
  return response.data as Product[];
};

const createProduct = async (payload: ProductFormInput) => {
  const response = await api.post(productEndpoints.create, payload);
  return response.data as Product;
};

const emptyProductForm = {
  sku: "",
  name: "",
  description: "",
  category: "",
  image_url: "",
  price: "0",
  stock_quantity: "0",
};

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyProductForm);
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<Product[], Error>({
    queryKey: ["products", search],
    queryFn: () => fetchProducts(search),
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      setForm(emptyProductForm);
      setMessage("Product created and inventory is ready to track.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: any) => {
      setMessage(error?.response?.data?.detail || "Could not create product.");
    },
  });

  const totals = useMemo(
    () => ({
      count: products?.length ?? 0,
      lowStock: products?.filter((product) => product.stock_quantity <= 10).length ?? 0,
    }),
    [products]
  );

  const handleFormChange = (field: keyof typeof emptyProductForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    createMutation.mutate({
      sku: form.sku,
      name: form.name,
      description: form.description || undefined,
      category: form.category || undefined,
      image_url: form.image_url || undefined,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card title="Product catalog" subtitle="High velocity product operations">
          <p className="text-slate-400">Create products, enforce unique SKUs, search catalog items, and monitor stock status.</p>
        </Card>
        <Card title="Quick metrics" subtitle="Inventory performance">
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-3xl bg-slate-950/70 p-4 text-center transition hover:bg-slate-900/80"
            >
              <p className="text-3xl font-semibold text-white">{totals.count}</p>
              <p className="mt-2 text-sm text-slate-500">Products</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-3xl bg-slate-950/70 p-4 text-center transition hover:bg-slate-900/80"
            >
              <p className="text-3xl font-semibold text-white">{totals.lowStock}</p>
              <p className="mt-2 text-sm text-slate-500">Low stock</p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]"
      >
        <Card title="Search products" subtitle="Find items by SKU or name">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by SKU, name, or category" />
        </Card>
        <Card title="Assessment rules" subtitle="Product validation">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl border border-white/10 bg-violet-500/10 p-4 text-slate-200 transition hover:bg-violet-500/15"
          >
            <p className="text-sm">SKUs are normalized to uppercase and rejected when duplicated by the backend.</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              <HiCube className="h-5 w-5 text-violet-300" />
              <span>Unique SKU enforcement</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
              <HiSparkles className="h-5 w-5 text-violet-300" />
              <span>Non-negative stock and positive price</span>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card title="Add product" subtitle="Create catalog items with starting inventory">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <input className={inputClass} placeholder="SKU" value={form.sku} onChange={(event) => handleFormChange("sku", event.target.value)} required />
            <input className={inputClass} placeholder="Product name" value={form.name} onChange={(event) => handleFormChange("name", event.target.value)} required />
            <input className={inputClass} placeholder="Category" value={form.category} onChange={(event) => handleFormChange("category", event.target.value)} />
            <input className={inputClass} placeholder="Image URL" value={form.image_url} onChange={(event) => handleFormChange("image_url", event.target.value)} />
            <input className={inputClass} type="number" min="0.01" step="0.01" placeholder="Price" value={form.price} onChange={(event) => handleFormChange("price", event.target.value)} required />
            <input className={inputClass} type="number" min="0" step="1" placeholder="Stock quantity" value={form.stock_quantity} onChange={(event) => handleFormChange("stock_quantity", event.target.value)} required />
            <textarea className={`${inputClass} min-h-24 md:col-span-2`} placeholder="Description" value={form.description} onChange={(event) => handleFormChange("description", event.target.value)} />
            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
              {message && (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-emerald-300"
                >
                  {message}
                </motion.p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition hover:bg-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-60"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create product"}
              </motion.button>
            </div>
          </form>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card title="Product Catalog">
          {isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-center text-slate-400">Loading products...</div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-900/90 text-slate-400">
                  <tr>
                    <th className="px-4 py-4">SKU</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Stock</th>
                    <th className="px-4 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product, index) => {
                    const status = product.stock_quantity === 0 ? "out of stock" : product.stock_quantity <= 10 ? "low stock" : "in stock";
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ backgroundColor: "rgba(15, 23, 42, 0.8)" }}
                        className="border-t border-white/5 transition"
                      >
                        <td className="px-4 py-4 text-slate-200">{product.sku}</td>
                        <td className="px-4 py-4 text-slate-200">{product.name}</td>
                        <td className="px-4 py-4 text-slate-200">{product.category || "-"}</td>
                        <td className="px-4 py-4 text-slate-200">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-4 text-slate-200">{product.stock_quantity}</td>
                        <td className="px-4 py-4 text-slate-200">
                          <StatusBadge status={status} />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ProductsPage;
