"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { Tables } from "@/packages/supabase.types";
import { DatabaseError } from "@/src/entities/models/errors";
import { cookies } from "next/headers";

export const fetchUser = async (): Promise<Tables<"tbl_users"> | null> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  try {
    const sessionUser = await supabase.auth.getUser();

    if (!sessionUser?.data?.user?.id) {
      throw new DatabaseError("Session user not found", "fetchUser");
    }
    const { data: userData, error: userError } = await supabase
      .from("tbl_users")
      .select("*")
      .eq("user_id", sessionUser?.data?.user?.id)
      .returns<Tables<"tbl_users">>()
      .maybeSingle();

    if (userError) {
      throw new DatabaseError(
        "Failed to fetch user data",
        "fetchUser",
        userError.message,
      );
    }
    return userData;
  } catch (error: any) {
    throw new DatabaseError(
      "Error fetching user data",
      "fetchUser",
      error.message,
    );
  }
};
