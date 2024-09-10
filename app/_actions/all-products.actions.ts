"use server";
import { handleError } from "@/lib/errorHandler";
import { createServerResponse } from "@/lib/serverResponse";
import { Tables } from "@/packages/supabase.types";
import { GearyoServerActionResponse } from "@/packages/types";
import { DatabaseError } from "@/src/entities/models/errors";
import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import { createServerActionClient } from "../_utils/supabase";

export const getAllProducts = async (): Promise<
  GearyoServerActionResponse<Tables<"tbl_products">[]>
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
      throw new DatabaseError("Error fetching products", error.message);
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
