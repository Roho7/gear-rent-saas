"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { DatabaseError } from "@/src/entities/models/errors";
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

  const { data, error } = await supabase
    .from("tbl_inventory")
    .select("*")
    .eq("product_id", productId)
    .in("store_id", storeIds);

  if (error) {
    throw new DatabaseError(
      "Error fetching inventory for product",
      error.message,
    );
  }

  return data as InventoryType[];
};
