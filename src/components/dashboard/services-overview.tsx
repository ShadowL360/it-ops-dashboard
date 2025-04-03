
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Server } from "lucide-react";

interface ServiceData {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface ServicesOverviewProps {
  services: ServiceData[];
}

export const ServicesOverview = ({ services }: ServicesOverviewProps) => {
  const activeServices = services.filter((s) => s.status === "active").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-heading">Serviços Ativos</CardTitle>
        <CardDescription>Visão geral dos seus serviços</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{activeServices} de {services.length} serviços ativos</span>
          </div>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div>
                <h4 className="font-medium">{service.name}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
              <div>
                {service.status === "active" ? (
                  <div className="flex items-center gap-1 text-success">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-medium">Ativo</span>
                  </div>
                ) : service.status === "paused" ? (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">Pausado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-medium">Inativo</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
