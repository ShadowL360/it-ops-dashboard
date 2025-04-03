
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportTicket } from "@/lib/supabase";

interface SupportTicketsProps {
  tickets: SupportTicket[];
}

export const SupportTickets = ({ tickets }: SupportTicketsProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "open":
        return "default";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "success";
      case "closed":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto";
      case "in_progress":
        return "Em Progresso";
      case "resolved":
        return "Resolvido";
      case "closed":
        return "Encerrado";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-heading">Tickets de Suporte</CardTitle>
        <CardDescription>Acompanhe seus pedidos de suporte</CardDescription>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Ticket className="h-10 w-10 text-muted-foreground mb-3 opacity-60" />
            <p className="text-muted-foreground mb-4">Você não tem tickets de suporte abertos</p>
            <Button>Criar Ticket</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{ticket.title}</h4>
                  <Badge variant={getStatusVariant(ticket.status) as any}>
                    {getStatusText(ticket.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ticket.description}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Ticket #{ticket.id.substring(0, 6)}</span>
                  <span>Criado em {formatDate(ticket.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          {tickets.length === 0 ? "Criar Ticket" : "Ver Todos os Tickets"}
        </Button>
      </CardFooter>
    </Card>
  );
};
