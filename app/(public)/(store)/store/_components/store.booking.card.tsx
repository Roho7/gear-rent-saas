import DateRangeSelector from "@/app/_components/_shared/date-range-selector";
import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  formatPriceGranularity,
  getTotalPriceWithPlatformFee,
} from "@/lib/utils";
import { ListingType } from "@/src/entities/models/types";
import { differenceInDays } from "date-fns";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import QuantityCounter from "./quantity-counter";

type StoreBookingCardPropsType = {
  listing: ListingType;
};

const StoreBookingCard = ({ listing }: StoreBookingCardPropsType) => {
  const { user, setIsLoginModalOpen } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rentPeriod, setRentPeriod] = useState<DateRange | undefined>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const fromParam = searchParams.get("rentFrom");
    const tillParam = searchParams.get("rentTill");

    const from = fromParam ? new Date(fromParam) : today;
    const to = tillParam ? new Date(tillParam) : today;

    // Check if the dates are valid
    const isValidFrom = !isNaN(from.getTime());
    const isValidTo = !isNaN(to.getTime());

    return {
      from: isValidFrom ? from : today,
      to: isValidTo ? to : today,
    };
  });
  const [quantity, setQuantity] = useState(1);

  const handleBookingBtnClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const currentParams = new URLSearchParams(searchParams.toString());
    const from = dayjs(rentPeriod?.from).format("YYYY-MM-DD");
    const to = dayjs(rentPeriod?.to).format("YYYY-MM-DD");

    // Construct the new URL
    const newUrl = `/checkout?listing_id=${
      listing.listing_id
    }&product_group_id=${
      listing.product_group_id
    }&quantity=${quantity}&rentFrom=${from}&rentTill=${to}&duration=${duration}&${currentParams.toString()}`;

    router.push(newUrl);
  };

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const duration = useMemo(() => {
    return differenceInDays(rentPeriod?.to || "", rentPeriod?.from || "") + 1;
  }, [rentPeriod?.from, rentPeriod?.to]);

  const granularPrice = useMemo(() => {
    let price = 0;

    price = listing.base_price || 0;

    // Apply discounts based on duration
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

    // Round to two decimal places
    return price;
  }, [
    rentPeriod?.from,
    rentPeriod?.to,
    listing.price_granularity,
    listing.base_price,
    listing.discount_1,
    listing.discount_2,
    listing.discount_3,
  ]);

  const totalPriceBeforePlatformFee = useMemo(() => {
    return granularPrice * duration * quantity;
  }, [granularPrice, duration, quantity]);

  const totalPriceWithPlatformFee = useMemo(() => {
    return getTotalPriceWithPlatformFee(totalPriceBeforePlatformFee);
  }, [totalPriceBeforePlatformFee]);

  return (
    <Card className="max-w-fit h-fit mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          {formatPrice({
            base_price: granularPrice,
            currency_code: listing?.currency_code,
          })}{" "}
          {formatPriceGranularity(listing?.price_granularity || null)}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <QuantityCounter
          quantity={quantity}
          setQuantity={setQuantity}
          availableUnits={listing.available_units ?? 0}
        />
        <p className="text-xs text-muted">Dates</p>
        <DateRangeSelector
          rentPeriod={rentPeriod}
          setRentPeriod={setRentPeriod}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-end">
        <div className="grid grid-cols-2 w-full text-muted text-xs">
          <span>
            {formatPrice({
              base_price: granularPrice * duration,
              currency_code: listing.currency_code,
            })}{" "}
            x {quantity}
          </span>
          <span className="text-right text-primary text-sm">
            {!duration || !granularPrice || !quantity
              ? "-"
              : formatPrice({
                  base_price: totalPriceBeforePlatformFee,
                  currency_code: listing.currency_code,
                })}
            <p className="text-right text-xs text-muted">
              For {duration} {duration > 1 ? "days" : "day"}
            </p>
          </span>
          <span>Platform fee</span>
          <span className="text-right text-primary text-sm">
            {formatPrice({
              base_price: totalPriceWithPlatformFee.platformFee,
              currency_code: listing.currency_code,
            })}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="grid grid-cols-2 w-full">
          <span>Total</span>
          <span className="text-right text-primary">
            {formatPrice({
              base_price: totalPriceWithPlatformFee.total,
              currency_code: listing.currency_code,
            })}
          </span>
        </div>

        <Button
          className="w-full my-2"
          disabled={
            !quantity || !duration || !granularPrice || !listing.available_units
          }
          onClick={handleBookingBtnClick}
        >
          {!listing.available_units ? "Sold Out" : "Book Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreBookingCard;
