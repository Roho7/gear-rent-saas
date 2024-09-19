"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { DatabaseError } from "@/src/entities/models/errors";
import { ListingType } from "@/src/entities/models/types";

import { cookies } from "next/headers";

export const getNearbyStores = async (
  lat: number,
  lng: number,
  radiusInMeters: number = 10000,
): Promise<string[]> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase
    .rpc("_func_get_nearby_stores", {
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

export const getSingleListingDetails = async (
  productId: string,
  listingId: string,
): Promise<ListingType> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase
    .from("tbl_listings")
    .select("*")
    .eq("product_id", productId)
    .eq("listing_id", listingId).single();

  if (error) {
    throw new DatabaseError(
      "Error fetching inventory for product",
      error.message,
    );
  }

  return data as ListingType;
};
