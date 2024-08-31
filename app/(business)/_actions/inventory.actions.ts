"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { TablesUpdate } from "@/supabase/supabase.types";
import { InventoryType, StoreType } from "@/supabase/types";
import { cookies } from "next/headers";

export const getInventory = async (store_id: string | null) => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  if (!store_id) {
    console.error("Store ID not provided");
    return null;
  }
  const { data: inventoryData, error: inventoryError } = await supabase.rpc(
    "get_inventory",
    {
      store_id_input: store_id,
    },
  ).returns<{ store_details: StoreType; inventory: InventoryType[] }>();
  console.log("Inventory data:", inventoryData);
  if (inventoryError || !inventoryData) {
    console.error("Error fetching inventory data:", inventoryError);
  }

  return inventoryData;
};

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
