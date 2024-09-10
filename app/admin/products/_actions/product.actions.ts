"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { createServerResponse } from "@/lib/serverResponse";
import { GearyoServerActionResponse, ProductType } from "@/packages/types";
import { DatabaseError, UnknownError } from "@/src/entities/models/errors";
import { cookies } from "next/headers";

export const updateProductMetadata = async (
  product: ProductType,
): Promise<GearyoServerActionResponse<null>> => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { data, error } = await supabase.from("tbl_products").upsert(product);
    if (error) {
      throw new DatabaseError("Error updating product metadata", error.message);
    }
    return createServerResponse(
      { success: true, message: "Product metadata updated successfully", data },
    );
  } catch (error: any) {
    throw new UnknownError("Error updating product metadata", error.message);
  }
};

export const hideProduct = async (
  productId: string,
): Promise<GearyoServerActionResponse<null>> => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { data, error } = await supabase.from("tbl_products").update({
      is_hidden: true,
    }).eq("product_id", productId);

    if (error) {
      throw new DatabaseError("Error hiding product", error.message);
    }

    return createServerResponse({
      success: true,
      message: "Product hidden successfully",
      data,
    });
  } catch (error: any) {
    throw new UnknownError("Error hiding product", error.message);
  }
};
