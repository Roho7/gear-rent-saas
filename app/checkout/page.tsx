"use client";
import { useProducts } from "@/app/_providers/useProducts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import { PLATFORM_FEE } from "@/src/entities/models/constants";
import { CheckoutUserFormSchema } from "@/src/entities/models/formSchemas";
import { ListingType } from "@/src/entities/models/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { getSingleListingDetails } from "../(public)/(store)/store/_actions/store-inventory.action";
import BackButton from "../_components/_shared/back-button";
import { validateAndReturnBookingPrice } from "./_actions/checkout.actions";
import CheckoutButton from "./_components/checkout-btn";
import CheckoutUserDetails from "./_components/checkout-lhs";

const CheckoutPage = () => {
  const { productGroups, allStores } = useProducts();
  const searchParams = useSearchParams();
  const [listingDetails, setListingDetails] = useState<ListingType>();
  const [price, setPrice] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onFormSubmit = (data: z.infer<typeof CheckoutUserFormSchema>) => {
    console.log(data);
  };

  const handleBookNowClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    }
  };

  const handleFormValidityChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  const productDetails = useMemo(() => {
    return productGroups.find(
      (p) => p.product_group_id === listingDetails?.product_group_id,
    );
  }, [searchParams, listingDetails?.product_group_id]);

  const storeDetails = useMemo(() => {
    return allStores.find((s) => s.store_id === listingDetails?.store_id);
  }, [searchParams, listingDetails?.store_id]);

  const duration = parseInt(searchParams.get("duration") || "0");
  const quantity = parseInt(searchParams.get("quantity") || "0");

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

  return (
    <div className="grid grid-cols-3 w-full gap-2 relative">
      <div className=" col-span-2">
        <BackButton />
        <CheckoutUserDetails
          onSubmit={onFormSubmit}
          formRef={formRef}
          onValidityChange={handleFormValidityChange}
        />
      </div>
      <Card className="max-h-fit sticky top-40">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">Your order</h1>
          </CardTitle>
          <CardDescription>
            <p>Review your order</p>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center">
          <div className="h-40 w-40 overflow-hidden rounded-md">
            <img
              src={productDetails?.image_url || ""}
              alt=""
              className=" object-cover w-full h-full"
            />
          </div>
          <h2>{productDetails?.product_group_name}</h2>
        </CardContent>
        <CardFooter className="flex flex-col w-full">
          <div className="grid grid-cols-2 w-full text-muted text-xs">
            <span>
              {formatPrice({
                base_price: price,
                currency_code: listingDetails?.currency_code,
              })}{" "}
              x {quantity}
            </span>
            <span className="text-right text-primary text-sm">
              {!duration || !price || !quantity
                ? "-"
                : formatPrice({
                    base_price: totalPriceBeforePlatformFee,
                    currency_code: listingDetails?.currency_code,
                  })}
              <p className="text-right text-xs text-muted">
                For {duration} {duration && duration > 1 ? "days" : "day"}
              </p>
            </span>
            <span>Platform fee</span>
            <span className="text-right text-primary text-sm">
              {formatPrice({
                base_price: totalPriceBeforePlatformFee * PLATFORM_FEE,
                currency_code: listingDetails?.currency_code,
              })}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-2 w-full">
            <span>Total</span>
            <span className="text-right text-primary">
              {formatPrice({
                base_price: totalPriceAfterPlatformFee,
                currency_code: listingDetails?.currency_code,
              })}
            </span>
          </div>
          <CheckoutButton
            listing={listingDetails}
            price={price}
            callback={handleBookNowClick}
            disabled={!isFormValid}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutPage;
