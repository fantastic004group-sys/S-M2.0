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

      {/* Section 2: Values */}
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
