import React from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Product } from "@/src/types";
import { CATEGORIES } from "@/src/constants";

export default function ProductManager() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
      setProducts(items);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
      images: [(formData.get("imageUrl") as string) || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800"],
      tags: (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean),
      updatedAt: Date.now(),
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: Date.now(),
        });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Check Firestore rules and permissions.");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(productId);
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Check Firestore rules and permissions.");
    } finally {
      setDeleting(null);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      <AdminSidebar />
      <main className="flex-grow p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-display text-[#2D2D2D]">Product <span className="italic text-crimson">Manager</span></h1>
            <p className="text-gray-500 mt-2">Add, edit, or remove items from your boutique collection.</p>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-crimson text-white px-6 py-3 font-bold tracking-widest uppercase hover:bg-opacity-90 transition-all shadow-md rounded-full"
          >
            <Plus size={20} />
            New Product
          </button>
        </div>

        {/* Modal for adding/editing product */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-display text-crimson">
                  {editingProduct ? "Edit" : "Add"} <span className="italic">Product</span>
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-crimson"><X /></button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Product Name</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ""}
                    className="w-full px-4 py-2 border border-warm-border rounded-lg focus:ring-1 focus:ring-olive transition-all outline-none"
                    placeholder="e.g. Blue Muslin Saree"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Price (&#2547;)</label>
                    <input
                      name="price"
                      type="number"
                      required
                      defaultValue={editingProduct?.price || ""}
                      className="w-full px-4 py-2 border border-warm-border rounded-lg focus:ring-1 focus:ring-olive transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      required
                      defaultValue={editingProduct?.stock ?? ""}
                      className="w-full px-4 py-2 border border-warm-border rounded-lg focus:ring-1 focus:ring-olive transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || "Saree"}
                    className="w-full px-4 py-2 border border-warm-border rounded-lg focus:ring-1 focus:ring-olive transition-all outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Image URL</label>
                  <input
                    name="imageUrl"
                    type="url"
                    defaultValue={editingProduct?.images[0] || ""}
                    className="w-full px-4 py-2 border border-warm-border rounded-lg focus:ring-1 focus:ring-olive transition-all outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    name="tags"
                    defaultValue={editingProduct?.tags.join(", ") || ""}
                    className="w-full px-4 py-2 border border-warm-border rounded-lg focus:ring-1 focus:ring-olive transition-all outline-none"
                    placeholder="silk, traditional, bridal"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingProduct?.description || ""}
                    className="w-full px-4 py-2 border border-warm-border rounded-lg focus:ring-1 focus:ring-olive transition-all outline-none"
                    placeholder="Details about fabric, weave, etc."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-olive text-white font-bold tracking-widest uppercase rounded-full hover:opacity-90 transition-all shadow-lg"
                >
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-warm-border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-natural-bg/30 border-b border-warm-border">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400 italic">Finding your treasures...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400 italic">The boutique is currently empty. Add your first piece!</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-[#e8e8e3] rounded-xl overflow-hidden shrink-0">
                         <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-display text-[#2D2D2D]">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[11px] text-gray-500 uppercase tracking-widest font-semibold">{product.category}</td>
                  <td className="p-4 font-bold text-crimson font-sans">&#2547; {product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded-full ${
                      product.stock > 5 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 text-gray-400">
                       <button
                         onClick={() => openEditModal(product)}
                         className="p-2 hover:text-olive hover:bg-gray-100 rounded-lg transition-all"
                         title="Edit product"
                       >
                         <Edit2 size={16} />
                       </button>
                       <button
                         onClick={() => handleDelete(product.id)}
                         disabled={deleting === product.id}
                         className="p-2 hover:text-crimson hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                         title="Delete product"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
