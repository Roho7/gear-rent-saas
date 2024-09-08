"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { cookies } from "next/headers";

export async function getInventoryItem(inventory_id: string) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase.from("tbl_inventory").select("*").eq(
    "inventory_id",
    inventory_id,
  ).single();

  if (error) {
    console.error("Error fetching inventory item:", error);
    return null;
  }

  return data;
}

export async function deleteInventoryItem(inventory_id: string) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase.from("tbl_inventory").delete().eq(
    "inventory_id",
    inventory_id,
  );

  if (error) {
    console.error("Error deleting inventory item:", error);
    return null;
  }

  return data;
}
