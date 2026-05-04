import React, { useEffect, useState } from "react";
import { useCart } from "@/src/context/CartContext";
import { Product } from "@/src/types";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function RecommendationSection() {
  const { cart } = useCart();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecommendations() {
      if (cart.length === 0) return;
      
      setLoading(true);
      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems: cart.map(i => i.name), history: [] }),
        });
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [cart]);

  if (!recommendations && !loading) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-12">
          <Sparkles className="text-[#D4AF37]" size={28} />
          <h2 className="text-3xl font-display text-[#2F2F2F]">
            AI Curated <span className="italic text-[#8B0000]">For You</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex gap-8 overflow-x-auto pb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="min-w-[280px] aspect-[3/4] bg-gray-50 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* In a real app we'd map this to real products. For now showing themes */}
             {recommendations?.recommendations?.map((rec: any, idx: number) => (
               <div key={idx} className="p-8 bg-[#FDF5E6] border border-[#D4AF37]/20 rounded-sm">
                  <h4 className="font-display text-xl text-[#8B0000] mb-2">{rec.style || rec}</h4>
                  <p className="text-sm text-gray-600 mb-4">{rec.reason || "Perfect match for your current selection."}</p>
                  <button className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37] pb-1">
                    See Collection
                  </button>
               </div>
             ))}
          </div>
        )}
      </div>
    </section>
  );
}
