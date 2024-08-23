"use client";
import { ProductType, StoreType } from "@/supabase/types";
import { User } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { DBSchema, openDB } from "idb";
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

interface ProductDB extends DBSchema {
  products: {
    key: string;
    value: ProductType[];
  };
  stores: {
    key: string;
    value: StoreType[];
  };
}

interface AuthContextValue {
  handleSignUpWithEmail: (email: string, password: string) => Promise<void>;
  handleLoginWithEmail: (email: string, password: string) => Promise<void>;
  handleLogout: () => void;
  fetchAndCacheData: <T>(
    storeName: "products" | "stores",
    hardRefresh?: boolean,
  ) => Promise<void>;
  products: ProductType[];
  stores: StoreType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
  setStores: React.Dispatch<React.SetStateAction<StoreType[]>>;
  loading: boolean;
  updateProductMetadata: (product: ProductType) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const dbPromise = useMemo(() => {
    return openDB<ProductDB>("ProductDatabase", 1, {
      upgrade(db) {
        db.createObjectStore("products");
        db.createObjectStore("stores");
      },
    });
  }, []);

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
    await supabase.auth.signOut();
    router.push("/login");
  }, [supabase, router]);

  const fetchAndCacheData = async <T,>(
    storeName: "products" | "stores",

    refresh: boolean = false,
  ) => {
    const db = await dbPromise;
    const cachedData = await db?.get(storeName, "all" + storeName);
    setLoading(true);
    const last_updated_at = localStorage.getItem("last_updated_at");
    const setter: React.Dispatch<React.SetStateAction<any[]>> =
      storeName === "products" ? setProducts : setStores;
    const tableName = storeName === "products" ? "tbl_products" : "tbl_stores";
    if (
      cachedData &&
      !refresh &&
      !dayjs(last_updated_at).isBefore(dayjs().subtract(15, "minutes"))
    ) {
      console.log(`Using cached ${storeName} data`);
      setter(cachedData);
    } else {
      console.log(`Fetching ${storeName} from Supabase`);
      const { data, error } = await supabase.from(tableName).select("*");
      localStorage.setItem("last_updated_at", new Date().toISOString());
      if (error) {
        console.error(`Error fetching ${storeName}:`, error);
      } else {
        console.log(`${storeName} data:`, data);
        setter(data as T[]);
        await db?.put(storeName, data, "all" + storeName);
      }
    }
    setLoading(false);
  };

  const fetchData = useCallback(async () => {
    await fetchAndCacheData<ProductType>("products");
    await fetchAndCacheData<StoreType>("stores");
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
    } else {
      setUser(data.user);
      console.log("User:", data.user);
    }
  }, []);

  const updateProductMetadata = useCallback(async (product: ProductType) => {
    const { data, error } = await supabase.from("tbl_products").upsert(product);
    if (error) {
      console.error("Error updating product metadata:", error);
    } else {
      console.log("Updated product metadata:", data);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const last_updated_at = localStorage.getItem("last_updated_at");
    if (!last_updated_at)
      localStorage.setItem("last_updated_at", new Date().toISOString());
  }, [fetchData]);

  const value: AuthContextValue = useMemo(
    () => ({
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      products,
      stores,
      setProducts,
      setStores,
      loading,
      fetchAndCacheData,
      updateProductMetadata,
      user,
    }),
    [
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      products,
      stores,
      loading,
      user,
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
