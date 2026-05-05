import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, BarChart3, LogOut, Home } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col min-h-screen">
      <div className="p-8 border-b border-white/5">
        <Link to="/admin" className="text-xl font-display font-bold text-[#D4AF37]">
          Admin <span className="text-white">Panel</span>
        </Link>
      </div>

      <nav className="flex-grow py-8 bg-[#1A1A1A]">
        <ul className="space-y-2 px-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#8B0000] text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
         <Link
           to="/"
           className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors"
         >
            <Home size={20} />
            <span>Back to Store</span>
         </Link>
         <button
           onClick={handleLogout}
           className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 transition-colors"
         >
            <LogOut size={20} />
            <span>Logout</span>
         </button>
      </div>
    </aside>
  );
}
