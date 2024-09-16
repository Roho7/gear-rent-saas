"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { handleError } from "@/lib/errorHandler";
import { createServerResponse } from "@/lib/serverResponse";
import {
  GearyoServerActionResponse,
  ListingType,
  ProductType,
} from "@/src/entities/models/types";

import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";

export async function bulkUpdateProducts(
  productIds: string[],
  insertData: Partial<ProductType>,
) {
  try {
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
      handleError(error, "bulkUpdateProducts");
      return createServerResponse(
        { success: false, message: error.message },
      );
    }

    return createServerResponse({
      success: true,
      message: "Products updated successfully",
      data,
    });
  } catch (error: any) {
    Sentry.captureException(error, {
      tags: {
        stack: "bulkUpdateProducts",
      },
    });
    handleError(error, "bulkUpdateProducts");
    return createServerResponse(
      { success: false, message: error.message },
    );
  }
}

export async function getInventory(): Promise<
  GearyoServerActionResponse<ListingType[]>
> {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { data, error } = await supabase.from("tbl_listings").select("*")
      .returns<ListingType[]>();

    if (error) {
      handleError(error, "getInventory");
      return createServerResponse(
        {
          success: false,
          message: error.message ?? "Error fetching inventory",
        },
      );
    }

    return createServerResponse({
      success: true,
      message: "Inventory fetched successfully",
      data,
    });
  } catch (error: any) {
    Sentry.captureException(error, {
      tags: {
        stack: "getInventory",
      },
    });
    handleError(error, "getInventory");
    return createServerResponse(
      { success: false, message: error.message ?? "Error fetching inventory" },
    );
  }
}
