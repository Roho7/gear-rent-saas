"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { InventoryType, ProductType } from "@/packages/types";
import { cookies } from "next/headers";

export async function bulkUpdateProducts(
  productIds: string[],
  insertData: Partial<ProductType>,
) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  const filteredInsertData = Object.fromEntries(
    Object.entries(insertData).filter(([_, value]) =>
      value !== null && !!value
    ),
  );

  const { data, error } = await supabase.from("tbl_products").upsert(
    productIds.map((id) => ({ ...filteredInsertData, product_id: id })),
  );
  if (error) {
    throw new Error("Error updating products:", { cause: error.message });
  }

  return data;
}

export async function getInventory() {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  const { data, error } = await supabase.from("tbl_inventory").select("*")
    .returns<InventoryType[]>();
  if (error) {
    throw new Error("Error fetching inventory:", { cause: error.message });
  }

  return data;
}
