import { User } from "@supabase/supabase-js";

export interface AuthRepository {
  signUp(email: string, password: string, name: string): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
