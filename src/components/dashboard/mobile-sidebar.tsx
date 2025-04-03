
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  Box,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Ticket,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const MobileSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Serviços",
      icon: Box,
      path: "/dashboard/services",
    },
    {
      title: "Faturação",
      icon: CreditCard,
      path: "/dashboard/billing",
    },
    {
      title: "Suporte",
      icon: Ticket,
      path: "/dashboard/support",
    },
    {
      title: "Perfil",
      icon: User,
      path: "/dashboard/profile",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-primary text-white">
        <SheetHeader>
          <SheetTitle className="text-white">
            <Logo variant="dashboard" className="mb-6" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
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
          ))}
          <Link
            to="/dashboard/help"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-white/10"
          >
            <HelpCircle className="h-5 w-5" />
            Ajuda & Recursos
          </Link>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-white/10 text-left mt-6"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
