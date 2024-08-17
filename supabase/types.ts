import { Tables } from "./supabase.types";

export type ProductType = Tables<"tbl_products">;
export type StoreType = Tables<"tbl_stores">;

export type CartItemType = {
  [product_id: string]: {
    quantity: number;
  };
};
