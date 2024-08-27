import { Tables } from "./supabase.types";

export type ProductType = Omit<Tables<"tbl_products">, "product_metadata"> & {
  product_metadata: ProductMetadataType;
};
export type StoreType = Tables<"tbl_stores">;
export type InventoryType = {
  price: string;
  product_id: string;
  product_title: string;
  category: string;
  product_metadata: ProductMetadataType;
  total_units: number;
  inventory_id: string;
  available_units: number;
};

export type CartItemType = {
  [product_id: string]: {
    quantity: number;
  };
};

export type ProductMetadataKeys =
  | "gender"
  | "sizes"
  | "colors"
  | "heights"
  | "widths"
  | "lengths"
  | "experience"
  | "style";

export type ProductMetadataType =
  & {
    [K in ProductMetadataKeys]: string[];
  }
  & {
    [key: string]: string[];
  };
