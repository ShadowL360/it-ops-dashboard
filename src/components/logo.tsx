
import React from "react";
import { HddNetwork } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "default" | "dashboard";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = "default", className = "" }) => {
  return (
    <Link
      to="/"
      className={`flex items-center space-x-2 ${variant === "dashboard" ? "text-white" : "text-primary"} font-heading font-bold ${className}`}
    >
      <HddNetwork className="h-6 w-6" />
      <span className="text-xl">IT Operação</span>
    </Link>
  );
};
