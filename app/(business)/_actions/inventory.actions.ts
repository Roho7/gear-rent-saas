"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { TablesUpdate } from "@/packages/supabase.types";

import { DatabaseError } from "@/src/entities/models/errors";
import { GearyoServerActionResponse } from "@/src/entities/models/types";
import { cookies } from "next/headers";

export const addInventoryItem = async (
  { inventory_data }: {
    inventory_data?: TablesUpdate<"tbl_inventory">;
  },
): Promise<GearyoServerActionResponse> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  if (!inventory_data?.product_id) {
    throw new Error("Product ID or Store ID not provided");
  }

  const { data, error } = await supabase.from("tbl_inventory").upsert(
    inventory_data,
  );

  if (error) {
    throw new DatabaseError(
      "Error adding inventory item",
      "addInventoryItem",
      error,
    );
  }
  return {
    success: true,
    message: "Inventory item added successfully",
  };
};
