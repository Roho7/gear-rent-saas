"use server";

import { createServerActionClient } from "@/app/_utils/supabase";
import { cookies } from "next/headers";

export async function validateAndReturnBookingPrice(
  listingId: string,
  duration: string,
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

    const parsedDuration = parseInt(duration);
    let price = listing.base_price * parsedDuration;

    if (parsedDuration >= 7) {
      // Apply discount_3 for rentals of 7 days or more
      price *= 1 - (listing.discount_3 || 0) / 100;
    } else if (parsedDuration >= 3) {
      // Apply discount_2 for rentals of 3-6 days
      price *= 1 - (listing.discount_2 || 0) / 100;
    } else if (parsedDuration >= 2) {
      // Apply discount_1 for rentals of 2 days
      price *= 1 - (listing.discount_1 || 0) / 100;
    }

    // Round to two decimal places
    price = Math.round(price);
    return price;
  } catch (error) {
    throw error;
  }
}
