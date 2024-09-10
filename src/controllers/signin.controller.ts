"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import * as Sentry from "@sentry/nextjs";
import { cookies, headers } from "next/headers";
import { DatabaseError } from "../entities/models/errors";

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
    Sentry.captureException(error);
    throw new DatabaseError(error, "signInWithGoogle");
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
    Sentry.captureException(error);
    throw new DatabaseError(error, "signInWithEmail");
  }
};

export const signOut = async () => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { error } = await supabase.auth.signOut();

    return { success: true, message: "Logged out successfully" };
  } catch (error: any) {
    Sentry.captureException(error);
    throw new DatabaseError(error, "signOut");
  }
};
