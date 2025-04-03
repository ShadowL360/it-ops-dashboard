
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Invoice {
  id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  due_date: string;
}

interface BillingOverviewProps {
  invoices: Invoice[];
}

export const BillingOverview = ({ invoices }: BillingOverviewProps) => {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-heading">Faturação Recente</CardTitle>
        <CardDescription>Histórico das suas últimas faturas</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
              <p className="text-muted-foreground">Sem faturas disponíveis</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Fatura #{invoice.id.substring(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">Data: {formatDate(invoice.due_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                  <span className="font-medium">
                    {invoice.amount.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
