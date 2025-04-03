// Sidebar.jsx
import React from "react";
import { LogOut, Briefcase, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/",
    },
    {
      label: "Carteiras",
      icon: <Briefcase size={18} />,
      path: "/carteiras",
    },
  ];

  return (
    <aside className="bg-gray-900 text-white h-screen w-64 flex flex-col justify-between">
      <div>
        <div className="px-6 py-4 text-xl font-semibold tracking-tight border-b border-gray-700">
          Investimentos
        </div>
        <nav className="flex flex-col mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition ${
                location.pathname === item.path ? "bg-gray-800" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-6 py-4 hover:bg-red-700 transition text-red-400 border-t border-gray-700"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
};

export default Sidebar;
