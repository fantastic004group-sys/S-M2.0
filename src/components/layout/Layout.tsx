import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="h-screen overflow-hidden flex flex-col font-sans selection:bg-[#8B0000] selection:text-white">
      <Navbar />
      <main className="flex-grow overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
