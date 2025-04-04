
import { createClient } from "@supabase/supabase-js";

// Default fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

// Log warning only if we're using the fallback values
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Running with fallback Supabase credentials. To use your own credentials, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para os usuários
export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
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
};

// Tipos para as faturas
export type Invoice = {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  due_date: string;
  paid_at: string | null;
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
