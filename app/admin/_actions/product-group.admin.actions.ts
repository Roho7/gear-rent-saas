"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { ProductGroupType } from "@/src/entities/models/types";
import { cookies } from "next/headers";

export const updateProductGroup = async (updatedGroup: ProductGroupType) => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase
    .from("tbl_product_groups")
    .upsert(updatedGroup)
    .eq("product_group_id", updatedGroup.product_group_id);

  if (error) throw error;
  return data;
};
