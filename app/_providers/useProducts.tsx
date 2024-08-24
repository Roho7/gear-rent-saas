"use client";
import {
  CartItemType,
  ProductMetadataType,
  ProductType,
  StoreType,
} from "@/supabase/types";
import dayjs from "dayjs";
import { DBSchema, openDB } from "idb";
import {
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
    value: ProductType;
  };
  stores: {
    key: string;
    value: StoreType;
  };
}

type ProductContextType = {
  cartItems: CartItemType | null;
  addToCart: (product_id: string) => void;
  removeFromCart: (product_id: string) => void;
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
  filteredProducts: ProductType[];
  productFilters: ProductFilterType;
  setProductFilters: React.Dispatch<React.SetStateAction<ProductFilterType>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};
const ProductContext = createContext<ProductContextType | undefined>(undefined);

type ProductFilterType = ProductMetadataType & {
  category: string[];
};

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = useState<CartItemType | null>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [products, setProducts] = useState<ProductType[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilters, setProductFilters] = useState<ProductFilterType>({
    category: [],
    colors: [],
    gender: [],
    heights: [],
    lengths: [],
    sizes: [],
    widths: [],
  });

  const supabase = createClientComponentClient();

  const dbPromise = useMemo(() => {
    return openDB<ProductDB>("ProductDatabase", 1, {
      upgrade(db) {
        db.createObjectStore("products", { keyPath: "product_id" });
        db.createObjectStore("stores", { keyPath: "store_id" });
      },
    });
  }, []);

  const addToCart = (productId: string) => {
    setCartItems((cart) => ({
      ...cart,
      [productId]: {
        quantity: (cart?.[productId]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (productId: string) => {
    if (!cartItems) return;
    if (cartItems[productId]?.quantity <= 1) {
      const { [productId]: removedItem, ...restOfCart } = cartItems;
      setCartItems(restOfCart);
      return;
    }
    setCartItems((cart) => ({
      ...cart,
      [productId]: {
        quantity: (cart?.[productId]?.quantity || 0) - 1,
      },
    }));
  };

  const fetchAndCacheData = async <T,>(
    storeName: "products" | "stores",
    refresh: boolean = false,
  ) => {
    const db = await dbPromise;
    const cachedData = await db?.getAll(storeName);
    setLoading(true);
    const last_updated_at = localStorage.getItem("last_updated_at");
    // assigned setter
    const setter: React.Dispatch<React.SetStateAction<any[]>> =
      storeName === "products" ? setProducts : setStores;

    // assigned tableName
    const tableName = storeName === "products" ? "tbl_products" : "tbl_stores";

    if (
      cachedData.length &&
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
        setter(data as T[]);
        const txn = db.transaction(storeName, "readwrite");
        await Promise.all(data.map((d) => txn.store.put(d)));
      }
    }
    setLoading(false);
  };

  const fetchData = useCallback(async () => {
    await fetchAndCacheData<ProductType>("products");
    await fetchAndCacheData<StoreType>("stores");
  }, []);

  const updateProductMetadata = useCallback(async (product: ProductType) => {
    const { data, error } = await supabase.from("tbl_products").upsert(product);
    if (error) {
      console.error("Error updating product metadata:", error);
    } else {
      console.log("Updated product metadata:", data);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let foundProduct = true;
      if (searchQuery) {
        foundProduct = product.product_title
          ? product.product_title
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : false;
      }
      if (productFilters?.category.length) {
        foundProduct = productFilters.category.length
          ? productFilters.category.includes(product.category || "")
          : true;
      }
      if (productFilters?.gender.length) {
        foundProduct = product.product_metadata?.gender
          ? product?.product_metadata?.gender?.some((gender: string) =>
              productFilters?.gender.includes(gender),
            )
          : false;
      }
      return foundProduct;
    });
  }, [products, productFilters, searchQuery]);

  useEffect(() => {
    fetchData();

    const last_updated_at = localStorage.getItem("last_updated_at");
    if (!last_updated_at)
      localStorage.setItem("last_updated_at", new Date().toISOString());
  }, [fetchData]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const values = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      fetchAndCacheData,
      products,
      stores,
      loading,
      setProducts,
      setStores,
      updateProductMetadata,
      filteredProducts,
      productFilters,
      setProductFilters,
      searchQuery,
      setSearchQuery,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      fetchAndCacheData,
      products,
      stores,
      loading,
      updateProductMetadata,
      filteredProducts,
      productFilters,
      searchQuery,
    ],
  );

  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a CartProvider");
  }
  return context;
};
