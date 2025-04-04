
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, MessageSquare, Phone, Plus, Search } from "lucide-react";
import { supabase, SupportTicket } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const ticketSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  ticket_type: z.string(),
  priority: z.string(),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function SupportPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      ticket_type: "issue",
      priority: "medium",
      description: "",
    },
  });

  // Fetch support tickets
  const { data: tickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["support-tickets", user?.id],
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

      return data as SupportTicket[];
    },
    enabled: !!user,
  });

  // Create new ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (values: TicketFormValues) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const newTicket = {
        user_id: user.id,
        title: values.title,
        description: values.description,
        status: "open" as const,
        priority: values.priority as "low" | "medium" | "high",
      };
      
      const { data, error } = await supabase
        .from("support_tickets")
        .insert(newTicket)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast({
        title: "Ticket criado",
        description: "Seu ticket de suporte foi criado com sucesso.",
      });
      setShowNewTicket(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar ticket",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: TicketFormValues) => {
    createTicketMutation.mutate(values);
  };

  // Format date function
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

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
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

  // Get status text
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

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "low":
        return "secondary";
      case "medium":
        return "default";
      case "high":
        return "destructive";
      default:
        return "default";
    }
  };

  // Get priority text
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "Baixa";
      case "medium":
        return "Média";
      case "high":
        return "Alta";
      default:
        return priority;
    }
  };

  // Filter tickets based on search query
  const filteredTickets = tickets?.filter(ticket => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle new ticket form
  const toggleNewTicketForm = () => {
    setShowNewTicket(!showNewTicket);
    if (!showNewTicket) {
      form.reset();
    }
  };

  return (
    <DashboardShell title="Suporte">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="tickets">Meus Tickets</TabsTrigger>
            <TabsTrigger value="resources">Recursos de Ajuda</TabsTrigger>
          </TabsList>
          
          <div className="flex w-full sm:w-auto gap-2">
            {activeTab === "tickets" && (
              <>
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar tickets..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={toggleNewTicketForm}>
                  <Plus className="h-4 w-4 mr-1" /> 
                  {showNewTicket ? "Cancelar" : "Novo Ticket"}
                </Button>
              </>
            )}
          </div>
        </div>

        {showNewTicket && activeTab === "tickets" && (
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle>Novo Ticket de Suporte</CardTitle>
              <CardDescription>Preencha as informações abaixo para abrir um novo ticket</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva brevemente o problema" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ticket_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select 
                              defaultValue={field.value} 
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="issue">Problema Técnico</SelectItem>
                                <SelectItem value="question">Dúvida</SelectItem>
                                <SelectItem value="request">Solicitação</SelectItem>
                                <SelectItem value="billing">Faturação</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prioridade</FormLabel>
                            <Select 
                              defaultValue={field.value} 
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a prioridade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Baixa</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva detalhadamente o problema ou solicitação" 
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 border-t pt-4">
                  <Button 
                    type="submit" 
                    disabled={createTicketMutation.isPending}
                  >
                    {createTicketMutation.isPending ? "Enviando..." : "Enviar Ticket"}
                  </Button>
                  <Button variant="outline" type="button" onClick={toggleNewTicketForm}>
                    Cancelar
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}
        
        <TabsContent value="tickets" className="mt-0">
          {isLoadingTickets ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                  <CardFooter className="h-10 bg-gray-100"></CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredTickets && filteredTickets.length > 0 ? (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        <CardDescription>
                          Ticket #{ticket.id.substring(0, 8)} • Criado em {formatDate(ticket.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusBadgeVariant(ticket.status) as any}>
                          {getStatusText(ticket.status)}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(ticket.priority) as any}>
                          {getPriorityText(ticket.priority)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {ticket.description}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    {ticket.status !== "closed" && (
                      <div className="text-xs text-muted-foreground">
                        Última atualização: {formatDate(ticket.updated_at)}
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              {searchQuery ? (
                <>
                  <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground mt-1">
                    Não encontramos tickets que correspondam à sua pesquisa "{searchQuery}"
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Limpar pesquisa
                  </Button>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Nenhum ticket encontrado</h3>
                  <p className="text-muted-foreground mt-1">
                    Você ainda não criou nenhum ticket de suporte
                  </p>
                  <Button className="mt-4" onClick={toggleNewTicketForm}>
                    Criar Novo Ticket
                  </Button>
                </>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resources" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentação</CardTitle>
                <CardDescription>Guias e tutoriais de utilização</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <Info className="h-4 w-4 mr-2" /> Guia de Início Rápido
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <Info className="h-4 w-4 mr-2" /> Monitorização de Servidores
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <Info className="h-4 w-4 mr-2" /> Configuração de Alertas
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <Info className="h-4 w-4 mr-2" /> Job Scheduling Avançado
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <Info className="h-4 w-4 mr-2" /> Chatbots e IA
                    </a>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Toda Documentação
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>Perguntas frequentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-2">
                  <h4 className="font-medium">Como adicionar mais servidores?</h4>
                  <p className="text-sm text-muted-foreground">
                    Para adicionar mais servidores, acesse a seção "Serviços" e clique no botão "Adicionar Servidor".
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h4 className="font-medium">Como configurar notificações SMS?</h4>
                  <p className="text-sm text-muted-foreground">
                    Acesse seu perfil, vá para "Notificações" e adicione seu número de telefone.
                  </p>
                </div>
                <div className="border-b pb-2">
                  <h4 className="font-medium">Como atualizar meu método de pagamento?</h4>
                  <p className="text-sm text-muted-foreground">
                    Vá para a página de "Faturação" e clique em "Atualizar Método de Pagamento".
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Como cancelar minha assinatura?</h4>
                  <p className="text-sm text-muted-foreground">
                    Acesse "Faturação", selecione seu plano atual e clique em "Cancelar Assinatura".
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Todas as FAQ
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contacto Direto</CardTitle>
                <CardDescription>Fale com nossa equipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Suporte por Telefone</h4>
                    <p className="text-sm text-muted-foreground">+351 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">E-mail de Suporte</h4>
                    <p className="text-sm text-muted-foreground">suporte@itoperacao.pt</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Horário de atendimento:
                  </p>
                  <p className="text-sm">
                    Segunda a Sexta, das 9h às 18h
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Iniciar Chat de Suporte
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
