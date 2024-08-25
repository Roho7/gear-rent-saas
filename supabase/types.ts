import { Tables } from "./supabase.types";

export type ProductType = Omit<Tables<"tbl_products">, "product_metadata"> & {
  product_metadata: ProductMetadataType;
};
export type StoreType = Tables<"tbl_stores">;
export type InventoryType = Tables<"view_stores_inventory">;

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
  | "experience";

export type ProductMetadataType =
  & {
    [K in ProductMetadataKeys]: string[];
  }
  & {
    [key: string]: string[];
  };
