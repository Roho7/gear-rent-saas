"use client";
import { toast } from "@/components/ui/use-toast";
import { cacheUser, clearUserCache, getCachedUser } from "@/lib/useCache";
import { signOut } from "@/src/controllers/signin.controller";
import { GearyoUser } from "@/src/entities/models/types";
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
  handleSignUpWithEmail: (
    email: string,
    password: string,
    pathname?: string,
  ) => Promise<void>;
  handleLoginWithEmail: (
    email: string,
    password: string,
    pathname?: string,
  ) => Promise<void>;
  handleSignInWithGoogle: (
    response: { credential: string },
    pathname?: string,
  ) => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  user: GearyoUser | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * * - Custom hooks
   */
  const supabase = createClientComponentClient();
  const router = useRouter();

  /**
   * * - States
   */
  const [user, setUser] = useState<GearyoUser | null>(() => getCachedUser());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // -------------------------------------------------------------------------- //
  //                                 HELPERS                                    //
  // -------------------------------------------------------------------------- //

  const fetchAndSetUser = useCallback(
    async (authUser: User | null, hardRefresh?: boolean) => {
      if (!authUser?.id) {
        setUser(null);
        clearUserCache();
        return;
      }

      const cachedUser = getCachedUser();
      if (cachedUser && !hardRefresh) {
        setUser(cachedUser);
        return;
      }

      setIsLoading(true);
      try {
        const userData = await fetchUser();
        if (userData) {
          setUser(userData);
          cacheUser(userData);
        } else {
          setUser(null);
          clearUserCache();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        clearUserCache();
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      await fetchAndSetUser(authUser, true);
      toast({ title: "User data refreshed" });
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({ title: "Error refreshing user data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndSetUser, supabase.auth]);

  const handleAuthResponse = useCallback(
    async (user: User | null, successMessage: string, pathname?: string) => {
      if (user) {
        await fetchAndSetUser(user);
        toast({
          title: "Success",
          description: successMessage,
          variant: "default",
        });
        router.push(pathname || "/");
      }
    },
    [fetchAndSetUser, router],
  );

  const handleSignInWithGoogle = useCallback(
    async (response: { credential: string }, pathname?: string) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });
        if (error) throw error;
        await handleAuthResponse(
          data.user,
          "Logged in with Google successfully",
          pathname,
        );
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Google Sign-In Failed",
          description:
            error.message ||
            "An unexpected error occurred during Google sign-in",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [supabase.auth, handleAuthResponse],
  );

  const handleSignUpWithEmail = useCallback(
    async (email: string, password: string, pathname?: string) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        await handleAuthResponse(
          data.user,
          "Your account has been successfully created",
          pathname,
        );
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Sign-Up Failed",
          description:
            error.message || "An unexpected error occurred during sign-up",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [supabase.auth, handleAuthResponse],
  );

  const handleLoginWithEmail = useCallback(
    async (email: string, password: string, pathname?: string) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        await handleAuthResponse(
          data.user,
          "You have successfully logged in",
          pathname,
        );
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [supabase.auth, handleAuthResponse],
  );

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await signOut();
      if (res) {
        setUser(null);
        clearUserCache();
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
          variant: "default",
        });
        router.push("/login");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Logout Failed",
        description:
          error.message || "An unexpected error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const setupAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetchAndSetUser(session?.user ?? null);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            await fetchAndSetUser(session?.user ?? null);
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            clearUserCache();
          }
        },
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    setupAuth();
  }, [supabase.auth, fetchAndSetUser]);

  useEffect(() => {
    console.log("auth called");
  }, [supabase.auth]);

  const value: AuthContextValue = useMemo(
    () => ({
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      handleSignInWithGoogle,
      user,
      refreshUser,
      isLoading,
      isLoginModalOpen,
      setIsLoginModalOpen,
    }),
    [
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      handleSignInWithGoogle,
      user,
      refreshUser,
      isLoading,
      isLoginModalOpen,
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
