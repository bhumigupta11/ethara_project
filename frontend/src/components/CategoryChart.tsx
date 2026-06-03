import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const CategoryChart = () => {
  const data: CategoryData[] = [
    { name: "Electronics", value: 35, color: "#2563EB" },
    { name: "Clothing", value: 25, color: "#38BDF8" },
    { name: "Food", value: 20, color: "#10B981" },
    { name: "Tools", value: 12, color: "#8B5CF6" },
    { name: "Other", value: 8, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-4">
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between rounded-lg bg-slate-50 p-3 transition hover:bg-slate-100"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
