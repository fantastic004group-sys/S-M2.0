import React from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, ShoppingCart, Users } from "lucide-react";

const WEEKLY_DATA = [
  { name: "Mon", revenue: 4000, orders: 12 },
  { name: "Tue", revenue: 3000, orders: 8 },
  { name: "Wed", revenue: 2000, orders: 6 },
  { name: "Thu", revenue: 2780, orders: 9 },
  { name: "Fri", revenue: 1890, orders: 5 },
  { name: "Sat", revenue: 6390, orders: 18 },
  { name: "Sun", revenue: 9490, orders: 24 },
];

const CATEGORY_DATA = [
  { name: "Saree", value: 45 },
  { name: "Salwar Kameez", value: 25 },
  { name: "Kurti", value: 20 },
  { name: "Traditional", value: 10 },
];

const COLORS = ["#911c1c", "#5A5A40", "#D4AF37", "#2D2D2D"];

const MONTHLY_VISITORS = [
  { month: "Jan", visitors: 2400 },
  { month: "Feb", visitors: 1398 },
  { month: "Mar", visitors: 9800 },
  { month: "Apr", visitors: 3908 },
  { month: "May", visitors: 4800 },
  { month: "Jun", visitors: 3800 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      <AdminSidebar />
      <main className="flex-grow p-10 overflow-y-auto">
        <h1 className="text-4xl font-display text-[#2D2D2D] mb-10">
          Store <span className="italic text-crimson">Analytics</span>
        </h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Page Views", value: "12,847", change: "+18%", icon: Eye, color: "bg-blue-500" },
            { label: "Conversion Rate", value: "3.2%", change: "+0.5%", icon: ShoppingCart, color: "bg-green-500" },
            { label: "Avg. Order Value", value: "৳ 8,750", change: "+8%", icon: TrendingUp, color: "bg-purple-500" },
            { label: "New Customers", value: "156", change: "+22%", icon: Users, color: "bg-orange-500" },
          ].map(metric => (
            <div key={metric.label} className="bg-white p-6 rounded-2xl border border-warm-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`${metric.color} p-3 rounded-lg text-white`}>
                  <metric.icon size={20} />
                </div>
                <span className="text-green-500 text-xs font-bold flex items-center">
                  <TrendingUp size={14} className="mr-1" /> {metric.change}
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{metric.label}</p>
              <h3 className="text-2xl font-bold text-[#2D2D2D]">{metric.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-sm">
            <h2 className="text-xl font-display text-[#2D2D2D] mb-6">Weekly Revenue</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_DATA}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#911c1c" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#911c1c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9e9e9e" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9e9e9e" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1A1A", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                    itemStyle={{ color: "#D4AF37" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#911c1c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-sm">
            <h2 className="text-xl font-display text-[#2D2D2D] mb-6">Sales by Category</h2>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {CATEGORY_DATA.map((cat, idx) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-sm text-gray-600">{cat.name}</span>
                    <span className="text-sm font-bold text-[#2D2D2D]">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Visitors */}
          <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-sm">
            <h2 className="text-xl font-display text-[#2D2D2D] mb-6">Monthly Visitors</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_VISITORS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9e9e9e" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9e9e9e" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1A1A", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                    itemStyle={{ color: "#D4AF37" }}
                  />
                  <Bar dataKey="visitors" fill="#5A5A40" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-sm">
            <h2 className="text-xl font-display text-[#2D2D2D] mb-6">Top Selling Products</h2>
            <div className="space-y-4">
              {[
                { name: "Golden Silk Jamdani Saree", sold: 48, revenue: "৳ 6,00,000" },
                { name: "Crimson Banarasi Silk", sold: 35, revenue: "৳ 6,61,500" },
                { name: "Emerald Anarkali Suit", sold: 32, revenue: "৳ 2,72,000" },
                { name: "Ivory Fusion Kurti", sold: 27, revenue: "৳ 86,400" },
              ].map((product, idx) => (
                <div key={product.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="w-8 h-8 bg-crimson/10 rounded-full flex items-center justify-center text-crimson font-bold text-sm">
                    {idx + 1}
                  </span>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-[#2D2D2D]">{product.name}</p>
                    <p className="text-[10px] text-gray-400">{product.sold} units sold</p>
                  </div>
                  <span className="text-sm font-bold text-olive">{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
