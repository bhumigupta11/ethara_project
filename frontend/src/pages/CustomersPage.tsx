import { useMemo, useState } from "react";
import { HiSparkles, HiUsers } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, customerEndpoints } from "../services/api";
import Card from "../components/Card";
import SearchInput from "../components/SearchInput";
import { Customer, CustomerFormInput } from "../types";

const inputClass = "rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-500";

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
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Customer relationships" subtitle="Build loyalty with every order">
          <p className="text-slate-400">Create customer profiles, enforce unique emails, and search contacts by name or email.</p>
        </Card>
        <Card title="Customer score" subtitle="Engagement snapshot">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/70 p-4 text-center">
              <p className="text-3xl font-semibold text-white">{totals.count}</p>
              <p className="mt-2 text-sm text-slate-500">Profiles</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-4 text-center">
              <p className="text-3xl font-semibold text-white">{totals.recent.length}</p>
              <p className="mt-2 text-sm text-slate-500">Recent shown</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <Card title="Search customers" subtitle="Locate contacts quickly">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email" />
        </Card>
        <Card title="Assessment rules" subtitle="Customer validation">
          <div className="rounded-3xl border border-white/10 bg-violet-500/10 p-4 text-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <HiUsers className="h-5 w-5 text-violet-300" />
              <span>Unique email enforcement</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
              <HiSparkles className="h-5 w-5 text-violet-300" />
              <span>Email format validation through the API</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Add customer" subtitle="Create a profile for ordering">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className={inputClass} placeholder="Customer name" value={form.name} onChange={(event) => handleFormChange("name", event.target.value)} required />
          <input className={inputClass} type="email" placeholder="Email" value={form.email} onChange={(event) => handleFormChange("email", event.target.value)} required />
          <input className={inputClass} placeholder="Phone" value={form.phone} onChange={(event) => handleFormChange("phone", event.target.value)} />
          <input className={inputClass} placeholder="Address" value={form.address} onChange={(event) => handleFormChange("address", event.target.value)} />
          <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
            {message && <p className="text-sm text-slate-300">{message}</p>}
            <button className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create customer"}
            </button>
          </div>
        </form>
      </Card>

      <Card title="Customer Directory">
        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-center text-slate-400">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Phone</th>
                  <th className="px-4 py-4">Address</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((customer) => (
                  <tr key={customer.id} className="border-t border-white/5 hover:bg-slate-900/80">
                    <td className="px-4 py-4 text-slate-200">{customer.name}</td>
                    <td className="px-4 py-4 text-slate-200">{customer.email}</td>
                    <td className="px-4 py-4 text-slate-200">{customer.phone || "-"}</td>
                    <td className="px-4 py-4 text-slate-200">{customer.address || "-"}</td>
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

export default CustomersPage;
