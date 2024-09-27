"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { createServerResponse } from "@/lib/serverResponse";
import { TablesInsert } from "@/packages/supabase.types";
import { PLATFORM_FEE } from "@/src/entities/models/constants";
import { cookies } from "next/headers";

export async function validateAndReturnBookingPrice(
  listingId: string,
  duration: number,
): Promise<number> {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  try {
    // Fetch the listing details
    const { data: listing, error } = await supabase
      .from("tbl_listings")
      .select("*")
      .eq("listing_id", listingId)
      .single();

    if (error) throw error;
    if (!listing) throw new Error("Listing not found");

    // Calculate base price
    if (!listing.base_price) {
      throw new Error("Listing price not found");
    }

    let price = listing.base_price * duration;

    if (duration >= 7) {
      // Apply discount_3 for rentals of 7 days or more
      price *= 1 - (listing.discount_3 || 0) / 100;
    } else if (duration >= 3) {
      // Apply discount_2 for rentals of 3-6 days
      price *= 1 - (listing.discount_2 || 0) / 100;
    } else if (duration >= 2) {
      // Apply discount_1 for rentals of 2 days
      price *= 1 - (listing.discount_1 || 0) / 100;
    }

    price = price * (1 + PLATFORM_FEE);
    // Round to two decimal places
    price = Math.round(price);
    return price;
  } catch (error) {
    throw error;
  }
}

export async function createBooking(
  { data }: { data: TablesInsert<"tbl_bookings"> },
) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: cookieStore });

  const { data: bookings_data, error } = await supabase.from("tbl_bookings")
    .insert(data).select().single();

  if (error) {
    throw error;
  }

  return createServerResponse({
    success: true,
    message: "Booking created",
    data: bookings_data,
  });
}
