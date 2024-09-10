"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { InventoryType } from "@/src/entities/models/types";

import { cookies } from "next/headers";

export const getNearbyStores = async (
  lat: number,
  lng: number,
  radiusInMeters: number = 10000,
): Promise<string[]> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase
    .rpc("get_nearby_stores", {
      lat: lat,
      lng: lng,
      radius: radiusInMeters,
    }).returns<string[]>();

  if (error) {
    console.error("Error fetching nearby stores:", error);
    return [];
  }

  return data || [];
};

export const getInventoryForProduct = async (
  productId: string,
  storeIds: string[],
): Promise<InventoryType[]> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  console.log(
    "Fetching inventory for product",
    productId,
    "from stores",
    storeIds,
  );

  const { data, error } = await supabase
    .from("tbl_inventory")
    .select("*")
    .eq("product_id", productId)
    .in("store_id", storeIds).returns<InventoryType[]>();

  if (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
  console.log(data);
  return data || [];
};
