import { useMemo, useState } from "react";
import { HiSparkles, HiUsers, HiPlus, HiMail } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api, customerEndpoints } from "../services/api";
import Card from "../components/Card";
import { Customer, CustomerFormInput } from "../types";

const inputClass = "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const fetchCustomers = async (search: string) => {
  const response = await api.get(customerEndpoints.list, { params: { search } });
  return response.data as Customer[];
};

const createCustomer = async (payload: CustomerFormInput) => {
  const response = await api.post(customerEndpoints.create, payload);
  return response.data as Customer;
};

const emptyCustomerForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyCustomerForm);
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery<Customer[], Error>({
    queryKey: ["customers", search],
    queryFn: () => fetchCustomers(search),
  });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      setForm(emptyCustomerForm);
      setMessage("Customer created with a unique email profile.");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: any) => {
      setMessage(error?.response?.data?.detail || "Could not create customer.");
    },
  });

  const totals = useMemo(
    () => ({
      count: customers?.length ?? 0,
      recent: customers?.slice(0, 4) ?? [],
    }),
    [customers]
  );

  const handleFormChange = (field: keyof typeof emptyCustomerForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    createMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address || undefined,
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
        <Card title="Customer Relationships" subtitle="Build loyalty with every order">
          <p className="text-slate-600">Create customer profiles, enforce unique emails, and manage contacts with precision.</p>
        </Card>
        <Card title="Customer Metrics" subtitle="Engagement snapshot">
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-3xl font-bold text-slate-900">{totals.count}</p>
              <p className="mt-2 text-sm font-medium text-slate-600">Profiles</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-3xl font-bold text-purple-700">{totals.recent.length}</p>
              <p className="mt-2 text-sm font-medium text-purple-600">Recent</p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Search & Validation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]"
      >
        <Card title="Search Customers" subtitle="Find contacts quickly">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
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
        <Card title="Validation Rules" subtitle="Customer requirements">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-purple-100 bg-purple-50 p-4 transition hover:bg-purple-100"
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <HiMail className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-slate-900">Unique Emails</span>
              </div>
              <p className="text-xs text-slate-600 ml-7">No duplicate email enforcement</p>
              <div className="flex items-center gap-2 mt-3">
                <HiUsers className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-slate-900">Email Validation</span>
              </div>
              <p className="text-xs text-slate-600 ml-7">Format validation via API</p>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Add Customer Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card title="Add New Customer" subtitle="Create a profile for ordering">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Full Name</label>
              <input
                className={inputClass}
                placeholder="Customer name"
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Email Address</label>
              <input
                className={inputClass}
                type="email"
                placeholder="customer@example.com"
                value={form.email}
                onChange={(event) => handleFormChange("email", event.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Phone</label>
              <input
                className={inputClass}
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(event) => handleFormChange("phone", event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-700">Address</label>
              <input
                className={inputClass}
                placeholder="Street address"
                value={form.address}
                onChange={(event) => handleFormChange("address", event.target.value)}
              />
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:from-purple-700 hover:to-pink-700 disabled:opacity-60"
                disabled={createMutation.isPending}
              >
                <HiPlus className="h-5 w-5" />
                {createMutation.isPending ? "Creating..." : "Create Customer"}
              </motion.button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card title="Customer Directory" subtitle="All registered customers">
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600"></div>
              <p className="mt-4">Loading customers...</p>
            </div>
          ) : customers && customers.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {customers?.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ backgroundColor: "#F8FAFC" }}
                      className="transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">{customer.name}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{customer.email}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">{customer.phone || "-"}</td>
                      <td className="px-4 py-4 text-sm text-slate-700 max-w-md truncate">{customer.address || "-"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              <HiUsers className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 font-medium">No customers yet</p>
              <p className="text-sm">Create your first customer profile to get started</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomersPage;
