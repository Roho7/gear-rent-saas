"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { DatabaseError } from "@/src/entities/models/errors";
import { GearyoServerActionResponse } from "@/src/entities/models/types";
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

export async function deleteListing(
  inventory_id: string,
): Promise<GearyoServerActionResponse> {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { error } = await supabase.from("tbl_inventory").delete().eq(
    "inventory_id",
    inventory_id,
  );

  if (error) {
    throw new DatabaseError(
      "Error deleting Listing",
      "deleteListing",
      error,
    );
  }

  return { success: true, message: "Listing deleted" };
}
