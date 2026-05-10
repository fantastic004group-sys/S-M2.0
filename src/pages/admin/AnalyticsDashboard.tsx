import React, { useEffect, useState } from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, ShoppingCart, Users, Loader2 } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Order, OrderStatus, Product } from "@/src/types";

export default function AnalyticsDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const productsQuery = query(collection(db, "products"));

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
      setLoading(false);
    });

    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  // Metrics Calculations
  const nonCancelledOrders = orders.filter(o => o.status !== OrderStatus.CANCELLED);
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = nonCancelledOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const uniqueCustomers = new Set(orders.map(o => o.userId)).size;

  // Weekly Revenue Data
  const weeklyData = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayRevenue = nonCancelledOrders
      .filter(o => new Date(o.createdAt).toDateString() === date.toDateString())
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const dayOrders = nonCancelledOrders
      .filter(o => new Date(o.createdAt).toDateString() === date.toDateString())
      .length;
    return { name: dayName, revenue: dayRevenue, orders: dayOrders };
  });

  // Sales by Category
  const categoryCount: Record<string, number> = {};
  nonCancelledOrders.forEach(order => {
    order.items.forEach(item => {
      const cat = item.category || "Other";
      categoryCount[cat] = (categoryCount[cat] || 0) + item.quantity;
    });
  });

  const totalItemsSold = Object.values(categoryCount).reduce((a, b) => a + b, 0);
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value: totalItemsSold > 0 ? Math.round((value / totalItemsSold) * 100) : 0
  })).sort((a,b) => b.value - a.value).slice(0, 4);

  const COLORS = ["#911c1c", "#5A5A40", "#D4AF37", "#2D2D2D"];

  // Monthly Data (Mocked since we only have recent orders usually)
  const monthlyVisitors = [
    { month: "Jan", visitors: 2400 },
    { month: "Feb", visitors: 1398 },
    { month: "Mar", visitors: 9800 },
    { month: "Apr", visitors: 3908 },
    { month: "May", visitors: 4800 },
    { month: "Jun", visitors: 3800 },
  ];

  // Top Selling Products
  const productSalesMap: Record<string, { name: string; sold: number; revenue: number }> = {};
  nonCancelledOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSalesMap[item.id]) {
        productSalesMap[item.id] = { name: item.name, sold: 0, revenue: 0 };
      }
      productSalesMap[item.id].sold += item.quantity;
      productSalesMap[item.id].revenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F5F5F0]">
        <AdminSidebar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin text-crimson" size={40} />
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Page Views", value: "12,847", change: "+18%", icon: Eye, color: "bg-blue-500" },
    { label: "Conversion Rate", value: totalOrders > 0 ? `${((totalOrders/100)*100).toFixed(1)}%` : "0%", change: "+0.5%", icon: ShoppingCart, color: "bg-green-500" },
    { label: "Avg. Order Value", value: `৳ ${avgOrderValue.toLocaleString()}`, change: "+8%", icon: TrendingUp, color: "bg-purple-500" },
    { label: "New Customers", value: uniqueCustomers.toString(), change: "+22%", icon: Users, color: "bg-orange-500" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      <AdminSidebar />
      <main className="flex-grow p-10 overflow-y-auto">
        <h1 className="text-4xl font-display text-[#2D2D2D] mb-10">
          Store <span className="italic text-crimson">Analytics</span>
        </h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {metrics.map(metric => (
            <div key={metric.label} className="bg-white p-6 rounded-2xl border border-warm-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`${metric.color} p-3 rounded-lg text-white`}>
                  <metric.icon size={20} />
                </div>
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
                <AreaChart data={weeklyData}>
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
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {categoryData.map((cat, idx) => (
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
                <BarChart data={monthlyVisitors}>
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
              {topProducts.length > 0 ? (
                topProducts.map((product, idx) => (
                  <div key={product.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="w-8 h-8 bg-crimson/10 rounded-full flex items-center justify-center text-crimson font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-[#2D2D2D]">{product.name}</p>
                      <p className="text-[10px] text-gray-400">{product.sold} units sold</p>
                    </div>
                    <span className="text-sm font-bold text-olive">৳ {product.revenue.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No sales recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
