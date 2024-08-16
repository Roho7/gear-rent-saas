import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClientComponentClient } from "../_utils/supabase";
import { useRouter } from "next/navigation";
import { ProductType } from "@/supabase/types";
import { openDB, DBSchema } from "idb";

interface ProductDB extends DBSchema {
  products: {
    key: string;
    value: ProductType[];
  };
}

interface AuthContextValue {
  handleSignUpWithEmail: (email: string, password: string) => void;
  handleLoginWithEmail: (email: string, password: string) => void;
  handleLogout: () => void;
  products: ProductType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);

  const dbPromise = openDB<ProductDB>("ProductDatabase", 1, {
    upgrade(db) {
      db.createObjectStore("products");
    },
  });

  const handleSignUpWithEmail = useCallback(
    async (email: string, password: string) => {
      const loginPromise = new Promise(async (resolve, reject) => {
        try {
          if (!email) {
            reject("Please enter a valid email address");
            return;
          }

          const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
          });

          if (error) {
            reject(error.message);
          } else {
            resolve(email);
          }
        } catch (error: any) {
          reject(
            error?.message || "Sorry! You can only request an OTP every 60 sec",
          );
        } finally {
          router.push("/");
        }
      });
    },
    [supabase],
  );

  const handleLoginWithEmail = useCallback(
    async (email: string, password: string) => {
      const loginPromise = new Promise(async (resolve, reject) => {
        try {
          if (!email) {
            reject("Please enter a valid email address");
            return;
          }

          const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

          if (error) {
            reject(error.message);
          } else {
            resolve(email);
          }
        } catch (error: any) {
          reject(
            error?.message || "Sorry! You can only request an OTP every 60 sec",
          );
        } finally {
          router.push("/");
        }
      });
    },
    [supabase],
  );

  const handleLogout = () => {
    // Implement your logout logic here
  };

  const fetchData = async () => {
    const db = await dbPromise;
    const cachedProducts = await db.get("products", "allProducts");

    if (cachedProducts) {
      console.log("Using cached data");
      setProducts(cachedProducts);
    } else {
      console.log("Fetching from Supabase");
      const supabase = createClientComponentClient();
      const { data: product_data, error } = await supabase
        .from("tbl_products")
        .select("*");

      if (error) {
        console.log("error", error);
      } else {
        console.log("data", product_data);
        const typedProducts = product_data as ProductType[];
        setProducts(typedProducts);
        await db.put("products", typedProducts, "allProducts");
      }
    }
  };

  useEffect(() => {
    console.log("data fetched");
    fetchData();
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      handleSignUpWithEmail,
      handleLoginWithEmail,
      handleLogout,
      products,
      setProducts,
    }),
    [products],
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
