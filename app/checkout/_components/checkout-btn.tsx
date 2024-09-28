"use client";

import { useAuth } from "@/app/_providers/useAuth";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { createBooking } from "../_actions/checkout.actions";
import { useCheckout } from "../_providers/useCheckout";

export default function CheckoutButton({
  listing,
  price,
  ...props
}: {
  listing: ListingType | undefined;
  price: number;
} & ButtonProps) {
  const searchParams = useSearchParams();
  const {
    handleSubmit,
    formState: { isValid },
  } = useFormContext();

  const { user } = useAuth();
  const router = useRouter();
  const { totalPriceAfterPlatformFee, rentFrom, rentTill, quantity } =
    useCheckout();

  const onSubmit = async (formData: any) => {
    if (!listing) {
      toast({
        title: "Error",
        description: "Listing details are missing",
        variant: "destructive",
      });
      return;
    }

    try {
      if (
        !listing?.listing_id ||
        !user?.user_id ||
        !listing?.store_id ||
        !rentFrom ||
        !rentTill ||
        quantity < 1
      ) {
        throw new Error("Invalid data");
      }
      const res = await createBooking({
        data: {
          listing_id: listing?.listing_id,
          user_id: user?.user_id,
          store_id: listing?.store_id,
          total_price: totalPriceAfterPlatformFee,
          currency_code: listing?.currency_code || "GBP",
          quantity: quantity,
          booking_date: new Date().toISOString(),
          start_date: rentFrom.toISOString(),
          end_date: rentTill.toISOString(),
          booking_customer_details: formData.customerDetails,
          booking_user_details: formData.userDetails,
          status: "payment_pending",
        },
      });
      if (!res.data || !res.success) {
        toast({
          title: "Error",
          description: "Failed to create booking",
          variant: "destructive",
        });
        return;
      }
      // router.push()
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: res.data?.booking_id,
          productId: listing.product_group_id,
          listingId: listing.listing_id,
          price: price,
          storeId: listing.store_id,
          quantity: searchParams.get("quantity") || 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        toast({
          title: "Stripe Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during checkout",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <Button
            className="w-full mt-2"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || props.disabled}
            {...props}
          >
            Book Now
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="bg-background"
          hidden={isValid && !props.disabled}
        >
          <p className="text-foreground">
            Fill in all required details to book
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
