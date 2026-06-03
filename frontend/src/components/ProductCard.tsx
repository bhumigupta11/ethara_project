import { motion } from "framer-motion";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/30">{product.sku?.slice(0, 2)}</div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{product.name}</p>
          <p className="text-xs text-slate-500">{product.category || "General"}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900">${product.price.toFixed(2)}</p>
          <p className="text-xs text-slate-600">{product.stock_quantity} in stock</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
