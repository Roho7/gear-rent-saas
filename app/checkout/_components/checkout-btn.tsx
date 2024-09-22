"use client";

import { getStripe } from "@/app/_utils/stripe";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { ListingType } from "@/src/entities/models/types";
import { useSearchParams } from "next/navigation";

export default function CheckoutButton({
  listing,
  price,
  callback,
  ...props
}: {
  listing: ListingType | undefined;
  price: number;
  callback?: () => void;
} & ButtonProps) {
  const searchParams = useSearchParams();
  const initiateCheckout = async () => {
    try {
      callback && callback();
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
          productId: listing.product_group_id,
          listingId: listing.listing_id,
          price: price,
          storeId: listing.store_id,
          quantity: searchParams.get("quantity") || 1,
        }),
      });

      const { sessionId } = await response.json();
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <Button className="w-full mt-2" onClick={initiateCheckout} {...props}>
            Book Now
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background" hidden={!props.disabled}>
          <p className="text-foreground">Fill in the details to book</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
