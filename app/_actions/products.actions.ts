"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "../_utils/supabase";

export const getAllProducts = async () => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  const { data, error } = await supabase
    .from("tbl_products")
    .select("*")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
};
