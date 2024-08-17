"use client";
import { ProductType, StoreType } from "@/supabase/types";
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
  products: ProductType[];
  stores: StoreType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
  setStores: React.Dispatch<React.SetStateAction<StoreType[]>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);

  const dbPromise = openDB<ProductDB>("ProductDatabase", 1, {
    upgrade(db) {
      db.createObjectStore("products");
      db.createObjectStore("stores");
    },
  });

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
    tableName: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    const db = await dbPromise;
    const cachedData = await db.get(storeName, "all" + storeName);

    if (cachedData) {
      console.log(`Using cached ${storeName} data`);
      setter(cachedData);
    } else {
      console.log(`Fetching ${storeName} from Supabase`);
      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        console.error(`Error fetching ${storeName}:`, error);
      } else {
        console.log(`${storeName} data:`, data);
        setter(data as T[]);
        await db.put(storeName, data, "all" + storeName);
      }
    }
  };

  const fetchData = useCallback(async () => {
    await fetchAndCacheData<ProductType>(
      "products",
      "tbl_products",
      setProducts,
    );
    await fetchAndCacheData<StoreType>("stores", "tbl_stores", setStores);
  }, []);

  useEffect(() => {
    fetchData();
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
    }),
    [
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      products,
      stores,
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
