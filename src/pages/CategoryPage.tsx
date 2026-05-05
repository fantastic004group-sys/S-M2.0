import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Product } from "@/src/types";
import ProductCard from "@/src/components/product/ProductCard";
import { MOCK_PRODUCTS } from "@/src/data/products";
import { ChevronRight } from "lucide-react";
import ZoomPage, { ZoomSection } from "@/src/components/ui/ZoomPage";

const CATEGORY_MAP: Record<string, string> = {
  saree: "Saree",
  "salwar-kameez": "Salwar Kameez",
  kurti: "Kurti",
  lehenga: "Lehenga",
  traditional: "Traditional Wear",
  "western-fusion": "Western Fusion",
  bridal: "Traditional Wear",
};

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = id ? CATEGORY_MAP[id] || id : "";

  useEffect(() => {
    async function fetchProducts() {
      if (!categoryName) return;
      try {
        const q = query(collection(db, "products"), where("category", "==", categoryName));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
        if (items.length > 0) {
          setProducts(items);
        } else {
          setProducts(MOCK_PRODUCTS.filter((p) => p.category === categoryName));
        }
      } catch {
        setProducts(MOCK_PRODUCTS.filter((p) => p.category === categoryName));
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryName]);

  return (
    <ZoomPage>
      {/* Section 1: Header */}
      <ZoomSection className="bg-natural-bg">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-crimson transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-crimson transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-[#2D2D2D] font-semibold">{categoryName}</span>
          </nav>

          <h1 className="text-5xl font-display text-[#2D2D2D] mb-2">
            {categoryName} <span className="italic text-crimson">Collection</span>
          </h1>
          <div className="h-1 w-20 bg-[#D4AF37] mt-4" />
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
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No products found in this category yet.</p>
              <Link
                to="/products"
                className="text-crimson font-bold text-sm uppercase tracking-widest border-b-2 border-crimson pb-1"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ZoomPage>
  );
}
