
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Clock, Info, PauseCircle, PlayCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase, Service } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export default function ServicesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ["services-details", user?.id],
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

      return data as Service[];
    },
    enabled: !!user,
  });

  // Mutation para atualizar o status do serviço
  const updateServiceStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'active' | 'paused' | 'inactive' }) => {
      const { error } = await supabase
        .from("services")
        .update({ status, last_updated: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-details"] });
      toast({
        title: "Serviço atualizado",
        description: "O status do serviço foi atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getFilteredServices = () => {
    if (!services) return [];
    
    if (activeTab === "all") return services;
    if (activeTab === "active") return services.filter(s => s.status === "active");
    if (activeTab === "paused") return services.filter(s => s.status === "paused");
    if (activeTab === "inactive") return services.filter(s => s.status === "inactive");
    
    return services;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Activity className="h-5 w-5 text-success" />;
      case "paused":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "inactive":
        return <Activity className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "paused":
        return "Pausado";
      case "inactive":
        return "Inativo";
      default:
        return status;
    }
  };

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case "core":
        return "Serviço Principal";
      case "addon":
        return "Complemento";
      default:
        return type;
    }
  };

  const handleToggleServiceStatus = (service: Service) => {
    const newStatus = service.status === 'active' 
      ? 'paused' 
      : service.status === 'paused' ? 'active' : 'active';
    
    updateServiceStatus.mutate({ id: service.id, status: newStatus as 'active' | 'paused' | 'inactive' });
  };

  const filteredServices = getFilteredServices();

  return (
    <DashboardShell title="Serviços">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-4 w-fit">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="paused">Pausados</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
          </TabsList>
          <Button>Adicionar Serviço</Button>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-gray-100" />
                  <CardContent className="py-6">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </CardContent>
                  <CardFooter className="h-12 bg-gray-50" />
                </Card>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-primary/10 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Info className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhum serviço encontrado</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {activeTab === "all"
                  ? "Você ainda não tem nenhum serviço configurado."
                  : `Você não tem serviços ${
                      activeTab === "active" ? "ativos" : activeTab === "paused" ? "pausados" : "inativos"
                    }.`}
              </p>
              {activeTab !== "all" && (
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("all")}>
                  Ver todos os serviços
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          {service.description}
                        </CardDescription>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              {getStatusIcon(service.status)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getStatusText(service.status)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tipo</span>
                        <Badge variant="outline">{getServiceTypeText(service.service_type)}</Badge>
                      </div>
                      
                      {service.usage_limit && (
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Utilização</span>
                            <span>{service.usage_current}/{service.usage_limit}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary rounded-full h-2"
                              style={{ width: `${(service.usage_current! / service.usage_limit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Atualizado</span>
                        <span className="text-sm">{formatDate(service.last_updated)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    {service.status === "active" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleToggleServiceStatus(service)}
                        disabled={updateServiceStatus.isPending}
                      >
                        <PauseCircle className="h-4 w-4" />
                        Pausar
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleToggleServiceStatus(service)}
                        disabled={updateServiceStatus.isPending}
                      >
                        <PlayCircle className="h-4 w-4" />
                        {service.status === "paused" ? "Resumir" : "Ativar"}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
