import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Product } from "@/src/types";
import ProductCard from "@/src/components/product/ProductCard";
import { CATEGORIES } from "@/src/constants";
import { MOCK_PRODUCTS } from "@/src/data/products";
import { Search, SlidersHorizontal } from "lucide-react";
import ZoomPage, { ZoomSection } from "@/src/components/ui/ZoomPage";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(items.length > 0 ? items : MOCK_PRODUCTS);
      } catch {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return b.createdAt - a.createdAt;
    });

  return (
    <ZoomPage>
      {/* Section 1: Header + Filters */}
      <ZoomSection className="bg-natural-bg">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h1 className="text-5xl font-display text-[#2D2D2D] mb-2">
              Our <span className="italic text-crimson">Collection</span>
            </h1>
            <p className="text-gray-500 text-sm">Discover handcrafted Bengali garments for every occasion.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-warm-border rounded-full py-3 px-5 pl-12 text-sm focus:ring-1 focus:ring-olive transition-all outline-none"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-warm-border rounded-full py-3 px-5 text-sm focus:ring-1 focus:ring-olive transition-all outline-none"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-warm-border rounded-full py-3 px-5 text-sm focus:ring-1 focus:ring-olive transition-all outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </ZoomSection>

      {/* Section 2: Products Grid (scrollable) */}
      <div className="min-h-full bg-natural-bg py-8">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-[2rem]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <SlidersHorizontal size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No products match your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-4 text-crimson font-bold text-sm uppercase tracking-widest border-b-2 border-crimson pb-1"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ZoomPage>
  );
}
