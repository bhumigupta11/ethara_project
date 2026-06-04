import { useMemo, useState } from "react";
import { HiCube, HiSparkles, HiPlus, HiChevronDown } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api, productEndpoints } from "../services/api";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { Product, ProductFormInput } from "../types";

const inputClass = "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

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
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card title="Product Catalog" subtitle="Manage your inventory with precision">
          <p className="text-slate-600">Create products, enforce unique SKUs, search catalog items, and monitor stock status in real-time.</p>
        </Card>
        <Card title="Quick Metrics" subtitle="Inventory performance">
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-3xl font-bold text-slate-900">{totals.count}</p>
              <p className="mt-2 text-sm font-medium text-slate-600">Products</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-3xl font-bold text-amber-700">{totals.lowStock}</p>
              <p className="mt-2 text-sm font-medium text-amber-600">Low Stock</p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Search & Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]"
      >
        <Card title="Search Products" subtitle="Find items by SKU or name">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU, name, or category..."
              className={`${inputClass} flex-1`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-blue-600 p-2.5 text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700"
            >
              <HiSparkles className="h-5 w-5" />
            </motion.button>
          </div>
        </Card>
        <Card title="Validation Rules" subtitle="Product requirements">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-blue-100 bg-blue-50 p-4 transition hover:bg-blue-100"
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <HiCube className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-slate-900">Unique SKUs</span>
              </div>
              <p className="text-xs text-slate-600 ml-7">Uppercase & non-duplicate validation</p>
              <div className="flex items-center gap-2 mt-3">
                <HiSparkles className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-slate-900">Stock & Pricing</span>
              </div>
              <p className="text-xs text-slate-600 ml-7">Non-negative stock, positive price</p>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Add Product Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card title="Add New Product" subtitle="Create catalog items with starting inventory">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">SKU</label>
              <input className={inputClass} placeholder="e.g., PROD-001" value={form.sku} onChange={(event) => handleFormChange("sku", event.target.value)} required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Product Name</label>
              <input className={inputClass} placeholder="Product name" value={form.name} onChange={(event) => handleFormChange("name", event.target.value)} required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Category</label>
              <input className={inputClass} placeholder="e.g., Electronics" value={form.category} onChange={(event) => handleFormChange("category", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Image URL</label>
              <input className={inputClass} placeholder="https://..." value={form.image_url} onChange={(event) => handleFormChange("image_url", event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Price</label>
              <input className={inputClass} type="number" min="0.01" step="0.01" placeholder="0.00" value={form.price} onChange={(event) => handleFormChange("price", event.target.value)} required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Stock Quantity</label>
              <input className={inputClass} type="number" min="0" step="1" placeholder="0" value={form.stock_quantity} onChange={(event) => handleFormChange("stock_quantity", event.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Description</label>
              <textarea className={`${inputClass} min-h-24`} placeholder="Product description..." value={form.description} onChange={(event) => handleFormChange("description", event.target.value)} />
            </div>
            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
              {message && (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium text-emerald-600"
                >
                  ✓ {message}
                </motion.p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
                disabled={createMutation.isPending}
              >
                <HiPlus className="h-5 w-5" />
                {createMutation.isPending ? "Creating..." : "Create Product"}
              </motion.button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card title="Product Catalog" subtitle="All products in inventory">
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
              <p className="mt-4">Loading products...</p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Stock</th>
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
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{product.category || "-"}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-900">${product.price.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{product.stock_quantity}</td>
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
              <HiCube className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 font-medium">No products yet</p>
              <p className="text-sm">Create your first product to get started</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ProductsPage;
