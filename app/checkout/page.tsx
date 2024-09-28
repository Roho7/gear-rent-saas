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
import { formatPrice, formatProductName } from "@/lib/utils";
import { PLATFORM_FEE } from "@/src/entities/models/constants";
import { CheckoutCustomerFormSchema } from "@/src/entities/models/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import BackButton from "../_components/_shared/back-button";
import { useAuth } from "../_providers/useAuth";
import CheckoutButton from "./_components/checkout-btn";
import CheckoutCustomerDetailsForm from "./_components/checkout-customer-details.form";
import CheckoutUserDetailsForm, {
  CheckoutUserDetailsFormSchema,
} from "./_components/checkout-user-details.form";
import { useCheckout } from "./_providers/useCheckout";

const CheckoutFormSchema = z.object({
  userDetails: CheckoutUserDetailsFormSchema,
  customerDetails: CheckoutCustomerFormSchema,
});

const CheckoutPage = () => {
  const { user } = useAuth();

  const {
    listingDetails,
    totalPriceAfterPlatformFee,
    totalPriceBeforePlatformFee,
    duration,
    quantity,
    price,
  } = useCheckout();
  const { productGroups, allStores } = useProducts();

  const methods = useForm<z.infer<typeof CheckoutFormSchema>>({
    resolver: zodResolver(CheckoutFormSchema),
    mode: "onChange",
    defaultValues: {
      userDetails: {
        email: user?.email || "",
        name: user?.name || "",
        phone: user?.phone || "",
      },
      customerDetails: {
        customers: Array(quantity).fill({
          name: "",
          gender: "",
          age: "",
          height: "",
          weight: "",
          shoeSize: "",
        }),
      },
    },
  });

  const productDetails = useMemo(() => {
    return productGroups.find(
      (p) => p.product_group_id === listingDetails?.product_group_id,
    );
  }, [listingDetails?.product_group_id]);

  const storeDetails = useMemo(() => {
    return allStores.find((s) => s.store_id === listingDetails?.store_id);
  }, [listingDetails?.store_id]);

  useEffect(() => {
    if (user) {
      methods.setValue("userDetails", {
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  return (
    <>
      <BackButton />
      <FormProvider {...methods}>
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="grid grid-cols-3 w-full gap-2 relative">
            <div className="col-span-2 flex flex-col gap-2">
              <CheckoutUserDetailsForm />
              <CheckoutCustomerDetailsForm />
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
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2>
                  {formatProductName({
                    product_group_name: productDetails?.product_group_name,
                    sport: productDetails?.sport,
                    gender: listingDetails?.gender || "unisex",
                    size: listingDetails?.size,
                    type: listingDetails?.type,
                  })}
                </h2>
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
                  disabled={!methods.formState.isValid}
                />
              </CardFooter>
            </Card>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default CheckoutPage;
