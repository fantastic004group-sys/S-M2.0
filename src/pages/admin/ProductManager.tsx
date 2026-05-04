import React from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function ProductManager() {
  return (
    <div className="flex min-h-screen bg-[#FDF5E6]">
      <AdminSidebar />
      <main className="flex-grow p-10 overflow-y-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-display text-[#2F2F2F]">Product <span className="italic text-[#8B0000]">Manager</span></h1>
            <p className="text-gray-500 mt-2">Add, edit, or remove items from your boutique collection.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 font-bold tracking-widest uppercase hover:bg-[#660000] transition-all shadow-md">
            <Plus size={20} />
            New Product
          </button>
        </div>

        <div className="bg-white rounded-sm border border-[#D4AF37]/20 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#D4AF37]/10 flex flex-col md:row justify-between gap-4">
            <div className="relative max-w-sm w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search products..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#D4AF37] transition-all"
               />
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all">
                 <Filter size={18} /> Filters
               </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#D4AF37]/10">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Image</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Product Name</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Category</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Price</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Stock</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-16 bg-gray-200 rounded-sm overflow-hidden">
                       <img src={`https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200`} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-[#2F2F2F]">Midnight Jamdani Saree {i}</td>
                  <td className="p-4 text-sm text-gray-500">Saree</td>
                  <td className="p-4 font-bold text-[#8B0000]">৳ 14,500</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 text-[10px] font-bold uppercase rounded-sm">12 In Stock</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                       <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                       <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-6 bg-gray-50 border-t border-[#D4AF37]/10 flex justify-between items-center">
             <p className="text-xs text-gray-500 uppercase tracking-widest">Showing 4 of 128 products</p>
             <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1 bg-white border border-gray-200 rounded text-xs hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-all">Next</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
