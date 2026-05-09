import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Hero from "./components/home/Hero";
import ProductCard from "./components/product/ProductCard";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManager from "./pages/admin/ProductManager";
import OrdersManager from "./pages/admin/OrdersManager";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ContactPage, ShippingPage, FAQPage, SizeGuidePage, TermsPage, PrivacyPage } from "./pages/StaticPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Award, Heart } from "lucide-react";
import ZoomPage, { ZoomSection } from "./components/ui/ZoomPage";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./lib/firebase";
import { Product } from "./types";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(4));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <ZoomPage>
      {/* Section 1: Hero */}
      <div className="h-full">
        <Hero />
      </div>

      {/* Section 2: New Arrivals (only if products exist in Firestore) */}
      {(loading || products.length > 0) && (
        <ZoomSection className="bg-natural-bg">
          <section className="max-w-7xl mx-auto px-4 w-full py-10">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-display text-[#2F2F2F] mb-2 uppercase tracking-tight">
                  New <span className="italic text-[#8B0000]">Arrivals</span>
                </h2>
                <div className="h-1 w-20 bg-[#D4AF37]" />
              </div>
              <Link
                to="/products"
                className="text-xs font-bold uppercase tracking-widest text-[#8B0000] border-b-2 border-[#8B0000] pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all flex items-center gap-1"
              >
                View All Collection
                <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-[2rem]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </ZoomSection>
      )}

      {/* Section 3: Heritage Banner */}
      <div className="h-full flex items-center bg-[#8B0000] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10 w-full">
          <div className="flex-1 text-center md:text-left">
             <h3 className="text-4xl md:text-6xl font-display text-white mb-6 leading-tight">
                Heritage <br />Of Handloom
             </h3>
             <p className="text-white/80 max-w-md mb-8 text-lg font-light tracking-wide">
                Experience the rich legacy of Tangail silk and Muslin, woven with love in the heart of Bengal. Authentic. Sustainable. Exquisite.
             </p>
             <Link
               to="/about"
               className="inline-block px-10 py-4 bg-white text-[#8B0000] font-bold tracking-widest uppercase hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl rounded-full"
             >
                Explore The Craft
             </Link>
          </div>
          <div className="flex-1 relative group">
             <div className="absolute -inset-4 border border-[#D4AF37]/30 scale-95 group-hover:scale-100 transition-transform duration-700" />
             <img 
               src="https://images.unsplash.com/photo-1582533561751-https://cdn.shopify.com/s/files/1/0589/1322/6961/articles/Pure_Cotton_Sky_Blue_Pakistani_Salwar_Kameez_With_Digital_Printed_Dupatta-3.webp?v=1725975373983d31d046fe?q=80&w=1200" 
               alt="Craftsmanship" 
               className="w-full relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
             />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 right-10 text-white font-display text-[15rem] leading-none select-none">{'\u0993'}</div>
        </div>
      </div>

      {/* Section 4: Why Choose Us */}
      <ZoomSection className="bg-natural-bg">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display text-[#2F2F2F] mb-4 uppercase tracking-tight">
              Why <span className="italic text-[#8B0000]">Choose Us</span>
            </h2>
            <div className="h-1 w-20 bg-[#D4AF37] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-crimson/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="text-crimson" size={32} />
              </div>
              <h3 className="text-xl font-display text-[#2D2D2D]">Artisan Crafted</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Each piece is handwoven by master artisans preserving centuries of Bengali textile tradition.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="text-olive" size={32} />
              </div>
              <h3 className="text-xl font-display text-[#2D2D2D]">Authentic Quality</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Only the finest fabrics sourced directly from heritage weaving communities across Bengal.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="text-[#D4AF37]" size={32} />
              </div>
              <h3 className="text-xl font-display text-[#2D2D2D]">Sustainable Fashion</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Supporting local communities while delivering timeless elegance that respects the environment.</p>
            </div>
          </div>
        </div>
      </ZoomSection>
    </ZoomPage>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="category/:id" element={<CategoryPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="shipping" element={<ShippingPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="size-guide" element={<SizeGuidePage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Routes - Protected */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute requireAdmin><ProductManager /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><OrdersManager /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AnalyticsDashboard /></ProtectedRoute>} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
