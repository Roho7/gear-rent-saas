"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { cookies } from "next/headers";

export const hideProduct = async (productId: string) => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  const { data, error } = await supabase.from("tbl_products").update({
    is_hidden: true,
  }).eq("product_id", productId);
  if (error) {
    console.error("Error hiding product:", error);
  }
  return data;
};
