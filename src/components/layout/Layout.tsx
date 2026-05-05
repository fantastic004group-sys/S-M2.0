import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={`flex flex-col font-sans selection:bg-[#8B0000] selection:text-white ${isHomePage ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isHomePage && <Footer />}
    </div>
  );
}
