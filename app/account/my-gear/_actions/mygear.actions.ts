"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { cookies } from "next/headers";
import { UserDetailsSchema } from "../_components/edit-user-details.modal";
import { SportsDetailsSchema } from "../page";

export const getUserDetails = async () => {
  const supabase = createServerActionClient({ cookies: cookies() });
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const { data: recordData, error: recordError } = await supabase
    .from("tbl_users")
    .select("user_metadata")
    .eq("user_id", userData?.user?.id).single();

  if (userError || recordError) {
    throw new Error(userError || recordError?.message);
  }
  return recordData.user_metadata;
};

export const updateUserDetails = async (
  userDetails: UserDetailsSchema,
  userId: string,
) => {
  const supabase = createServerActionClient({ cookies: cookies() });

  const { data, error } = await supabase
    .from("tbl_users")
    .update({ user_metadata: userDetails })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserSportsDetails = async () => {
  const supabase = createServerActionClient({ cookies: cookies() });
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const { data, error } = await supabase
    .from("tbl_users")
    .select("sports_metadata")
    .eq("user_id", userData?.user?.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.sports_metadata;
};

export const updateUserSportsDetails = async (
  sportsDetails: SportsDetailsSchema,
  userId: string,
) => {
  const supabase = createServerActionClient({ cookies: cookies() });

  const { data, error } = await supabase
    .from("tbl_users")
    .update({ sports_metadata: sportsDetails })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
