
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CheckCircle, Clock } from "lucide-react";

interface SubscriptionCardProps {
  plan: string;
  status: "active" | "canceled" | "past_due";
  nextBilling: string;
  price: number;
}

export const SubscriptionCard = ({
  plan,
  status,
  nextBilling,
  price,
}: SubscriptionCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getBadgeVariant = () => {
    switch (status) {
      case "active":
        return "success";
      case "canceled":
        return "destructive";
      case "past_due":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Ativo";
      case "canceled":
        return "Cancelado";
      case "past_due":
        return "Pagamento Pendente";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-heading">Plano {plan}</CardTitle>
          <Badge variant={getBadgeVariant() as any}>{getStatusText()}</Badge>
        </div>
        <CardDescription>Gerencie sua assinatura atual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">Valor Mensal</span>
            </div>
            <div className="font-medium">{price.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Próximo Pagamento</span>
            </div>
            <div className="font-medium">{formatDate(nextBilling)}</div>
          </div>

          {status === "active" && (
            <div className="mt-4 flex justify-end">
              <button className="btn-outline text-sm">Alterar Plano</button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
