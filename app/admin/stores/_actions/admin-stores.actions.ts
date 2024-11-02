"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { cookies } from "next/headers";

export const verifyStore = async (store_id: string) => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase.rpc(
    "_func_update_store_locations",
    {
      store_id_input: store_id,
    },
  );

  if (error) {
    throw error;
  }

  return { data };
};
