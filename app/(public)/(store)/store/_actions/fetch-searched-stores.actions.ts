"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { Tables } from "@/packages/supabase.types";
import { DatabaseError } from "@/src/entities/models/errors";
import { cookies } from "next/headers";

export const fetchSearchedStores = async (
  { lat, lng, radius }: { lat: number; lng: number; radius: number },
): Promise<Tables<"tbl_stores">[]> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase.rpc("_func_search_stores", {
    lat,
    lng,
    radius,
  });

  if (error) {
    throw new DatabaseError(
      error.message,
      "fetchSearchedStores",
      error,
    );
  }

  return data;
};
