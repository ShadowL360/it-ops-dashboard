
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase, UserProfile } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  company: z.string().optional(),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
  new_password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirm_password: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
}).refine(data => data.new_password === data.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"]
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch user profile data
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      // Simulação de dados
      return {
        id: user?.id || "",
        email: user?.email || "",
        full_name: "João Silva",
        company: "Tech Solutions",
        phone: "+351 912 345 678",
        avatar_url: null,
        created_at: "2025-01-15T10:30:00Z",
      } as UserProfile;
    },
    enabled: !!user,
  });

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      company: profile?.company || "",
      phone: profile?.phone || "",
    },
    values: {
      full_name: profile?.full_name || "",
      company: profile?.company || "",
      phone: profile?.phone || "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Update profile function
  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    
    try {
      // Simular atualização de perfil
      console.log("Atualizando perfil:", values);
      
      // Em um ambiente real, chamaríamos a API do Supabase
      // const { error } = await supabase
      //   .from('profiles')
      //   .update(values)
      //   .eq('id', user.id);
      
      // if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações de perfil foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Change password function
  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsChangingPassword(true);
    
    try {
      // Simular alteração de senha
      console.log("Alterando senha...");
      
      // Em um ambiente real, chamaríamos a API do Supabase
      // const { error } = await supabase.auth.updateUser({
      //   password: values.new_password
      // });
      
      // if (error) throw error;
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      
      passwordForm.reset();
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast({
        title: "Erro ao alterar senha",
        description: "Ocorreu um erro ao alterar sua senha.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const userInitials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.email?.substring(0, 2).toUpperCase() || "US";

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <DashboardShell title="Perfil">
      <div className="space-y-6">
        {/* Account Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>Visão geral da sua conta IT Operação</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <div className="flex items-center space-x-4 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="w-20 h-20 border">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                  <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{profile?.full_name || "Usuário"}</h3>
                  <p className="text-muted-foreground">{profile?.email}</p>
                  {profile?.company && (
                    <p className="text-sm">{profile.company}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Membro desde {formatDate(profile?.created_at || "")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Settings Tabs */}
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="password">Senha</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Nome da sua empresa ou organização
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Usado para comunicações importantes e alertas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <Label htmlFor="avatar" className="mb-2 block">Foto de Perfil</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border">
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            className="max-w-xs"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, GIF ou PNG. Tamanho máximo de 1MB.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A atualizar...
                        </>
                      ) : (
                        "Salvar Alterações"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Password Tab */}
          <TabsContent value="password" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Senha</CardTitle>
                <CardDescription>
                  Altere sua senha de acesso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="current_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha Atual</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Mínimo de 6 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A alterar...
                        </>
                      ) : (
                        "Alterar Senha"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
