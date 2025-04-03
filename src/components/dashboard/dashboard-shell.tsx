
import { ReactNode } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
}

export const DashboardShell = ({
  children,
  title,
}: DashboardShellProps) => {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {title && (
            <h1 className="text-2xl font-heading font-semibold mb-6">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};
