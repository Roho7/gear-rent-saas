import { Tables } from "./supabase.types";

export type ProductType = Omit<Tables<"tbl_products">, "product_metadata"> & {
  product_metadata: ProductMetadataType;
};
export type GearyoUser = Tables<"tbl_users">;
export type StoreType = Tables<"tbl_stores">;
export type InventoryType = {
  inventory_id: string;
  product_id: string;
  base_price: string;
  product_title: string;
  category: string;
  product_metadata: ProductMetadataType;
  total_units: number;
  available_units: number;
  price_granularity: PriceGranularityType;
  currency_code: string;
  discount_1: number;
  discount_2: number;
  discount_3: number;
  description: string;
};

export type CartItemType = {
  [product_id: string]: {
    quantity: number;
  };
};

export type PriceGranularityType = "daily" | "hourly";
export type GenderType = "male" | "female";

export type ProductMetadataKeys =
  | "sizes"
  | "colors"
  | "heights"
  | "widths"
  | "lengths";

export type ProductMetadataType =
  & {
    [K in ProductMetadataKeys]?: string[];
  }
  & {
    [key: string]: string[];
  };

export type BusinessType = {
  user: GearyoUser;
  store: StoreType;
  inventory: InventoryType[];
};
