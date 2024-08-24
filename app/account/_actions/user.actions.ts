"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { Tables } from "@/supabase/supabase.types";
import { cookies } from "next/headers";

export const fetchUser = async (
  id: string,
): Promise<Tables<"tbl_users"> | null> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });
  const { data: userData, error: userError } = await supabase.from("tbl_users")
    .select("*").eq("user_id", id).returns<Tables<"tbl_users">>().maybeSingle();

  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
  }

  console.log("User data:", userData);

  return userData;
};
