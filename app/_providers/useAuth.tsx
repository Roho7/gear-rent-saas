"use client";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/packages/supabase.types";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClientComponentClient } from "../_utils/supabase";
import { fetchUser } from "../account/_actions/user.actions";

interface AuthContextValue {
  handleSignUpWithEmail: (email: string, password: string) => Promise<void>;
  handleLoginWithEmail: (email: string, password: string) => Promise<void>;
  handleSignInWithGoogle: (response: { credential: string }) => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  user: Tables<"tbl_users"> | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "gearyo_user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Tables<"tbl_users"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const setUserLocally = useCallback(async (authUser: User | null) => {
    if (authUser) {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const userData = await fetchUser(authUser.id);
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
      }
    } else {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;

      if (authUser) {
        const userData = await fetchUser(authUser.id);
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
        toast({ title: "User data refreshed" });
      } else {
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error refreshing user data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  const handleSignInWithGoogle = useCallback(
    async (response: { credential: string }) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });

        if (error) throw error;

        if (data.user) {
          await setUserLocally(data.user);
          toast({ title: "Logged in with Google" });
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error logging in with Google",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    },
    [router, supabase, setUserLocally],
  );

  const handleSignUpWithEmail = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          await setUserLocally(data.user);
          toast({ title: "Signed up successfully" });
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Error signing up", variant: "destructive" });
        setIsLoading(false);
      }
    },
    [router, supabase, setUserLocally],
  );

  const handleLoginWithEmail = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          await setUserLocally(data.user);
          toast({ title: "Logged in successfully" });
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Error logging in", variant: "destructive" });
        setIsLoading(false);
      }
    },
    [router, supabase, setUserLocally],
  );

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await setUserLocally(null);
      toast({ title: "Logged out successfully" });
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast({ title: "Error logging out", variant: "destructive" });
      setIsLoading(false);
    }
  }, [router, supabase, setUserLocally]);

  useEffect(() => {
    setIsLoading(true);
    const setupAuth = async () => {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await setUserLocally(session?.user ?? null);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            await setUserLocally(session?.user ?? null);
          } else if (event === "SIGNED_OUT") {
            await setUserLocally(null);
          }
        },
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    setupAuth();
  }, [supabase.auth, setUserLocally]);

  const value: AuthContextValue = useMemo(
    () => ({
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      handleSignInWithGoogle,
      user,
      refreshUser,
      isLoading,
    }),
    [
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      handleSignInWithGoogle,
      user,
      isLoading,
    ],
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
