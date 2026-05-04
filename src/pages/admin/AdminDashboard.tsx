import React from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ShoppingBag, Users, DollarSign, Package, AlertCircle } from "lucide-react";

const MOCK_SALES_DATA = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 2000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 6390 },
  { name: "Sun", sales: 9490 },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#FDF5E6]">
      <AdminSidebar />
      <main className="flex-grow p-10 overflow-y-auto">
        <h1 className="text-4xl font-display text-[#2F2F2F] mb-10">Boutique <span className="italic text-[#8B0000]">Performance</span></h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Revenue", value: "৳ 1,24,500", icon: DollarSign, color: "bg-blue-500" },
            { label: "Total Orders", value: "142", icon: ShoppingBag, color: "bg-purple-500" },
            { label: "Active Customers", value: "892", icon: Users, color: "bg-green-500" },
            { label: "Pending Shipments", value: "8", icon: Package, color: "bg-orange-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-sm border border-[#D4AF37]/20 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-green-500 text-xs font-bold flex items-center">
                  <TrendingUp size={14} className="mr-1" /> +12%
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[#2F2F2F]">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-sm border border-[#D4AF37]/20 shadow-sm mb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-display text-[#2F2F2F]">Revenue Overview</h2>
            <select className="bg-gray-50 border border-gray-200 text-xs p-2 focus:outline-none">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B0000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B0000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9e9e9e" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9e9e9e" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "none", borderRadius: "4px", color: "#fff", fontSize: "12px" }}
                  itemStyle={{ color: "#D4AF37" }}
                />
                <Area type="monotone" dataKey="sales" stroke="#8B0000" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications / Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-sm border border-[#D4AF37]/20 shadow-sm">
              <h3 className="text-lg font-display mb-6">Recent Alerts</h3>
              <div className="space-y-4">
                 <div className="flex gap-4 p-4 bg-orange-50 border-l-4 border-orange-500">
                    <AlertCircle className="text-orange-500 shrink-0" size={20} />
                    <div>
                       <p className="text-sm font-bold text-orange-800">Low Stock Warning</p>
                       <p className="text-xs text-orange-700 mt-1">"Crimson Banarasi Silk" is down to 3 units.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 p-4 bg-red-50 border-l-4 border-red-500">
                    <AlertCircle className="text-red-500 shrink-0" size={20} />
                    <div>
                       <p className="text-sm font-bold text-red-800">Urgent Order</p>
                       <p className="text-xs text-red-700 mt-1">Order #8821 requires immediate shipping.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
