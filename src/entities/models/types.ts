import { Tables } from "@/packages/supabase.types";

export type ProductType = Omit<Tables<"tbl_products">, "product_metadata"> & {
  product_metadata: ProductMetadataType;
};
export type ProductGroupType = Tables<"tbl_product_groups">;
export type GearyoUser = Tables<"tbl_users">;
export type StoreType = Tables<"tbl_stores">;
export type ListingType =
  & Omit<Tables<"tbl_listings">, "product_metadata" | "price_granularity">
  & {
    product_metadata: ProductMetadataType;
    price_granularity: PriceGranularityType;
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
  inventory: ListingType[];
};

export type GearyoServerActionResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export type SearchLocationType = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius?: number;
};

export type AvailableListingsType = {
  product_id: string;
  listing_id: string;
  store_id: string;
  base_price: number;
  currency_code: string;
  available_from: string;
  available_until: string;
  latitude: number;
  longitude: number;
  distance: number | null;
  description: string;
  price_granularity: PriceGranularityType;
  discount_1: number;
  discount_2: number;
  discount_3: number;
  product_metadata: ProductMetadataType;
};
