import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 px-4">
      <h1 className="text-8xl font-display text-crimson">404</h1>
      <h2 className="text-3xl font-display text-[#2D2D2D]">Page Not Found</h2>
      <p className="text-gray-500 max-w-md text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-opacity-90 transition-all rounded-full flex items-center gap-2"
      >
        <Home size={18} />
        Back to Home
      </Link>
    </div>
  );
}
