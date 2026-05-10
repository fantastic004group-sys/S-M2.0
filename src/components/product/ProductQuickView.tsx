import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingCart, Heart, Minus, Plus, Truck, RotateCcw, Shield, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "@/src/types";
import { useCart } from "@/src/context/CartContext";

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full text-gray-500 hover:text-crimson hover:bg-white transition-all shadow-sm"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row max-h-[85vh]">
              {/* Image */}
              <div className="md:w-1/2 relative bg-[#e8e8e3]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 md:h-full object-cover object-center"
                />

                {product.stock < 5 && product.stock > 0 && (
                  <span className="absolute top-4 left-4 bg-crimson text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Only {product.stock} left
                  </span>
                )}

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-[#2D2D2D] font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-8 overflow-y-auto">
                <p className="text-[10px] uppercase tracking-widest text-olive font-bold mb-2">
                  {product.category}
                </p>
                <h2 className="text-2xl font-display text-[#2D2D2D] mb-3">
                  {product.name}
                </h2>
                <p className="text-2xl font-bold text-crimson mb-4">
                  &#2547; {product.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-natural-bg text-olive text-[10px] font-bold uppercase tracking-widest rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stock */}
                <div className="mb-6">
                  {product.stock > 5 ? (
                    <span className="text-green-600 text-sm font-semibold">In Stock</span>
                  ) : product.stock > 0 ? (
                    <span className="text-orange-600 text-sm font-semibold">Only {product.stock} left!</span>
                  ) : (
                    <span className="text-red-600 text-sm font-semibold">Out of Stock</span>
                  )}
                </div>

                {/* Quantity + Add to Cart */}
                {product.stock > 0 && (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-warm-border rounded-full overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100 text-[#2D2D2D]"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="p-2 hover:bg-gray-100 text-[#2D2D2D]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        className="p-3 border border-warm-border rounded-full hover:bg-gray-50 transition-all text-gray-400 hover:text-crimson"
                      >
                        <Heart size={18} />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full py-3 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-opacity-90 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-crimson/20 text-sm"
                    >
                      <ShoppingCart size={16} />
                      Add to Bag
                    </button>
                  </div>
                )}

                {/* View Full Details Link */}
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="w-full py-3 border border-warm-border text-[#2D2D2D] font-bold tracking-widest uppercase hover:bg-gray-50 rounded-full transition-all flex items-center justify-center gap-2 text-[11px]"
                >
                  View Full Details
                  <ExternalLink size={14} />
                </Link>

                {/* Trust badges */}
                <div className="border-t border-warm-border mt-6 pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Truck size={14} className="text-olive" />
                    <span>Free shipping over &#2547;5,000</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <RotateCcw size={14} className="text-olive" />
                    <span>7-day easy returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield size={14} className="text-olive" />
                    <span>Authentic handcrafted guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
