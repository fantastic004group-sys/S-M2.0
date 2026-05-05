import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { motion } from "motion/react";
import RecommendationSection from "@/src/components/product/RecommendationSection";
import ZoomPage, { ZoomSection } from "@/src/components/ui/ZoomPage";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <ZoomPage>
        <ZoomSection className="bg-natural-bg">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-[#FDF5E6] rounded-full flex items-center justify-center text-[#D4AF37] mx-auto">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-4xl font-display text-[#2F2F2F]">Your bag is empty</h2>
            <p className="text-gray-500 max-w-xs mx-auto">
              Traditional elegance is just a click away. Start exploring our collections.
            </p>
            <Link
              to="/products"
              className="inline-block px-10 py-4 bg-[#8B0000] text-white font-bold tracking-widest uppercase hover:bg-[#660000] transition-all rounded-full"
            >
              Explore Collection
            </Link>
          </div>
        </ZoomSection>
      </ZoomPage>
    );
  }

  return (
    <ZoomPage>
      {/* Section 1: Cart Items (scrollable) */}
      <div className="min-h-full bg-natural-bg py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-display text-[#2D2D2D] mb-12">
            Shopping <span className="italic text-crimson">Bag</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-8">
              {cart.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  className="flex gap-6 pb-8 border-b border-warm-border"
                >
                  <div className="w-32 h-44 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-olive font-bold mb-1">
                            {item.category}
                          </p>
                          <h3 className="text-xl font-display text-[#2D2D2D]">{item.name}</h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-crimson transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-crimson mt-2">&#2547; {item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-warm-border rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 text-[#2D2D2D]"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 text-[#2D2D2D]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 sticky top-32 border border-warm-border rounded-[2rem] shadow-sm">
                <h3 className="text-2xl font-display text-[#2D2D2D] mb-6 uppercase tracking-tight">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>&#2547; {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-olive font-bold uppercase text-[10px] tracking-widest">Free (Heritage Care)</span>
                  </div>
                  <div className="h-px bg-warm-border" />
                  <div className="flex justify-between text-[#2D2D2D] font-bold text-xl">
                    <span>Total</span>
                    <span>&#2547; {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full py-4 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-opacity-90 rounded-full transition-all flex items-center justify-center gap-2 group mb-4 shadow-lg shadow-crimson/20"
                >
                  Checkout Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
                  Secure Payments - S&M Wardrobe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Recommendations */}
      <ZoomSection className="bg-white" center={false}>
        <RecommendationSection />
      </ZoomSection>
    </ZoomPage>
  );
}
