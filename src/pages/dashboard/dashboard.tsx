
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SupportTicketForm } from "@/components/dashboard/support-ticket-form";
import { SupportTickets } from "@/components/dashboard/support-tickets";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch support tickets
  const { data: ticketsData, isLoading: isLoadingTickets, refetch: refetchTickets } = useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar tickets:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  return (
    <DashboardShell title="Dashboard">
      <div className="grid grid-cols-1 gap-6">
        <Alert>
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Bem-vindo ao seu painel</AlertTitle>
          <AlertDescription>
            Utilize este painel para fazer novos pedidos de suporte e acompanhar o estado dos seus pedidos atuais.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-stats md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Criar Novo Pedido</h2>
            <SupportTicketForm onSuccess={() => refetchTickets()} />
          </div>
        </div>

        {isLoadingTickets ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          ticketsData && <SupportTickets tickets={ticketsData} />
        )}
      </div>
    </DashboardShell>
  );
}
