import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BENGALI_STRINGS } from "@/src/constants";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [lang, setLang] = React.useState<"en" | "bn">("en");
  const [searchQuery, setSearchQuery] = React.useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  const t = BENGALI_STRINGS[lang];

  const menuItems = [
    { name: "Saree", path: "/category/saree" },
    { name: "Salwar Kameez", path: "/category/salwar-kameez" },
    { name: "Kurti", path: "/category/kurti" },
    { name: "Traditional", path: "/category/traditional" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-warm-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#2D2D2D] hover:text-crimson transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col">
              <h1 className="text-2xl font-display font-bold text-crimson tracking-tight">S&M WARDROBE</h1>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400">Heritage Bengali Boutique</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-[11px] font-bold uppercase tracking-widest transition-all pb-1 border-b-2 ${
                    isActive ? "text-crimson border-crimson" : "text-gray-500 border-transparent hover:text-crimson"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-5">
            <form onSubmit={handleSearch} className="hidden lg:block relative">
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search collections..." 
                 className="bg-[#f0f0eb] border-none rounded-full py-2 px-5 text-[11px] w-48 focus:ring-1 focus:ring-olive transition-all"
               />
               <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2" aria-label="Search">
                 <Search size={14} className="text-gray-400" />
               </button>
            </form>
            <button 
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="text-[10px] font-bold border border-warm-border px-2 py-1 rounded text-gray-500 hover:bg-natural-bg transition-all"
            >
              {lang === "en" ? "BN" : "EN"}
            </button>
            <Link to="/cart" className="text-[#2D2D2D] hover:text-crimson relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-crimson text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                 {isAdmin && (
                   <Link to="/admin" className="text-[#D4AF37] hover:text-[#8B0000] transition-colors" title="Admin Panel">
                     <ShieldCheck size={20} />
                   </Link>
                 )}
                 <button onClick={logout} className="text-[#2F2F2F] hover:text-[#8B0000] transition-colors" title="Logout">
                   <LogOut size={20} />
                 </button>
              </div>
            ) : (
              <Link to="/login" className="text-[#2F2F2F] hover:text-[#8B0000] transition-colors">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#D4AF37]/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-4 text-base font-medium text-[#2F2F2F] border-b border-[#D4AF37]/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/products"
                className="block px-3 py-4 text-base font-medium text-crimson"
                onClick={() => setIsMenuOpen(false)}
              >
                View All Products
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
