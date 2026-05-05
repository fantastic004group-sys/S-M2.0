import { ShoppingCart, Heart, Eye } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Product } from "@/src/types";
import { useCart } from "@/src/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[2rem] p-4 flex flex-col shadow-sm border border-warm-border hover:shadow-md transition-shadow"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-[#e8e8e3] rounded-[1.5rem] mb-4 block">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90"
          loading="lazy"
        />
        
        {/* New Badge */}
        <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold text-olive tracking-wider uppercase">
          New
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
           <span className="p-3 bg-white text-olive rounded-full hover:bg-olive hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-sm border border-warm-border">
             <Eye size={18} />
           </span>
           <span className="p-3 bg-white text-olive rounded-full hover:bg-olive hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75 duration-300 shadow-sm border border-warm-border">
             <Heart size={18} />
           </span>
        </div>

        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-crimson text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
            Ending Soon
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[#2D2D2D] font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="px-2 pb-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg text-[#2D2D2D] mb-1 hover:text-crimson transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">
          {product.category}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-[#2D2D2D]">
            &#2547; {product.price.toLocaleString()}
          </span>
          <button 
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="bg-olive text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quick Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
