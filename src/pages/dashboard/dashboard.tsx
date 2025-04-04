
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
      if (!user) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar assinatura:", error);
        return null;
      }

      return data ? {
        id: data.id,
        plan: data.plan_name,
        status: data.status,
        price: data.price,
        nextBilling: new Date(data.current_period_end).toISOString().split('T')[0]
      } : null;
    },
    enabled: !!user,
  });

  // Fetch services data
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao buscar serviços:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Fetch invoices data
  const { data: invoicesData, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Erro ao buscar faturas:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Fetch support tickets
  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "open")
        .limit(3);

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
                  <span className="text-sm text-muted-foreground">
                    {servicesData?.length || 0} em uso
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">
                    {servicesData?.length || 0}/
                    {subscriptionData?.plan === "Business" ? 15 : 
                     subscriptionData?.plan === "Premium" ? 25 : 5}
                  </p>
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
