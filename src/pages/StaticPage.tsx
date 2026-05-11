import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ZoomPage from "@/src/components/ui/ZoomPage";

interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

function StaticPageLayout({ title, children }: StaticPageProps) {
  return (
    <ZoomPage>
      {/* Single scrollable section for static content */}
      <div className="min-h-full bg-natural-bg py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-crimson transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#2D2D2D] font-semibold">{title}</span>
          </nav>
          <h1 className="text-4xl font-display text-[#2D2D2D] mb-8">{title}</h1>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
            {children}
          </div>
        </div>
      </div>
    </ZoomPage>
  );
}

export function ContactPage() {
  return (
    <StaticPageLayout title="Contact Us">
      <p>We would love to hear from you! Reach out through any of the following channels:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mt-6">
        <div className="p-6 bg-white border border-warm-border rounded-2xl">
          <h3 className="font-display text-lg text-[#2D2D2D] mb-3">Visit Our Store</h3>
          <p className="text-sm text-gray-500">Banani Road 11, Dhaka, Bangladesh</p>
          <p className="text-sm text-gray-500 mt-1">Open: Sat-Thu, 10am - 8pm</p>
        </div>
        <div className="p-6 bg-white border border-warm-border rounded-2xl">
          <h3 className="font-display text-lg text-[#2D2D2D] mb-3">Get in Touch</h3>
          <p className="text-sm text-gray-500">Phone: +8801686235328</p>
          <p className="text-sm text-gray-500 mt-1">Email: fantastic.004.group@gmail.com</p>
        </div>
      </div>
    </StaticPageLayout>
  );
}

export function ShippingPage() {
  return (
    <StaticPageLayout title="Shipping & Returns">
      <h2 className="text-xl font-display text-[#2D2D2D] mt-0">Shipping Policy</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Free shipping on orders above &#2547;5,000</li>
        <li>Standard delivery within Dhaka: 2-3 business days</li>
        <li>Outside Dhaka: 5-7 business days</li>
        <li>All items are carefully packaged with heritage-quality wrapping</li>
      </ul>

      <h2 className="text-xl font-display text-[#2D2D2D]">Returns Policy</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>7-day easy return policy from date of delivery</li>
        <li>Items must be unused, unwashed, and in original packaging</li>
        <li>Customized or made-to-order items are non-returnable</li>
        <li>Refund will be processed within 5-7 business days</li>
      </ul>
    </StaticPageLayout>
  );
}

export function FAQPage() {
  const faqs = [
    { q: "How do I place an order?", a: "Browse our collection, add items to your cart, and proceed to checkout. You can pay via Cash on Delivery." },
    { q: "Are your products authentic handloom?", a: "Yes, every piece is sourced directly from artisan communities in Bengal. We guarantee the authenticity of all our products." },
    { q: "Can I return or exchange an item?", a: "We offer a 7-day return policy. Items must be unused and in original packaging. See our Shipping & Returns page for full details." },
    { q: "Do you ship outside Bangladesh?", a: "Currently we ship within Bangladesh only. International shipping is coming soon." },
    { q: "How can I track my order?", a: "Once your order is shipped, you will receive a tracking number via SMS and email." },
  ];

  return (
    <StaticPageLayout title="Frequently Asked Questions">
      <div className="space-y-6 not-prose">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-6 bg-white border border-warm-border rounded-2xl">
            <h3 className="font-display text-lg text-[#2D2D2D] mb-2">{faq.q}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}

export function SizeGuidePage() {
  return (
    <StaticPageLayout title="Size Guide">
      <p>Our garments are available in a range of sizes. Please refer to the measurements below to find your perfect fit.</p>
      <div className="not-prose overflow-x-auto mt-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-natural-bg">
              <th className="p-3 text-left font-bold text-[10px] uppercase tracking-widest text-gray-500 border border-warm-border">Size</th>
              <th className="p-3 text-left font-bold text-[10px] uppercase tracking-widest text-gray-500 border border-warm-border">Bust (in)</th>
              <th className="p-3 text-left font-bold text-[10px] uppercase tracking-widest text-gray-500 border border-warm-border">Waist (in)</th>
              <th className="p-3 text-left font-bold text-[10px] uppercase tracking-widest text-gray-500 border border-warm-border">Hip (in)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["XS", "32", "26", "35"],
              ["S", "34", "28", "37"],
              ["M", "36", "30", "39"],
              ["L", "38", "32", "41"],
              ["XL", "40", "34", "43"],
              ["XXL", "42", "36", "45"],
            ].map(([size, bust, waist, hip]) => (
              <tr key={size} className="hover:bg-gray-50">
                <td className="p-3 font-semibold text-[#2D2D2D] border border-warm-border">{size}</td>
                <td className="p-3 text-gray-600 border border-warm-border">{bust}</td>
                <td className="p-3 text-gray-600 border border-warm-border">{waist}</td>
                <td className="p-3 text-gray-600 border border-warm-border">{hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm">For sarees, one-size-fits-most applies. Blouse pieces are included and can be tailored to your measurements.</p>
    </StaticPageLayout>
  );
}

export function TermsPage() {
  return (
    <StaticPageLayout title="Terms of Service">
      <p>Last updated: January 2024</p>
      <h2 className="text-xl font-display text-[#2D2D2D]">1. General Terms</h2>
      <p>By accessing and using S&M Wardrobe, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
      <h2 className="text-xl font-display text-[#2D2D2D]">2. Products & Pricing</h2>
      <p>All product descriptions and prices are subject to change without notice. We strive to display accurate colors and details, but variations may occur due to photography and screen settings.</p>
      <h2 className="text-xl font-display text-[#2D2D2D]">3. Orders & Payment</h2>
      <p>We reserve the right to refuse or cancel any order. Cash on Delivery is the primary payment method. Orders are confirmed via email and SMS.</p>
      <h2 className="text-xl font-display text-[#2D2D2D]">4. Intellectual Property</h2>
      <p>All content on this site, including designs, text, and images, is the property of S&M Wardrobe and may not be reproduced without permission.</p>
    </StaticPageLayout>
  );
}

export function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p>Last updated: January 2024</p>
      <h2 className="text-xl font-display text-[#2D2D2D]">Information We Collect</h2>
      <p>We collect personal information you provide when creating an account, placing orders, or contacting us, including your name, email, phone number, and shipping address.</p>
      <h2 className="text-xl font-display text-[#2D2D2D]">How We Use Your Information</h2>
      <p>Your information is used to process orders, communicate with you, improve our services, and provide personalized recommendations. We do not sell your personal data to third parties.</p>
      <h2 className="text-xl font-display text-[#2D2D2D]">Data Security</h2>
      <p>We implement industry-standard security measures to protect your data. Your account is secured through Google Authentication, and all data transmissions are encrypted.</p>
      <h2 className="text-xl font-display text-[#2D2D2D]">Contact</h2>
      <p>For privacy-related inquiries, please contact us at hello@smwardrobe.com.</p>
    </StaticPageLayout>
  );
}
