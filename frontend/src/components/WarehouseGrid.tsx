import { motion } from "framer-motion";
import { useState } from "react";

interface WarehouseSection {
  id: string;
  occupancy: number;
}

const WarehouseGrid = () => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Generate warehouse sections with random occupancy
  const sections: WarehouseSection[] = [
    { id: "A1", occupancy: 85 },
    { id: "A2", occupancy: 60 },
    { id: "A3", occupancy: 15 },
    { id: "A4", occupancy: 0 },
    { id: "B1", occupancy: 92 },
    { id: "B2", occupancy: 75 },
    { id: "B3", occupancy: 45 },
    { id: "B4", occupancy: 8 },
    { id: "C1", occupancy: 70 },
    { id: "C2", occupancy: 55 },
    { id: "C3", occupancy: 0 },
    { id: "C4", occupancy: 88 },
    { id: "D1", occupancy: 30 },
    { id: "D2", occupancy: 65 },
    { id: "D3", occupancy: 5 },
    { id: "D4", occupancy: 78 },
  ];

  const getColorClass = (occupancy: number) => {
    if (occupancy === 0) return "bg-slate-100 border-slate-300";
    if (occupancy < 25) return "bg-red-500 border-red-600";
    if (occupancy < 50) return "bg-amber-500 border-amber-600";
    if (occupancy < 75) return "bg-blue-500 border-blue-600";
    return "bg-emerald-500 border-emerald-600";
  };

  const getStatusLabel = (occupancy: number) => {
    if (occupancy === 0) return "Empty";
    if (occupancy < 25) return "Critical";
    if (occupancy < 50) return "Low";
    return "Occupied";
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-emerald-500" />
          <span className="text-slate-600">Occupied (75%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-blue-500" />
          <span className="text-slate-600">Medium (50-75%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-amber-500" />
          <span className="text-slate-600">Low (25-50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-red-500" />
          <span className="text-slate-600">Critical (&lt;25%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-slate-100 border border-slate-300" />
          <span className="text-slate-600">Empty</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            onHoverStart={() => setHoveredSection(section.id)}
            onHoverEnd={() => setHoveredSection(null)}
            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${getColorClass(
              section.occupancy
            )} ${
              hoveredSection === section.id
                ? "shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                : "hover:shadow-lg"
            }`}
          >
            <div className="text-center">
              <p className="text-lg font-bold text-white">{section.id}</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {section.occupancy}%
              </p>
              {hoveredSection === section.id && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-white/80"
                >
                  {getStatusLabel(section.occupancy)}
                </motion.p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseGrid;
