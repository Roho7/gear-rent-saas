import { useProducts } from "@/app/_providers/useProducts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  fetchLocationString,
  formatPrice,
  formatProductName,
} from "@/lib/utils";
import { BookingsType } from "@/src/entities/models/types";

import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MiniStoreCard from "../../(public)/(store)/store/_components/mini-store.card";
import BookingStatusBadge from "./booking-status.badge";

type Props = {
  bookingItem: BookingsType;
};

const BookingCard = ({ bookingItem }: Props) => {
  const { productGroups, allStores } = useProducts();
  const router = useRouter();
  const [locationString, setLocationString] = useState<string>("Loading...");

  const productDetails = productGroups.find(
    (p) => p.product_group_id === bookingItem.product_group_id,
  );

  const listingDetails = productGroups.find(
    (p) => p.product_group_id === bookingItem.product_group_id,
  );

  const storeDetails = allStores.find(
    (p) => p.store_id === bookingItem.store_id,
  );

  useEffect(() => {
    const fetchLocation = async () => {
      const res = await fetchLocationString({
        latitude: storeDetails?.latitude || 0,
        longitude: storeDetails?.longitude || 0,
      });
      setLocationString(res);
    };

    fetchLocation();
  }, [storeDetails]);

  return (
    <Card
      className="flex gap-2 hover:bg-card/10 w-full"
      role="button"
      onClick={() => {
        router.push(`/account/booking/${bookingItem.listing_id}`);
      }}
    >
      <CardHeader>
        <div className="h-full w-40">
          <img
            src={
              productGroups.find(
                (d) => d.product_group_id === bookingItem.product_group_id,
              )?.image_url || "/placeholder_image.png"
            }
            alt=""
            className="h-full w-full object-contain rounded-md"
          />
        </div>
      </CardHeader>
      <div className="flex justify-between w-full">
        <CardContent className="flex flex-col gap-2 pt-4 justify-between">
          <div className="">
            {formatProductName({
              product_group_name: productDetails?.product_group_name,
              sport: productDetails?.sport,
            })}
            <h2
              className="font-bold text-primary
        "
            >
              {formatPrice({
                base_price: bookingItem.total_price || 0,
                currency_code: bookingItem.currency_code,
              })}
            </h2>
          </div>

          <div className="flex gap-0.5">
            <Badge
              className="text-xs bg-muted/20 font-normal"
              variant="outline"
            >
              From: {dayjs(bookingItem.start_date).format("ddd, MMM D")}
            </Badge>
            <Badge
              className="text-xs bg-muted/20 font-normal"
              variant="outline"
            >
              To: {dayjs(bookingItem.end_date).format("ddd, MMM D")}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-normal bg-muted/20"
            >
              Qty:{bookingItem.quantity}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-1 mt-auto">
          <BookingStatusBadge status={bookingItem.status} />
          <MiniStoreCard
            store_name={storeDetails?.store_name || ""}
            locationString={locationString}
          />
        </CardFooter>
      </div>
    </Card>
  );
};

export default BookingCard;
