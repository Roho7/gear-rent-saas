"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import * as Sentry from "@sentry/nextjs";
import { cookies, headers } from "next/headers";
import { AuthenticationError, UnknownError } from "../entities/models/errors";

export const signInWithGoogle = async (token: string) => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const origin = headers().get("origin");
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: token,
    });

    if (error) {
      throw new AuthenticationError(
        "Could not sign in with google",
        "signInWithGoogle",
        error,
      );
    }
    return data;
  } catch (error: any) {
    Sentry.captureException(error);
    throw new UnknownError("Unknown error", "signInWithGoogle", error.message);
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
    throw new UnknownError("Unknown error", "signInWithEmail", error.message);
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
    throw new UnknownError("Unknown error", "signOut", error.message);
  }
};
