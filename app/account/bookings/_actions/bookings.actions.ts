"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { BookingsType } from "@/src/entities/models/types";
import { cookies } from "next/headers";

export async function fetchBookings(): Promise<BookingsType[]> {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  //   const user = await supabase.auth.getUser();
  const { data, error } = await supabase.rpc("_func_get_bookings");

  if (error) {
    throw error;
  }

  return data;
}
