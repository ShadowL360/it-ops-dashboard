
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, CalendarClock, CreditCard, Download, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BillingPage() {
  const { user } = useAuth();

  // Fetch subscription data
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription-details", user?.id],
    queryFn: async () => {
      // Simulação de dados
      return {
        id: "sub_123",
        plan: "Business",
        status: "active" as const,
        price: 499,
        interval: "month" as const,
        currentPeriodStart: "2025-03-03T00:00:00Z",
        currentPeriodEnd: "2025-05-03T23:59:59Z",
        paymentMethod: {
          type: "card",
          last4: "4242",
          brand: "visa",
          expMonth: 12,
          expYear: 2025,
        },
      };
    },
    enabled: !!user,
  });

  // Fetch invoices data
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["invoices-details", user?.id],
    queryFn: async () => {
      // Simulação de dados
      return [
        {
          id: "inv_20250401",
          amount: 499,
          status: "pending" as const,
          due_date: "2025-04-03",
          paid_at: null,
          pdf: "#",
          items: [
            { name: "Plano Business", amount: 499 }
          ]
        },
        {
          id: "inv_20250301",
          amount: 499,
          status: "paid" as const,
          due_date: "2025-03-03",
          paid_at: "2025-03-03T10:15:00Z",
          pdf: "#",
          items: [
            { name: "Plano Business", amount: 499 }
          ]
        },
        {
          id: "inv_20250201",
          amount: 499,
          status: "paid" as const,
          due_date: "2025-02-03",
          paid_at: "2025-02-03T09:30:00Z",
          pdf: "#",
          items: [
            { name: "Plano Business", amount: 499 }
          ]
        },
        {
          id: "inv_20250101",
          amount: 499,
          status: "paid" as const,
          due_date: "2025-01-03",
          paid_at: "2025-01-03T12:45:00Z",
          pdf: "#",
          items: [
            { name: "Plano Business", amount: 499 }
          ]
        },
      ];
    },
    enabled: !!user,
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const getBrandLogo = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "bi bi-credit-card-2-front";
      case "mastercard":
        return "bi bi-credit-card";
      case "amex":
        return "bi bi-credit-card-fill";
      default:
        return "bi bi-credit-card";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "failed":
        return "Falhou";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-success";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-destructive";
      default:
        return "text-gray-500";
    }
  };

  return (
    <DashboardShell title="Faturação">
      <div className="space-y-8">
        {/* Plano atual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Plano Atual</CardTitle>
            <CardDescription>Detalhes da sua assinatura</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSubscription ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            ) : (
              subscription && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold font-heading">Plano {subscription.plan}</h3>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {subscription.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mt-1">
                      {subscription.price.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}/{subscription.interval}
                    </p>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <CalendarClock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Período Atual</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(subscription.currentPeriodStart)} até {formatDate(subscription.currentPeriodEnd)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Método de Pagamento</p>
                          <p className="text-sm text-muted-foreground">
                            {subscription.paymentMethod.brand.toUpperCase()} terminado em {subscription.paymentMethod.last4}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-4">
            <Button>Alterar Plano</Button>
            <Button variant="outline">Atualizar Método de Pagamento</Button>
          </CardFooter>
        </Card>
        
        {/* Invoices section */}
        <div>
          <h2 className="text-xl font-bold font-heading mb-4">Histórico de Faturas</h2>
          
          {isLoadingInvoices ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : invoices && invoices.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Fatura
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Valor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      PDF
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(invoice.due_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        #{invoice.id.split('_')[1]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {invoice.amount.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex text-xs ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Download</span>
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-4 opacity-60" />
                <h3 className="font-medium mb-1">Nenhuma fatura encontrada</h3>
                <p className="text-sm text-muted-foreground">
                  Você não tem nenhuma fatura registrada no sistema.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Planos */}
        <div>
          <h2 className="text-xl font-bold font-heading mb-4">Planos Disponíveis</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Plano Básico */}
            <Card className={subscription?.plan === "Básico" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <CardDescription>Para pequenas empresas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">199€</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Monitorização básica
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Alertas por e-mail
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Relatórios mensais
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    5 servidores
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {subscription?.plan === "Básico" ? (
                  <Button disabled className="w-full">Plano Atual</Button>
                ) : (
                  <Button variant="outline" className="w-full">Selecionar</Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Plano Business */}
            <Card className={`${subscription?.plan === "Business" ? "border-primary border-2" : ""} relative`}>
              {subscription?.plan === "Business" && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-md rounded-tr-md">
                  Atual
                </div>
              )}
              {!subscription?.plan && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-md rounded-tr-md">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <CardDescription>Para empresas em crescimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">499€</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Tudo do plano Básico
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Automação de tarefas
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Alertas por SMS
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    15 servidores
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Chatbot básico
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {subscription?.plan === "Business" ? (
                  <Button disabled className="w-full">Plano Atual</Button>
                ) : (
                  <Button className="w-full">Selecionar</Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Plano Enterprise */}
            <Card className={subscription?.plan === "Enterprise" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Para grandes empresas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">999€</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Tudo do plano Business
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    IA para predição de falhas
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Suporte 24/7
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Servidores ilimitados
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-success mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Job scheduling avançado
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {subscription?.plan === "Enterprise" ? (
                  <Button disabled className="w-full">Plano Atual</Button>
                ) : (
                  <Button variant="outline" className="w-full">Contactar</Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
