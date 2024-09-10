"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { createServerResponse } from "@/lib/serverResponse";
import { DatabaseError, UnknownError } from "@/src/entities/models/errors";
import {
  GearyoServerActionResponse,
  StoreType,
} from "@/src/entities/models/types";
import { cookies } from "next/headers";

export const getAllStores = async (): Promise<
  GearyoServerActionResponse<StoreType[]>
> => {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: cookieStore });
    const { data, error } = await supabase.from("tbl_stores").select("*");
    if (error) {
      console.log(error);
      throw new DatabaseError(
        "Error fetching stores",
        "getStores",
        error,
      );
    }
    return createServerResponse({
      success: true,
      message: "All Stores Fetched",
      data,
    });
  } catch (error: any) {
    if (error instanceof DatabaseError) {
      throw error;
    } else {
      throw new UnknownError(
        "Unknown error fetching stores",
        "getAllStores",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
};
