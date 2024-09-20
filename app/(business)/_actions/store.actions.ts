"use server";
import { createServerActionClient } from "@/app/_utils/supabase";

import { AuthenticationError } from "@/src/entities/models/errors";
import {
  BusinessType,
  GearyoServerActionResponse,
} from "@/src/entities/models/types";

import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function getBusiness(
  { store_id }: { store_id?: string },
): Promise<GearyoServerActionResponse<BusinessType | undefined>> {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const {
    data: { session },
    error: session_error,
  } = await supabase.auth.refreshSession();

  if (session_error || !session?.access_token) {
    throw new AuthenticationError("No session found", "getBusiness");
  }

  let res: PostgrestSingleResponse<BusinessType> = {
    error: null,
    data: {} as BusinessType,
    count: null,
    status: 200,
    statusText: "OK",
  };

  // If the error is due to a failed fetch, try again up to 3 times
  let retries = 0;
  while (retries < 3) {
    res = await supabase
      .rpc("_func_get_business", { store_id_input: store_id })
      .returns<BusinessType>();

    if (
      res.error &&
      (res.error.message.includes("Failed to fetch") ||
        res.error.message.includes("Load failed"))
    ) {
      retries++;
    } else {
      break;
    }
  }

  if (res.error) {
    throw new Error(res.error.message, { cause: res.error });
  }

  const { data } = res;

  // const jwt = jwtDecode(session.access_token);
  // const session_store_id: string[] = (jwt as any).app_metadata;

  // console.log("session_store_id", session_store_id);
  // const db_org_ids = data?.store.store_id;

  // const is_org_id_in_jwt = db_org_ids.every((store_id) =>
  //   session_org_ids.includes(store_id)
  // );

  // if (!is_org_id_in_jwt) {
  //   const {
  //     data: { session },
  //     error: session_error,
  //   } = await supabase.auth.refreshSession();

  //   if (session_error || !session) {
  //     throw new Error(session_error?.message ?? "Could not refresh session", {
  //       cause: session_error,
  //     });
  //   }

  //   await supabase.auth.setSession(session);
  // }

  return {
    success: true,
    message: "Business fetched successfully",
    data,
  };
}
