import DateRangeSelector from "@/app/_components/_shared/date-range-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice, formatPriceGranularity } from "@/lib/utils";
import { ListingType } from "@/src/entities/models/types";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import QuantityCounter from "./quantity-counter";

type StoreBookingCardPropsType = {
  listing: ListingType;
};

const StoreBookingCard = ({ listing }: StoreBookingCardPropsType) => {
  const searchParams = useSearchParams();
  const [rentPeriod, setRentPeriod] = useState<DateRange | undefined>({
    from: new Date(searchParams.get("rentFrom") || ""),
    to: new Date(searchParams.get("rentTill") || ""),
  });
  const [quantity, setQuantity] = useState(1);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const duration = useMemo(() => {
    return differenceInDays(rentPeriod?.to || "", rentPeriod?.from || "");
  }, [rentPeriod?.from, rentPeriod?.to]);

  const granularPrice = useMemo(() => {
    let totalPrice = 0;

    totalPrice = listing.base_price || 0;

    // Apply discounts based on duration
    if (duration >= 7) {
      // Apply discount_3 for rentals of 7 days or more
      totalPrice *= 1 - (listing.discount_3 || 0) / 100;
    } else if (duration >= 3) {
      // Apply discount_2 for rentals of 3-6 days
      totalPrice *= 1 - (listing.discount_2 || 0) / 100;
    } else if (duration >= 2) {
      // Apply discount_1 for rentals of 2 days
      totalPrice *= 1 - (listing.discount_1 || 0) / 100;
    }

    // Round to two decimal places
    return totalPrice;
  }, [
    rentPeriod?.from,
    rentPeriod?.to,
    listing.price_granularity,
    listing.base_price,
    listing.discount_1,
    listing.discount_2,
    listing.discount_3,
  ]);

  return (
    <Card>
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
        <div className="flex justify-between w-full">
          <span>Total:</span>
          <span>
            {formatPrice({
              base_price: granularPrice * duration * quantity,
              currency_code: listing.currency_code,
            })}
          </span>
        </div>
        <span className="text-right text-sm text-muted">
          For {duration} days
        </span>
      </CardFooter>
    </Card>
  );
};

export default StoreBookingCard;
