import React from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { collection, getDocs, query, orderBy, updateDoc, doc, writeBatch, increment } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Order, OrderStatus } from "@/src/types";
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from "lucide-react";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: typeof Package }> = {
  [OrderStatus.PLACED]: { label: "Placed", color: "bg-blue-100 text-blue-700", icon: Clock },
  [OrderStatus.SHIPPED]: { label: "Shipped", color: "bg-orange-100 text-orange-700", icon: Truck },
  [OrderStatus.DELIVERED]: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  [OrderStatus.CANCELLED]: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function OrdersManager() {
  const [orders, setOrders] = React.useState<(Order & { id: string })[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState<(Order & { id: string }) | null>(null);
  const [updating, setUpdating] = React.useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as (Order & { id: string })[];
      setOrders(items);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) return;

      const oldStatus = orderToUpdate.status;

      // Only perform stock updates if moving to or from CANCELLED status
      if (newStatus === OrderStatus.CANCELLED && oldStatus !== OrderStatus.CANCELLED) {
        const batch = writeBatch(db);
        // Update order status
        batch.update(doc(db, "orders", orderId), {
          status: newStatus,
          updatedAt: Date.now(),
        });
        // Restore stock
        orderToUpdate.items.forEach(item => {
          const productRef = doc(db, "products", item.id);
          batch.update(productRef, {
            stock: increment(item.quantity)
          });
        });
        await batch.commit();
      } else if (oldStatus === OrderStatus.CANCELLED && newStatus !== OrderStatus.CANCELLED) {
        // Reduct stock again if un-cancelling
        const batch = writeBatch(db);
        batch.update(doc(db, "orders", orderId), {
          status: newStatus,
          updatedAt: Date.now(),
        });
        orderToUpdate.items.forEach(item => {
          const productRef = doc(db, "products", item.id);
          batch.update(productRef, {
            stock: increment(-item.quantity)
          });
        });
        await batch.commit();
      } else {
        // Normal status update without stock implications
        await updateDoc(doc(db, "orders", orderId), {
          status: newStatus,
          updatedAt: Date.now(),
        });
      }

      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus, updatedAt: Date.now() } : o))
      );
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      <AdminSidebar />
      <main className="flex-grow p-10 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-display text-[#2D2D2D]">
            Order <span className="italic text-crimson">Management</span>
          </h1>
          <p className="text-gray-500 mt-2">View and manage customer orders.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "New Orders", count: orders.filter(o => o.status === OrderStatus.PLACED).length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Shipped", count: orders.filter(o => o.status === OrderStatus.SHIPPED).length, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Delivered", count: orders.filter(o => o.status === OrderStatus.DELIVERED).length, color: "text-green-600", bg: "bg-green-50" },
            { label: "Cancelled", count: orders.filter(o => o.status === OrderStatus.CANCELLED).length, color: "text-red-600", bg: "bg-red-50" },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} p-6 rounded-2xl border border-warm-border`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-display text-crimson">
                    Order <span className="italic">#{selectedOrder.id.slice(-6).toUpperCase()}</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-crimson text-2xl">&times;</button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Items</p>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-warm-border text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-semibold">&#2547; {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-crimson">&#2547; {selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Shipping Details</p>
                  <p className="text-sm text-gray-700">{selectedOrder.shippingAddress}</p>
                  <p className="text-sm font-semibold text-[#2D2D2D] mt-1">Phone: {selectedOrder.phone}</p>
                  {selectedOrder.notes && (
                    <p className="text-xs text-gray-500 italic mt-1">Note: {selectedOrder.notes}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Payment Information</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    selectedOrder.paymentMethod === "bkash" ? "bg-crimson/10 text-crimson" : "bg-gray-100 text-gray-600"
                  }`}>
                    {selectedOrder.paymentMethod === "bkash" ? "bKash Online" : "Cash on Delivery"}
                  </div>
                  {selectedOrder.paymentMethod === "bkash" && selectedOrder.transactionId && (
                    <p className="text-sm font-mono font-bold text-gray-700 mt-2 flex items-center gap-2">
                       TrxID: <span className="bg-gray-100 px-2 py-0.5 rounded">{selectedOrder.transactionId}</span>
                    </p>
                  )}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 flex justify-between">
                      Subtotal: <span>&#2547; {selectedOrder.subtotal?.toLocaleString() || (selectedOrder.totalAmount - (selectedOrder.deliveryCharge || 100)).toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex justify-between">
                      Delivery: <span>&#2547; {selectedOrder.deliveryCharge?.toLocaleString() || "100"}</span>
                    </p>
                    {selectedOrder.bkashCharge && (
                      <p className="text-xs text-gray-500 flex justify-between">
                        bKash Fee (2%): <span>&#2547; {selectedOrder.bkashCharge.toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Update Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.values(OrderStatus).map(status => (
                      <button
                        key={status}
                        onClick={() => { handleStatusUpdate(selectedOrder.id, status); setSelectedOrder({ ...selectedOrder, status }); }}
                        disabled={updating === selectedOrder.id}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full transition-all ${
                          selectedOrder.status === status
                            ? STATUS_CONFIG[status].color + " ring-2 ring-offset-1 ring-gray-300"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {STATUS_CONFIG[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-warm-border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-natural-bg/30 border-b border-warm-border">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Items</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 italic">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 italic">No orders yet. Orders will appear here when customers place them.</td>
                </tr>
              ) : orders.map(order => {
                const config = STATUS_CONFIG[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm font-semibold text-[#2D2D2D]">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="p-4 text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                    <td className="p-4 font-bold text-crimson">&#2547; {order.totalAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:text-olive hover:bg-gray-100 rounded-lg transition-all text-gray-400"
                        title="View order details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
