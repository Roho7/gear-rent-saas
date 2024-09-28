"use client";

import { getSingleListingDetails } from "@/app/(public)/(store)/store/_actions/store-inventory.action";
import { toast } from "@/components/ui/use-toast";
import { PLATFORM_FEE } from "@/src/entities/models/constants";
import { ListingType } from "@/src/entities/models/types";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { validateAndReturnBookingPrice } from "../_actions/checkout.actions";

interface CheckoutContext {
  listingDetails: ListingType | undefined;
  granularPrice: number;
  duration: number;
  quantity: number;
  totalPriceBeforePlatformFee: number;
  totalPriceAfterPlatformFee: number;
  rentFrom: Date | null;
  rentTill: Date | null;
  price: number;
}

const CheckoutContext = createContext<CheckoutContext | undefined>(undefined);

export const CheckoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listingDetails, setListingDetails] = useState<ListingType>();
  const [price, setPrice] = useState<number>(0);
  const [rentFrom, setRentFrom] = useState<Date | null>(null);
  const [rentTill, setRentTill] = useState<Date | null>(null);
  const searchParams = useSearchParams();

  const duration = parseInt(searchParams.get("duration") || "0");
  const quantity = parseInt(searchParams.get("quantity") || "0");

  const granularPrice = useMemo(() => {
    let price = 0;

    price = listingDetails?.base_price || 0;

    // Apply discounts based on duration
    if (duration >= 7) {
      // Apply discount_3 for rentals of 7 days or more
      price *= 1 - (listingDetails?.discount_3 || 0) / 100;
    } else if (duration >= 3) {
      // Apply discount_2 for rentals of 3-6 days
      price *= 1 - (listingDetails?.discount_2 || 0) / 100;
    } else if (duration >= 2) {
      // Apply discount_1 for rentals of 2 days
      price *= 1 - (listingDetails?.discount_1 || 0) / 100;
    }

    // Round to two decimal places
    return price;
  }, [
    listingDetails?.price_granularity,
    listingDetails?.base_price,
    listingDetails?.discount_1,
    listingDetails?.discount_2,
    listingDetails?.discount_3,
  ]);

  const totalPriceBeforePlatformFee = useMemo(() => {
    return granularPrice * duration * quantity;
  }, [granularPrice, duration, quantity]);

  const totalPriceAfterPlatformFee = useMemo(() => {
    return totalPriceBeforePlatformFee * (1 + PLATFORM_FEE);
  }, [totalPriceBeforePlatformFee]);

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        const listing_id = searchParams.get("listing_id");

        if (!listing_id) {
          throw new Error("No listing id provided");
        }
        getSingleListingDetails(listing_id).then((data) => {
          setListingDetails(data);
        });

        if (!duration) {
          throw new Error("No duration provided");
        }
        if (!quantity) {
          throw new Error("No quantity provided");
        }
        const p = await validateAndReturnBookingPrice(listing_id, duration);
        setPrice(p);
        setRentFrom(new Date(searchParams.get("rentFrom") || ""));
        setRentTill(new Date(searchParams.get("rentTill") || ""));
      } catch (error: any) {
        toast({
          title: "Error",
          description: "An error occurred while fetching listing details",
          variant: "destructive",
        });
      }
    };
    getBookingDetails();
  }, [searchParams]);

  const value: CheckoutContext = useMemo(
    () => ({
      listingDetails,
      granularPrice,
      duration,
      quantity,
      totalPriceBeforePlatformFee,
      totalPriceAfterPlatformFee,
      rentFrom,
      rentTill,
      price,
    }),
    [
      listingDetails,
      granularPrice,
      duration,
      quantity,
      totalPriceBeforePlatformFee,
      totalPriceAfterPlatformFee,
      rentFrom,
      rentTill,
      price,
    ],
  );
  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContext => {
  const checkoutContext = useContext(CheckoutContext);

  if (!checkoutContext) {
    throw new Error("useCheckout must be used within an CheckoutProvider");
  }

  return checkoutContext;
};
