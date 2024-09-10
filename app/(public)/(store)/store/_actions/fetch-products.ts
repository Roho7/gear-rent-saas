"use server";
import { createServerComponentClient } from "@/app/_utils/supabase";
import { cookies } from "next/headers";

export const fetchProducts = async () => {
  const cookiesStore = cookies();
  const supabase = createServerComponentClient({ cookies: cookiesStore });

  const { data: product_data, error } = await supabase
    .from("tbl_products")
    .select("*");

  if (error) {
    console.log("error", error);
  }
  return product_data;
};
