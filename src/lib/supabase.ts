
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rhtwqpllkqsgtuybqywr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodHdxcGxsa3FzZ3R1eWJxeXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjQ5NjUsImV4cCI6MjA1OTIwMDk2NX0.qGuEksGaYq150hCRoCkkg0-uYmOP8TIncTuN-syZ6UY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Tipos para os usuários
export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin?: boolean;
};

// Tipos para as subscrições
export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: "active" | "canceled" | "past_due";
  price: number;
  interval: "month" | "year";
  created_at: string;
  current_period_end: string;
};

// Tipos para os serviços
export type Service = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "inactive";
  service_type: string;
  usage_limit?: number;
  usage_current?: number;
  last_updated: string;
  user_id: string;
};

// Tipos para as faturas
export type Invoice = {
  id: string;
  user_id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  due_date: string;
  paid_at: string | null;
  created_at: string;
};

// Tipos para os tickets de suporte
export type SupportTicket = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
};

// Função para verificar se um usuário é administrador
export const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
    
  if (error || !data) return false;
  return data.is_admin === true;
};
