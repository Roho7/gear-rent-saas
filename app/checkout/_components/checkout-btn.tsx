"use client";

import { getStripe } from "@/app/_utils/stripe";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ListingType } from "@/src/entities/models/types";
import { useSearchParams } from "next/navigation";

export default function CheckoutButton({
  listing,
  price,
}: {
  listing: ListingType | undefined;
  price: number;
}) {
  const searchParams = useSearchParams();
  const initiateCheckout = async () => {
    try {
      if (!listing) {
        console.error("Listing not provided");
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: listing.product_id,
          listingId: listing.listing_id,
          price: price,
          storeId: listing.store_id,
          quantity: searchParams.get("quantity") || 1,
        }),
      });

      const { sessionId } = await response.json();
      console.log(sessionId);
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({ sessionId });
    } catch (error: any) {
      toast({
        title: "Error while creating checkout session.",
        description:
          error.message ||
          "An error occurred while trying to initiate checkout",
        variant: "destructive",
      });
    }
  };

  return (
    <Button className="w-full" onClick={initiateCheckout}>
      Book Now
    </Button>
  );
}
