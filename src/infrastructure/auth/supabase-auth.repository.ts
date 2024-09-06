import { createServerActionClient } from "@/app/_utils/supabase";
import { AuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { DatabaseOperationError } from "@/src/entities/errors/common";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export class SupabaseAuthRepository implements AuthRepository {
  async signUp(
    email: string,
    password: string,
    name: string,
  ): Promise<User> {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) throw error;
    if (data.user) return data.user;
    else {
      throw new DatabaseOperationError("Cannot create user");
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      return data.user;
    } else {
      throw new DatabaseOperationError("Cannot sign in user");
    }
  }

  async signOut(): Promise<void> {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const userData = await supabase.auth.getUser();
    return userData.data.user || null;
  }
}
