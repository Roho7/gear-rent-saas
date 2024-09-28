"use client";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/errorHandler";

import { MainSearchFormOutputType } from "@/src/entities/models/formSchemas";
import {
  AvailableListingsType,
  CartItemType,
  ProductGroupType,
  ProductMetadataType,
  ProductType,
  SearchLocationType,
  StoreType,
} from "@/src/entities/models/types";
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
import { getAllProducts } from "../_actions/all-products.actions";
import { searchListings } from "../_actions/search.listing.action";
import { createClientComponentClient } from "../_utils/supabase";
import { updateProductMetadata } from "../admin/products/_actions/product.actions";

interface ProductDB extends DBSchema {
  products: {
    key: string;
    value: ProductType;
  };
  stores: {
    key: string;
    value: StoreType;
  };
  product_groups: {
    key: string;
    value: ProductGroupType;
  };
}

type ProductContextType = {
  cartItems: CartItemType | null;
  addToCart: (product_id: string) => void;
  removeFromCart: (product_id: string) => void;
  fetchAndCacheProducts: (refresh: boolean) => Promise<void>;
  allProducts: ProductType[];
  setAllProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
  allStores: StoreType[];
  setAllStores: React.Dispatch<React.SetStateAction<StoreType[]>>;
  loading: boolean;
  handleProductMetadataUpdate: (product: ProductType) => Promise<void>;
  filteredProducts: ProductType[];
  productFilters: ProductFilterType;
  setProductFilters: React.Dispatch<React.SetStateAction<ProductFilterType>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchLocation: SearchLocationType | null;
  setSearchLocation: React.Dispatch<
    React.SetStateAction<SearchLocationType | null>
  >;
  availableListings: AvailableListingsType[] | undefined;
  setAvailableListings: React.Dispatch<AvailableListingsType[] | undefined>;
  fetchListings: (data: MainSearchFormOutputType) => Promise<void>;
  productGroups: ProductGroupType[];
  fetchAndCacheProductGroups: (refresh: boolean) => Promise<void>;
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
  const [cartItems, setCartItems] = useState<CartItemType | null>(null);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [productGroups, setProductGroups] = useState<ProductGroupType[]>([]);
  const [allStores, setAllStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] =
    useState<SearchLocationType | null>(null);
  const [availableListings, setAvailableListings] =
    useState<AvailableListingsType[]>();

  const [productFilters, setProductFilters] = useState<ProductFilterType>({
    category: [],
    colors: [],
    gender: [],
    heights: [],
    lengths: [],
    sizes: [],
    widths: [],
    experience: [],
    style: [],
  });

  const supabase = createClientComponentClient();

  const dbPromise = useMemo(() => {
    return openDB<ProductDB>("ProductDatabase", 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (oldVersion < 1) {
          // Create initial stores
          db.createObjectStore("products", { keyPath: "product_id" });
          db.createObjectStore("stores", { keyPath: "store_id" });
        }
        if (oldVersion < 2) {
          // Add new product_groups store in version 2
          db.createObjectStore("product_groups", {
            keyPath: "product_group_id",
          });
        }
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

  const fetchAndCacheProducts = async (refresh: boolean = false) => {
    setLoading(true);
    const db = await dbPromise;
    const cachedData = await db?.getAll("products");
    const last_updated_at = localStorage.getItem("products_last_updated_at");

    if (
      cachedData.length &&
      !refresh &&
      !dayjs(last_updated_at).isBefore(dayjs().subtract(15, "minutes"))
    ) {
      console.log("Using cached products data");
      setAllProducts(cachedData);
    } else {
      console.log("Fetching products from Supabase");
      const { success, data } = await getAllProducts();

      if (success && data) {
        localStorage.setItem(
          "products_last_updated_at",
          new Date().toISOString(),
        );
        const sortedData = data.sort((a, b) =>
          a.product_id.localeCompare(b.product_id),
        );
        setAllProducts(sortedData);
        const txn = db.transaction("products", "readwrite");
        await Promise.all(
          sortedData.map((d: ProductType) => {
            return txn.store.put(d);
          }),
        );
        toast({
          title: "Products refreshed",
          variant: "default",
          description: "Products fetched from database",
        });
      }
    }
    setLoading(false);
  };

  const fetchAndCacheStores = async (refresh: boolean = false) => {
    const db = await dbPromise;
    const cachedData = await db?.getAll("stores");
    setLoading(true);
    const last_updated_at = localStorage.getItem("stores_last_updated_at");

    if (
      cachedData.length &&
      !refresh &&
      !dayjs(last_updated_at).isBefore(dayjs().subtract(15, "minutes"))
    ) {
      console.log("Using cached stores data");
      setAllStores(cachedData);
    } else {
      console.log("Fetching stores from Supabase");
      const { data, error } = await supabase.from("tbl_stores").select("*");

      localStorage.setItem("stores_last_updated_at", new Date().toISOString());
      if (error) {
        console.error("Error fetching stores:", error);
      } else {
        const sortedData = data.sort((a, b) =>
          a.store_id.localeCompare(b.store_id),
        );
        setAllStores(sortedData);
        const txn = db.transaction("stores", "readwrite");
        await Promise.all(
          sortedData.map((d: StoreType) => {
            return txn.store.put(d);
          }),
        );
      }
    }
    setLoading(false);
  };

  const fetchProductGroups = async () => {
    console.log("Fetching product groups from Supabase");
    const { data, error } = await supabase
      .from("tbl_product_groups")
      .select("*");

    if (error) {
      console.error("Error fetching product groups:", error);
    } else {
      const sortedData = data.sort((a, b) =>
        a.product_group_id.localeCompare(b.product_group_id),
      );
      setProductGroups(sortedData);
    }

    setLoading(false);
  };

  const fetchListings = async ({
    sport,
    rentPeriod,
    location,
    storeId,
  }: MainSearchFormOutputType) => {
    const res = await searchListings({
      sport,
      rentPeriod,
      location,
      storeId,
    });

    setAvailableListings(res);
  };

  const fetchData = useCallback(async () => {
    await fetchAndCacheProducts();
    await fetchAndCacheStores();
    await fetchProductGroups();
  }, []);

  const handleProductMetadataUpdate = useCallback(
    async (product: ProductType) => {
      try {
        const { success } = await updateProductMetadata(product);
        if (success) {
          await fetchAndCacheProducts(true);
          toast({
            title: "Product metadata updated",
            variant: "default",
            description: "Product metadata updated successfully",
          });
        }
      } catch (error: any) {
        handleError(error, "handleProductMetadataUpdate");
      }
    },
    [],
  );

  // -------------------------------------------------------------------------- //
  //                               FILTERED PRODUCTS                            //
  // -------------------------------------------------------------------------- //

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      let foundProduct = true;

      // Search query filter
      if (searchQuery) {
        foundProduct = product.product_title
          ? product.product_title
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : false;
      }

      // Existing category filter
      if (productFilters?.category.length) {
        foundProduct = productFilters.category.includes(product.category || "");
      }

      // Existing metadata filters
      if (productFilters?.gender.length) {
        foundProduct = product.product_metadata?.gender
          ? product.product_metadata.gender.some((gender: string) =>
              productFilters.gender.includes(gender),
            )
          : false;
      }

      if (productFilters?.experience.length) {
        foundProduct = product.product_metadata?.experience
          ? product.product_metadata.experience.some((exp: string) =>
              productFilters.experience.includes(exp),
            )
          : false;
      }

      if (productFilters?.style.length) {
        foundProduct = product.product_metadata?.style
          ? product.product_metadata.style.some((style: string) =>
              productFilters.style.includes(style),
            )
          : false;
      }

      return foundProduct;
    });
  }, [allProducts, productFilters, searchQuery]);

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
      fetchAndCacheProducts,
      allProducts,
      allStores,
      loading,
      setAllProducts,
      setAllStores,
      handleProductMetadataUpdate,
      filteredProducts,
      productFilters,
      setProductFilters,
      searchQuery,
      setSearchQuery,
      searchLocation,
      setSearchLocation,
      availableListings,
      setAvailableListings,
      fetchListings,
      productGroups,
      fetchAndCacheProductGroups: fetchProductGroups,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      fetchAndCacheProducts,
      allProducts,
      allStores,
      loading,
      handleProductMetadataUpdate,
      filteredProducts,
      productFilters,
      searchQuery,
      searchLocation,
      availableListings,
      fetchListings,
      productGroups,
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
