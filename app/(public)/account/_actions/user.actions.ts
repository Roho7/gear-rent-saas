"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { Tables } from "@/packages/supabase.types";
import { cookies } from "next/headers";

export const fetchUser = async (
  id: string,
): Promise<Tables<"tbl_users"> | null> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  try {
    const { data: userData, error: userError } = await supabase
      .from("tbl_users")
      .select("*")
      .eq("user_id", id)
      .returns<Tables<"tbl_users">>()
      .maybeSingle();
    console.log("Fetched user data:", userData);
    if (userError) {
      console.error("Error fetching user data:", userError);
      return null;
    }
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
