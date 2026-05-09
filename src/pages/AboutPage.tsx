import { Link } from "react-router-dom";
import { Heart, Award, Users } from "lucide-react";
import ZoomPage, { ZoomSection } from "@/src/components/ui/ZoomPage";

export default function AboutPage() {
  return (
    <ZoomPage>
      {/* Section 1: Our Story */}
      <ZoomSection className="bg-natural-bg">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl font-display text-[#2D2D2D] mb-6">
            Our <span className="italic text-crimson">Story</span>
          </h1>
          <div className="h-1 w-20 bg-[#D4AF37] mx-auto mb-8" />
          <p className="text-gray-600 leading-relaxed text-lg">
            S&M Wardrobe was born from a passion for preserving the rich heritage of Bengali craftsmanship
            while making it accessible to the modern woman. Founded in Dhaka, we work directly with
            artisan communities across Bengal to bring you authentic, handcrafted garments that tell a
            story of tradition, skill, and timeless beauty.
          </p>
        </div>
      </ZoomSection>

      {/* Section 2: Heritage Gallery */}
      <ZoomSection className="bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-24">
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1544441892-794166f473e5?q=80&w=1200" 
                alt="Finest Fabrics" 
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="space-y-6 md:pl-12">
              <h2 className="text-4xl font-display text-[#2D2D2D]">The Art of <span className="italic text-crimson">Weaving</span></h2>
              <p className="text-gray-600 leading-relaxed">
                Bengal's weaving heritage dates back centuries, with techniques like Jamdani and Muslin once prized by royalty across the globe. At S&M Wardrobe, we are dedicated to keeping these intricate arts alive, ensuring that every thread carries the legacy of our ancestors.
              </p>
              <div className="flex gap-4">
                 <div className="w-1/2 p-4 bg-natural-bg rounded-2xl border border-warm-border">
                    <p className="text-2xl font-display text-crimson mb-1">100%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Handcrafted</p>
                 </div>
                 <div className="w-1/2 p-4 bg-natural-bg rounded-2xl border border-warm-border">
                    <p className="text-2xl font-display text-olive mb-1">50+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Artisan Families</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-row-reverse">
            <div className="md:order-2 relative group overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1620803525281-af87265a7e6d?q=80&w=1200" 
                alt="Contemporary Boutique" 
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="md:order-1 space-y-6 md:pr-12">
              <h2 className="text-4xl font-display text-[#2D2D2D]">Modern <span className="italic text-olive">Silhouette</span></h2>
              <p className="text-gray-600 leading-relaxed">
                While we honor tradition, we also embrace the evolving identity of the modern woman. Our collection features a blend of classic heritage pieces and contemporary fusion wear, designed to empower grace and confidence in every setting.
              </p>
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 text-crimson font-bold uppercase tracking-widest text-xs border-b-2 border-crimson pb-1 hover:text-olive hover:border-olive transition-all"
              >
                Discover the Collection
              </Link>
            </div>
          </div>
        </div>
      </ZoomSection>

      {/* Section 3: Values */}
      <ZoomSection className="bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-crimson/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="text-crimson" size={28} />
              </div>
              <h3 className="text-xl font-display text-[#2D2D2D]">Handcrafted with Love</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every piece in our collection is handcrafted by skilled artisans using techniques
                passed down through generations.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="text-olive" size={28} />
              </div>
              <h3 className="text-xl font-display text-[#2D2D2D]">Authentic Quality</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We source only the finest fabrics and materials, ensuring each garment meets
                our exacting standards of quality and authenticity.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="text-[#D4AF37]" size={28} />
              </div>
              <h3 className="text-xl font-display text-[#2D2D2D]">Supporting Artisans</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                By shopping with us, you directly support local artisan communities and help
                preserve centuries-old weaving traditions.
              </p>
            </div>
          </div>
        </div>
      </ZoomSection>

      {/* Section 3: CTA Banner */}
      <ZoomSection className="bg-[#8B0000]">
        <div className="text-center text-white px-4">
          <h2 className="text-3xl font-display mb-4">Ready to explore?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Discover our curated collection of traditional and fusion Bengali garments.
          </p>
          <Link
            to="/products"
            className="inline-block px-10 py-4 bg-white text-crimson font-bold tracking-widest uppercase hover:bg-[#D4AF37] hover:text-white transition-all rounded-full"
          >
            Shop Now
          </Link>
        </div>
      </ZoomSection>
    </ZoomPage>
  );
}
