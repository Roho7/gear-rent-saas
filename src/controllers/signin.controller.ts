"use server";

import { createServerActionClient } from "@/app/_utils/supabase";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInWithGoogle = async (token: string) => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const origin = headers().get("origin");
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: token,
    });
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const origin = headers().get("origin");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  const { error } = await supabase.auth.signOut();
  redirect("/login");
};
