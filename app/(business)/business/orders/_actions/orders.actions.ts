"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { BookingsType } from "@/src/entities/models/types";
import { cookies } from "next/headers";

export const fetchOrders = async (
  { store_id }: { store_id?: string | null },
) => {
  const cookieStorage = cookies();
  const supabase = createServerActionClient({ cookies: cookieStorage });

  if (!store_id) {
    throw new Error("Store ID is required.");
  }
  const { data, error } = await supabase.rpc("_func_get_bookings", {
    store_id_input: store_id,
  }).returns<BookingsType[]>();

  if (error) throw error;

  return data;
};
