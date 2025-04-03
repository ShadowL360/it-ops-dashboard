
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";
import { ServicesOverview } from "@/components/dashboard/services-overview";
import { BillingOverview } from "@/components/dashboard/billing-overview";
import { SupportTickets } from "@/components/dashboard/support-tickets";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, HelpCircle } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch subscription data
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      // Simulação de dados. Substitua por chamadas reais ao Supabase
      return {
        id: "sub_123",
        plan: "Business",
        status: "active" as const,
        price: 499,
        nextBilling: "2025-05-03",
      };
    },
    enabled: !!user,
  });

  // Fetch services data
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", user?.id],
    queryFn: async () => {
      // Simulação de dados
      return [
        {
          id: "srv_1",
          name: "Monitorização",
          description: "Monitorização 24/7 de servidores e aplicações",
          status: "active",
        },
        {
          id: "srv_2",
          name: "Automatização",
          description: "Scripts automatizados para tarefas recorrentes",
          status: "active",
        },
        {
          id: "srv_3",
          name: "Chatbot de Atendimento",
          description: "Chatbot para atendimento ao cliente",
          status: "paused",
        },
        {
          id: "srv_4",
          name: "Job Scheduling",
          description: "Agendamento de tarefas e processos",
          status: "active",
        },
      ];
    },
    enabled: !!user,
  });

  // Fetch invoices data
  const { data: invoicesData, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: async () => {
      // Simulação de dados
      return [
        {
          id: "inv_20240301",
          amount: 499,
          status: "paid" as const,
          due_date: "2025-03-01",
        },
        {
          id: "inv_20240201",
          amount: 499,
          status: "paid" as const,
          due_date: "2025-02-01",
        },
        {
          id: "inv_20240101",
          amount: 499,
          status: "paid" as const,
          due_date: "2025-01-01",
        },
      ];
    },
    enabled: !!user,
  });

  // Fetch support tickets
  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: async () => {
      // Simulação de dados
      return [
        {
          id: "ticket_123",
          user_id: user?.id || "",
          title: "Problema com chatbot",
          description: "O chatbot não está respondendo corretamente às perguntas sobre horários de atendimento.",
          status: "open" as const,
          priority: "medium" as const,
          created_at: "2025-04-01T10:30:00Z",
          updated_at: "2025-04-01T10:30:00Z",
        },
      ];
    },
    enabled: !!user,
  });

  return (
    <DashboardShell title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid gap-6">
            {isLoadingSubscription ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              subscriptionData && (
                <SubscriptionCard
                  plan={subscriptionData.plan}
                  status={subscriptionData.status}
                  nextBilling={subscriptionData.nextBilling}
                  price={subscriptionData.price}
                />
              )
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats Cards */}
              <div className="card-stats">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Servidores</h3>
                  <span className="text-sm text-muted-foreground">15 em uso</span>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">15/15</p>
                  <p className="text-sm text-muted-foreground">Incluídos no plano</p>
                </div>
              </div>

              <div className="card-stats">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Disponibilidade</h3>
                  <span className="text-sm text-success">Online</span>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">99.9%</p>
                  <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                </div>
              </div>
            </div>

            {isLoadingServices ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              servicesData && <ServicesOverview services={servicesData} />
            )}
          </div>
        </div>

        <div className="space-y-6">
          {isLoadingInvoices ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            invoicesData && <BillingOverview invoices={invoicesData} />
          )}

          {isLoadingTickets ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            ticketsData && <SupportTickets tickets={ticketsData} />
          )}

          <div className="card-stats flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Precisa de ajuda?</h3>
              <p className="text-sm text-muted-foreground">Nossa equipe está disponível 24/7</p>
            </div>
            <a href="/dashboard/support" className="ml-auto flex items-center text-primary text-sm hover:underline">
              Contactar suporte <ArrowUpRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
