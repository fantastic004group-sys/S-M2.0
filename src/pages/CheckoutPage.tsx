import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { OrderStatus } from "@/src/types";
import { ChevronRight, CheckCircle, Lock } from "lucide-react";
import ZoomPage, { ZoomSection } from "@/src/components/ui/ZoomPage";
import { motion } from "motion/react";

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash">("cod");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (cart.length === 0 && !orderPlaced) {
    return (
      <ZoomPage>
        <ZoomSection className="bg-natural-bg">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display text-[#2D2D2D]">Your bag is empty</h2>
            <Link to="/products" className="text-crimson font-bold uppercase tracking-widest text-sm border-b-2 border-crimson pb-1">
              Start Shopping
            </Link>
          </div>
        </ZoomSection>
      </ZoomPage>
    );
  }

  if (orderPlaced) {
    return (
      <ZoomPage>
        <ZoomSection className="bg-natural-bg">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-4xl font-display text-[#2D2D2D]">Order Placed!</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Thank you for shopping with S&M Wardrobe. Your order <span className="font-bold text-[#2D2D2D]">#{orderId.slice(-6).toUpperCase()}</span> has been placed successfully.
            </p>
            <Link
              to="/"
              className="inline-block px-10 py-4 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-opacity-90 rounded-full transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </ZoomSection>
      </ZoomPage>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!shippingAddress.trim()) return;
    if (paymentMethod === "bkash" && !transactionId.trim()) {
      alert("Please provide the bKash Transaction ID.");
      return;
    }

    setSubmitting(true);
    const deliveryCharge = 100; // Flat delivery charge as requested
    const bkashCharge = paymentMethod === "bkash" ? totalPrice * 0.02 : 0;
    const finalAmount = totalPrice + deliveryCharge + bkashCharge;

    try {
      const order = {
        userId: user.uid,
        items: cart,
        totalAmount: finalAmount,
        subtotal: totalPrice,
        deliveryCharge,
        bkashCharge,
        paymentMethod,
        transactionId: paymentMethod === "bkash" ? transactionId : null,
        status: OrderStatus.PLACED,
        shippingAddress: shippingAddress.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const docRef = await addDoc(collection(db, "orders"), order);
      setOrderId(docRef.id);
      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ZoomPage>
      {/* Section 1: Checkout Form (scrollable) */}
      <div className="min-h-full bg-natural-bg py-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-crimson transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/cart" className="hover:text-crimson transition-colors">Cart</Link>
            <ChevronRight size={14} />
            <span className="text-[#2D2D2D] font-semibold">Checkout</span>
          </nav>

          <h1 className="text-5xl font-display text-[#2D2D2D] mb-12">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-6">
                {!user && (
                  <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
                    <p className="text-amber-800 text-sm">
                      Please <Link to="/login" className="font-bold underline">sign in</Link> to place your order.
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Shipping Address *</label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="Full address including area, city, and postal code"
                    className="w-full px-5 py-3 border border-warm-border rounded-xl focus:ring-1 focus:ring-olive transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full px-5 py-3 border border-warm-border rounded-xl focus:ring-1 focus:ring-olive transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Any special instructions for delivery"
                    className="w-full px-5 py-3 border border-warm-border rounded-xl focus:ring-1 focus:ring-olive transition-all outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Payment Method *</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === "cod" ? "border-crimson bg-crimson/5" : "border-warm-border hover:border-gray-300"
                      }`}
                    >
                      <p className="font-bold text-[#2D2D2D]">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Regular delivery charges apply.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bkash")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        paymentMethod === "bkash" ? "border-crimson bg-crimson/5" : "border-warm-border hover:border-gray-300"
                      }`}
                    >
                      <p className="font-bold text-[#2D2D2D]">bKash (Online Payment)</p>
                      <p className="text-xs text-gray-500">2% cashout charge + Delivery.</p>
                    </button>
                  </div>

                  {paymentMethod === "bkash" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-6 bg-white border border-warm-border rounded-2xl space-y-4"
                    >
                      <div className="flex items-center gap-3 text-crimson mb-2">
                        <div className="w-10 h-10 bg-crimson/10 rounded-full flex items-center justify-center font-bold">৳</div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest">Instruction</p>
                          <p className="text-sm font-semibold">Send Money to: 01686235328</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Please use "Send Money" to the above number. Ensure you include the 2% cashout charge in your payment. Provide the Transaction ID (TrxID) below for verification.
                      </p>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Transaction ID (TrxID) *</label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          required={paymentMethod === "bkash"}
                          placeholder="8X7Y6Z..."
                          className="w-full px-5 py-3 border border-warm-border rounded-xl focus:ring-1 focus:ring-olive transition-all outline-none uppercase"
                        />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="p-4 bg-white rounded-xl text-sm text-gray-600 border border-warm-border">
                      <p className="font-semibold text-[#2D2D2D] mb-1">Cash on Delivery Info</p>
                      <p>Pay when your order is delivered to your doorstep.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white p-8 sticky top-32 border border-warm-border rounded-[2rem] shadow-sm">
                  <h3 className="text-2xl font-display text-[#2D2D2D] mb-6 uppercase tracking-tight">Order Summary</h3>

                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} x{item.quantity}</span>
                        <span className="font-semibold">&#2547; {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t border-warm-border pt-4 mb-6">
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>&#2547; {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Shipping</span>
                      <span>&#2547; 100</span>
                    </div>
                    {paymentMethod === "bkash" && (
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>bKash Charge (2%)</span>
                        <span>&#2547; {(totalPrice * 0.02).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="h-px bg-warm-border" />
                    <div className="flex justify-between text-[#2D2D2D] font-bold text-xl">
                      <span>Total</span>
                      <span>&#2547; {(totalPrice + 100 + (paymentMethod === "bkash" ? totalPrice * 0.02 : 0)).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !user}
                    className="w-full py-4 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-opacity-90 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-crimson/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock size={16} />
                    {submitting ? "Placing Order..." : "Place Order"}
                  </button>

                  <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest mt-4">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "bKash Online Payment"}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ZoomPage>
  );
}
