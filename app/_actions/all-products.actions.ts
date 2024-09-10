"use server";
import { handleError } from "@/lib/errorHandler";
import { createServerResponse } from "@/lib/serverResponse";
import { DatabaseError } from "@/src/entities/models/errors";
import {
  GearyoServerActionResponse,
  ProductType,
} from "@/src/entities/models/types";
import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import { createServerActionClient } from "../_utils/supabase";

export const getAllProducts = async (): Promise<
  GearyoServerActionResponse<ProductType[]>
> => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { data, error } = await supabase
      .from("tbl_products")
      .select("*")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false });

    if (error || !data) {
      throw new DatabaseError(
        "Error fetching products",
        "getAllProducts",
        error,
      );
    }
    return createServerResponse({
      success: true,
      message: "Products fetched successfully",
      data,
    });
  } catch (error: any) {
    Sentry.captureException(error, {
      tags: {
        stack: "getAllProducts",
      },
    });
    handleError(error, "getAllProducts");
    return createServerResponse({
      success: false,
      message: "Error fetching products",
    });
  }
};
