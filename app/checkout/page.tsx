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
import { toast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import { ListingType } from "@/src/entities/models/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSingleListingDetails } from "../(public)/(store)/store/_actions/store-inventory.action";
import BackButton from "../_components/_shared/back-button";
import { validateAndReturnBookingPrice } from "./_actions/checkout.actions";
import CheckoutButton from "./_components/checkout-btn";
import CheckoutUserDetails from "./_components/checkout-lhs";

const CheckoutPage = () => {
  const { allProducts, allStores } = useProducts();
  const searchParams = useSearchParams();
  const [listingDetails, setListingDetails] = useState<ListingType>();
  const [price, setPrice] = useState(0);

  const productDetails = useMemo(() => {
    return allProducts.find((p) => p.product_id === listingDetails?.product_id);
  }, [searchParams, listingDetails?.product_id]);

  const storeDetails = useMemo(() => {
    return allStores.find((s) => s.store_id === listingDetails?.store_id);
  }, [searchParams, listingDetails?.store_id]);

  const duration = searchParams.get("duration");
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
  return (
    <div className="grid grid-cols-3 w-full gap-2 relative">
      <div className=" col-span-2">
        <BackButton />
        <CheckoutUserDetails />
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
          <h2>{productDetails?.product_title}</h2>
        </CardContent>
        <CardFooter className="flex flex-col w-full">
          <div className="flex justify-between w-full">
            <span>Total:</span>
            <span>
              {formatPrice({
                base_price: price * quantity,
                currency_code: listingDetails?.currency_code,
              })}
            </span>
          </div>
          <p className="ml-auto text-sm text-muted">
            Qty.: {searchParams.get("quantity")}
          </p>
          <p className="ml-auto text-sm text-muted">
            For {searchParams.get("duration")} days
          </p>
          <CheckoutButton listing={listingDetails} price={price} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutPage;
