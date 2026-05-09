import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-[85vh] overflow-hidden bg-natural-bg">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#5a5a40]/10 z-10" />
        <img
          src="https://5.imimg.com/data5/TU/RA/MY-10522266/lt-fabrics-nitya-salwar-kameez.jpeg"
          alt="Bengali Boutique"
          className="w-full h-full object-cover object-center scale-105"
        />
      </div>

      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-3 py-1 bg-olive text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-6 rounded-full">
            Artisanal Heritage • Dhaka
          </span>
          <h1 className="text-6xl md:text-8xl font-display text-white drop-shadow-lg leading-tight mb-6">
            Timeless <br />
            <span className="italic text-[#f5f5f0]/80">Elegance</span>
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md max-w-lg mb-10 font-sans tracking-wide font-light">
            Curating the finest Bengali garments, from traditional Jamdani to modern fusion silhouettes. Handcrafted for the woman of grace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="px-10 py-4 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-opacity-90 rounded-full transition-all flex items-center justify-center gap-2 group shadow-xl"
            >
              Shop Collection
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white/20 transition-all text-center"
            >
              Our Story
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative patterns */}
      <div className="absolute bottom-10 right-10 z-20 opacity-20 hidden lg:block">
        <div className="w-64 h-64 border-2 border-[#D4AF37] rounded-full flex items-center justify-center animate-spin-slow">
           <span className="text-[#D4AF37] font-display text-lg italic uppercase tracking-[1em]">Handcrafted • Artisan • Quality</span>
        </div>
      </div>
    </section>
  );
}
