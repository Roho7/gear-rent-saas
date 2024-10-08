"use server";
import { createServerActionClient } from "@/app/_utils/supabase";
import { createServerResponse } from "@/lib/serverResponse";

import { UnknownError } from "@/src/entities/models/errors";
import { cookies } from "next/headers";

export const deleteStore = async (store_id: string) => {
  const cookiesStore = cookies();
  const supabase = createServerActionClient({ cookies: cookiesStore });

  const { data, error } = await supabase.from("tbl_stores").delete().eq(
    "store_id",
    store_id,
  );

  if (error) {
    console.error("Error deleting store:", error);
    return null;
  }
  return data;
};

export const uploadStoreImage = async (
  { store_id, file }: { store_id: string | undefined; file: File },
) => {
  try {
    const cookiesStore = cookies();
    const supabase = createServerActionClient({ cookies: cookiesStore });
    if (!store_id) return;
    const { data, error } = await supabase.storage
      .from("store")
      .upload(`store-${store_id}`, file, {
        upsert: true,
      });

    if (error) {
      console.error("Error uploading store image:", error);
      return;
    }
    return createServerResponse({
      success: true,
      message: "Store image uploaded",
      data,
    });
  } catch (error: any) {
    throw new UnknownError(
      "Error uploading store image",
      "uploadStoreImage",
      error.message,
    );
  }
};
