"use server";

import { DatabaseError } from "@/src/entities/models/errors";
import { MainSearchFormOutputType } from "@/src/entities/models/formSchemas";
import { AvailableListingsType } from "@/src/entities/models/types";
import { cookies } from "next/headers";
import { createServerActionClient } from "../_utils/supabase";

export async function searchListings(
  { location, rentPeriod, sport, storeId }: MainSearchFormOutputType,
): Promise<AvailableListingsType[]> {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  const { data, error } = await supabase.rpc("_func_search_active_listings", {
    latitude_input: location?.lat,
    longitude_input: location?.lng,
    rent_period_from: rentPeriod?.from?.toISOString(),
    rent_period_to: rentPeriod?.to?.toISOString(),
    radius: location?.radius,
    sport_input: sport,
    store_id_input: storeId,
  }).returns<AvailableListingsType[]>();

  if (error) {
    throw new DatabaseError(
      error.message ?? "Error in fetching available products",
      "searchListings",
    );
  }

  return data;
}
