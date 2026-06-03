const StatusBadge = ({ status }: { status: string }) => {
  const statusClasses: Record<string, string> = {
    "in stock": "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "low stock": "bg-amber-100 text-amber-700 border border-amber-200",
    "out of stock": "bg-red-100 text-red-700 border border-red-200",
    pending: "bg-blue-100 text-blue-700 border border-blue-200",
    processing: "bg-purple-100 text-purple-700 border border-purple-200",
    completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <span className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusClasses[status.toLowerCase()] ?? "bg-slate-100 text-slate-700 border border-slate-200"}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
