"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { cookies } from "next/headers";

export const getInventory = async () => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const userData = await supabase.auth.getUser();

  const { data: storeData, error: storeError } = await supabase.from(
    "tbl_stores",
  ).select("*").eq(
    "user_id",
    userData.data.user?.id,
  ).single();

  const { data, error } = await supabase.from("tbl_inventory").select("*").eq(
    "store_id",
    storeData.store_id,
  );

  if (error || !data) {
    console.error("Error fetching inventory data:", error);
    return;
  }
  return data;
};

export const addInventoryItem = async (
  { product_id }: {
    product_id?: string;
  },
) => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  if (!product_id) {
    console.error("Product ID or Store ID not provided");
    return;
  }
  const userData = await supabase.auth.getUser();

  const { data: storeData, error: storeError } = await supabase.from(
    "tbl_stores",
  ).select("*").eq(
    "user_id",
    userData.data.user?.id,
  ).single();

  if (storeError || !storeData) {
    console.error("Error fetching store data:", storeError);
    return;
  }

  const { data, error } = await supabase.from("tbl_inventory").insert(
    {
      product_id,
      store_id: storeData.store_id,
    },
  );

  if (error) {
    console.error("Error inserting data:", error);
    return;
  }
  console.log("Successfully added inventory item");
};
