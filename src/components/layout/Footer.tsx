import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-display font-bold text-[#D4AF37] mb-6 block">
            S&M <span className="text-white">Wardrobe</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Preserving the heritage of Bengali craftsmanship through contemporary design. Every thread tells a story of tradition.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#D4AF37] transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-6 text-[#D4AF37]">Explore</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/products" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/category/saree" className="hover:text-white transition-colors">Saree Collection</Link></li>
            <li><Link to="/category/salwar" className="hover:text-white transition-colors">Salwar Kameez</Link></li>
            <li><Link to="/category/bridal" className="hover:text-white transition-colors">Bridal Wear</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-6 text-[#D4AF37]">Support</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-6 text-[#D4AF37]">Visit Us</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex gap-3"><MapPin size={18} className="text-[#D4AF37] shrink-0" /> <span>Banani Road 11, Dhaka, Bangladesh</span></li>
            <li className="flex gap-3"><Phone size={18} className="text-[#D4AF37] shrink-0" /> <span>+880 1234-567890</span></li>
            <li className="flex gap-3"><Mail size={18} className="text-[#D4AF37] shrink-0" /> <span>hello@smwardrobe.com</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/10 flex flex-col md:row items-center justify-between gap-4 text-xs text-gray-500 uppercase tracking-widest">
        <p>© 2024 S&M Wardrobe. All Rights Reserved.</p>
        <div className="flex gap-6">
          <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
