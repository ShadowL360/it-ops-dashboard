
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import {
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Ticket,
  User,
  MessageSquare
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkIfUserIsAdmin } from "@/lib/supabase";

export const DashboardSidebar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user) {
      checkIfUserIsAdmin(user.id).then(result => {
        setIsAdmin(result);
      });
    }
  }, [user]);
  
  const regularUserMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Perfil",
      icon: User,
      path: "/dashboard/profile",
    },
    {
      title: "Suporte",
      icon: Ticket,
      path: "/dashboard/support",
    },
  ];
  
  const adminMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Perfil",
      icon: User,
      path: "/dashboard/profile",
    },
    {
      title: "Serviços",
      icon: Ticket,
      path: "/dashboard/services",
    },
    {
      title: "Faturação",
      icon: Ticket,
      path: "/dashboard/billing",
    },
    {
      title: "Pedidos de Suporte",
      icon: MessageSquare,
      path: "/admin/support-tickets",
    },
    {
      title: "Suporte",
      icon: Ticket,
      path: "/dashboard/support",
    },
  ];
  
  const menuItems = isAdmin ? adminMenuItems : regularUserMenuItems;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex flex-col bg-primary text-white h-screen w-64 py-6 px-4">
      <div className="px-2 mb-8">
        <Logo variant="dashboard" />
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-white/20 font-medium"
                    : "hover:bg-white/10"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-6 border-t border-white/20 mt-6">
        <ul className="space-y-1">
          <li>
            <Link
              to="/dashboard/help"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-white/10"
            >
              <HelpCircle className="h-5 w-5" />
              Ajuda & Recursos
            </Link>
          </li>
          <li>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-white/10 text-left"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
