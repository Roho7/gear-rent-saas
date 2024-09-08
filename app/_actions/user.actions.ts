"use server";
import { GearyoUser } from "@/packages/types";
import { cookies } from "next/headers";
import { createServerActionClient } from "../_utils/supabase";

export async function getUser(): Promise<GearyoUser | null> {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error("Error fetching user:", error);
    return null;
  }

  const { data: userData, error: userError } = await supabase
    .from("tbl_users")
    .select("*")
    .eq("user_id", data.user.id).single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return null;
  }

  return userData;
}

// export async function checkUserRole(allowedRoles: string[]) {
//   const user = await getUser();
//   if (!user) {
//     console.error("User not found");
//     redirect("/login");
//   }
//   if (allowedRoles.includes("admin") && !user?.is_admin) {
//     redirect("/unauthorized");
//   }
//   if (!allowedRoles.includes("business") && !user.store_id) {
//     redirect("/unauthorized");
//   }
//   return user;
// }
