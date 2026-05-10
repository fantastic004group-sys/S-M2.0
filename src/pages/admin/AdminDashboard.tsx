import React, { useEffect, useState } from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ShoppingBag, Users, DollarSign, Package, AlertCircle, Loader2 } from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Order, OrderStatus, Product, PageView } from "@/src/types";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageViewsCount, setPageViewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const productsQuery = query(collection(db, "products"));
    const viewsQuery = query(collection(db, "page_views"), limit(1000)); // Just for a count preview

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
      setLoading(false);
    });

    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
    });

    const unsubscribeViews = onSnapshot(viewsQuery, (snapshot) => {
      // For the dashboard preview, we just need a count
      // In a real app we might use a dedicated counter document
      setPageViewsCount(snapshot.size);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeViews();
    };
  }, []);

  const totalRevenue = orders
    .filter(o => o.status !== OrderStatus.CANCELLED)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrders = orders.length;
  const activeCustomers = new Set(orders.map(o => o.userId)).size;
  const pendingShipments = orders.filter(o => o.status === OrderStatus.PLACED).length;

  // Process sales data for chart (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayRevenue = orders
      .filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === date.toDateString() && o.status !== OrderStatus.CANCELLED;
      })
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return { name: dayName, sales: dayRevenue };
  });

  const lowStockProducts = products.filter(p => p.stock <= 5);
  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#FDF5E6]">
        <AdminSidebar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin text-crimson" size={40} />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Revenue", value: `৳ ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-blue-500" },
    { label: "Active Customers", value: activeCustomers.toString(), icon: Users, color: "bg-green-500" },
    { label: "Pending Shipments", value: pendingShipments.toString(), icon: Package, color: "bg-orange-500" },
    { label: "Page Views", value: pageViewsCount.toLocaleString(), icon: TrendingUp, color: "bg-crimson" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDF5E6]">
      <AdminSidebar />
      <main className="flex-grow p-10 overflow-y-auto">
        <h1 className="text-4xl font-display text-[#2F2F2F] mb-10">Boutique <span className="italic text-[#8B0000]">Performance</span></h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-sm border border-[#D4AF37]/20 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon size={20} />
                </div>
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
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Real-time Data</div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
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
                 {lowStockProducts.length > 0 ? (
                    lowStockProducts.map(p => (
                      <div key={p.id} className="flex gap-4 p-4 bg-orange-50 border-l-4 border-orange-500">
                        <AlertCircle className="text-orange-500 shrink-0" size={20} />
                        <div>
                           <p className="text-sm font-bold text-orange-800">Low Stock Warning</p>
                           <p className="text-xs text-orange-700 mt-1">"{p.name}" is down to {p.stock} units.</p>
                        </div>
                      </div>
                    ))
                 ) : (
                    <p className="text-xs text-gray-400 italic">No low stock alerts.</p>
                 )}

                 {orders.filter(o => o.status === OrderStatus.PLACED).slice(0, 3).map(o => (
                   <div key={o.id} className="flex gap-4 p-4 bg-red-50 border-l-4 border-red-500">
                      <AlertCircle className="text-red-500 shrink-0" size={20} />
                      <div>
                         <p className="text-sm font-bold text-red-800">New Order</p>
                         <p className="text-xs text-red-700 mt-1">Order #{o.id.slice(-6).toUpperCase()} requires attention.</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
