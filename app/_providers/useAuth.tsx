"use client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useMemo } from "react";
import { createClientComponentClient } from "../_utils/supabase";

interface AuthContextValue {
  handleSignUpWithEmail: (email: string, password: string) => Promise<void>;
  handleLoginWithEmail: (email: string, password: string) => Promise<void>;
  handleSignInWithGoogle: (response: any) => Promise<void>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignInWithGoogle = useCallback(
    async (response: any) => {
      const loginPromise = new Promise(async (resolve, reject) => {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });

        if (error) {
          reject(false);
          return;
        }

        if (data.user) {
          resolve(true);
        }
      });

      await toast({ title: "Logging in with Google" });
    },
    [router, supabase],
  );

  const handleSignUpWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!email) {
        throw new Error("Please enter a valid email address");
      }

      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      router.push("/");
    },
    [supabase, router],
  );

  const handleLoginWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!email) {
        throw new Error("Please enter a valid email address");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      router.push("/");
    },
    [supabase, router],
  );

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error logging out", content: error.message });
    }
    localStorage.removeItem("user");
    router.push("/login");
  }, [supabase, router]);

  const value: AuthContextValue = useMemo(
    () => ({
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      handleSignInWithGoogle,
    }),
    [handleSignUpWithEmail, handleLoginWithEmail, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext;
};
