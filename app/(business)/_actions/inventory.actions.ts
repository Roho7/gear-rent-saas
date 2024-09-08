"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { TablesUpdate } from "@/packages/supabase.types";
import { cookies } from "next/headers";

export const addInventoryItem = async (
  { inventory_data }: {
    inventory_data?: TablesUpdate<"tbl_inventory">;
  },
) => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  if (!inventory_data?.product_id) {
    console.error("Product ID or Store ID not provided");
    return;
  }

  const { data, error } = await supabase.from("tbl_inventory").upsert(
    inventory_data,
  );

  if (error) {
    console.error("Error inserting data:", error);
    return;
  }
  console.log("Successfully added inventory item", data);
};
