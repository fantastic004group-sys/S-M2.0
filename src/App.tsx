import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Hero from "./components/home/Hero";
import ProductCard from "./components/product/ProductCard";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManager from "./pages/admin/ProductManager";
import { Product } from "./types";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Mock Data for initial view
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Golden Silk Jamdani Saree",
    description: "Hand-woven traditional Jamdani with golden floral motifs.",
    price: 12500,
    category: "Saree",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800"],
    stock: 10,
    tags: ["traditional", "jamdani", "silk"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "2",
    name: "Crimson Banarasi Silk",
    description: "Exquisite crimson silk saree with elaborate zari work.",
    price: 18900,
    category: "Saree",
    images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800"],
    stock: 3,
    tags: ["bridal", "traditional", "silk"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "3",
    name: "Emerald Anarkali Suit",
    description: "Deep emerald green Georgette Anarkali with silver embroidery.",
    price: 8500,
    category: "Salwar Kameez",
    images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800"],
    stock: 15,
    tags: ["anarkali", "partywear", "emerald"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "4",
    name: "Ivory Fusion Kurti",
    description: "Modern ivory cotton kurti with traditional block prints.",
    price: 3200,
    category: "Kurti",
    images: ["https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=800"],
    stock: 25,
    tags: ["kurti", "fusion", "ivory"],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

function Home() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:row items-baseline justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-display text-[#2F2F2F] mb-2 uppercase tracking-tight">
              New <span className="italic text-[#8B0000]">Arrivals</span>
            </h2>
            <div className="h-1 w-20 bg-[#D4AF37]" />
          </div>
          <button className="text-xs font-bold uppercase tracking-widest text-[#8B0000] border-b-2 border-[#8B0000] pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">
            View All Collection
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className="bg-[#8B0000] py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
             <h3 className="text-4xl md:text-6xl font-display text-white mb-6 leading-tight">
                Heritage <br />Of Handloom
             </h3>
             <p className="text-white/80 max-w-md mb-8 text-lg font-light tracking-wide">
                Experience the rich legacy of Tangail silk and Muslin, woven with love in the heart of Bengal. Authentic. Sustainable. Exquisite.
             </p>
             <button className="px-10 py-4 bg-white text-[#8B0000] font-bold tracking-widest uppercase hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl">
                Explore The Craft
             </button>
          </div>
          <div className="flex-1 relative group">
             <div className="absolute -inset-4 border border-[#D4AF37]/30 scale-95 group-hover:scale-100 transition-transform duration-700" />
             <img 
               src="https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=1000" 
               alt="Craftsmanship" 
               className="w-full relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
             />
          </div>
        </div>
        
        {/* Pattern Background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 right-10 text-white font-display text-[15rem] leading-none select-none">ও</div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<div className="p-20 text-center">Product Listing Page coming soon</div>} />
              <Route path="category/:id" element={<div className="p-20 text-center">Category Page coming soon</div>} />
              <Route path="cart" element={<CartPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManager />} />
            <Route path="/admin/orders" element={<div className="p-20 text-center bg-[#FDF5E6] min-h-screen flex items-center justify-center font-display text-4xl">Order Management coming soon</div>} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
