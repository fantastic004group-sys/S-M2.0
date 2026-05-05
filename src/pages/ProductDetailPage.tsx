import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Product } from "@/src/types";
import { useCart } from "@/src/context/CartContext";
import { MOCK_PRODUCTS } from "@/src/data/products";
import { ShoppingCart, Heart, ChevronRight, Minus, Plus, Truck, RotateCcw, Shield } from "lucide-react";
import { motion } from "motion/react";
import ZoomPage, { ZoomSection } from "@/src/components/ui/ZoomPage";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          const mock = MOCK_PRODUCTS.find((p) => p.id === id);
          setProduct(mock || null);
        }
      } catch {
        const mock = MOCK_PRODUCTS.find((p) => p.id === id);
        setProduct(mock || null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <ZoomPage>
        <ZoomSection className="bg-natural-bg">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-[2rem]" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                <div className="h-6 bg-gray-100 animate-pulse rounded w-1/4 mt-6" />
              </div>
            </div>
          </div>
        </ZoomSection>
      </ZoomPage>
    );
  }

  if (!product) {
    return (
      <ZoomPage>
        <ZoomSection className="bg-natural-bg">
          <div className="text-center">
            <h2 className="text-3xl font-display text-[#2D2D2D] mb-4">Product not found</h2>
            <Link to="/products" className="text-crimson font-bold uppercase tracking-widest text-sm border-b-2 border-crimson pb-1">
              Browse Products
            </Link>
          </div>
        </ZoomSection>
      </ZoomPage>
    );
  }

  return (
    <ZoomPage>
      {/* Section 1: Product Details (scrollable for long content) */}
      <div className="min-h-full bg-natural-bg py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-crimson transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-crimson transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-[#2D2D2D] font-semibold">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#e8e8e3] rounded-[2rem]">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? "border-crimson" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <p className="text-[10px] uppercase tracking-widest text-olive font-bold mb-2">{product.category}</p>
              <h1 className="text-4xl font-display text-[#2D2D2D] mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-crimson mb-6">&#2547; {product.price.toLocaleString()}</p>
              <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-natural-bg text-olive text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-6">
                {product.stock > 5 ? (
                  <span className="text-green-600 text-sm font-semibold">In Stock ({product.stock} available)</span>
                ) : product.stock > 0 ? (
                  <span className="text-orange-600 text-sm font-semibold">Only {product.stock} left!</span>
                ) : (
                  <span className="text-red-600 text-sm font-semibold">Out of Stock</span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center border border-warm-border rounded-full overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 text-[#2D2D2D]">
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-100 text-[#2D2D2D]">
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-opacity-90 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-crimson/20"
                  >
                    <ShoppingCart size={18} />
                    Add to Bag
                  </button>

                  <button className="p-4 border border-warm-border rounded-full hover:bg-gray-50 transition-all text-gray-500 hover:text-crimson">
                    <Heart size={20} />
                  </button>
                </div>
              )}

              <div className="border-t border-warm-border pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck size={18} className="text-olive" />
                  <span>Free shipping on orders over &#2547;5,000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw size={18} className="text-olive" />
                  <span>7-day easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield size={18} className="text-olive" />
                  <span>Authentic handcrafted guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ZoomPage>
  );
}
