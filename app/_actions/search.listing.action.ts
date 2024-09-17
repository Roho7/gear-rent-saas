"use server";

import { DatabaseError } from "@/src/entities/models/errors";
import { MainSearchFormOutputType } from "@/src/entities/models/formSchemas";
import { AvailableListingsType } from "@/src/entities/models/types";
import { cookies } from "next/headers";
import { createServerActionClient } from "../_utils/supabase";

export async function searchListings(
  { location, rentPeriod, experience, sport }: MainSearchFormOutputType,
): Promise<AvailableListingsType[]> {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  const { data, error } = await supabase.rpc("search_active_listings", {
    latitude_input: location.lat,
    longitude_input: location.lng,
    rent_period_from: rentPeriod?.from?.toISOString(),
    rent_period_to: rentPeriod?.to?.toISOString(),
    radius: location.radius,
    experience_input: experience,
    sport,
  }).returns<AvailableListingsType[]>();

  if (error) {
    throw new DatabaseError(
      "Error in fetching available products",
      error.message,
    );
  }

  return data;
}
