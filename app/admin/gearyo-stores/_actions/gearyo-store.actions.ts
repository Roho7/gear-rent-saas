"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { cookies } from "next/headers";

export const verifyGearyoStore = async (store_id: string) => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase.rpc(
    "_func_update_gearyo_store_locations",
    {
      store_id_input: store_id,
    },
  );

  if (error) {
    throw error;
  }

  return { data };
};
