import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import ZoomPage, { ZoomSection } from "@/src/components/ui/ZoomPage";

export default function NotFoundPage() {
  return (
    <ZoomPage>
      <ZoomSection className="bg-natural-bg">
        <div className="text-center space-y-6">
          <h1 className="text-8xl font-display text-crimson">404</h1>
          <h2 className="text-3xl font-display text-[#2D2D2D]">Page Not Found</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-opacity-90 transition-all rounded-full"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </ZoomSection>
    </ZoomPage>
  );
}
