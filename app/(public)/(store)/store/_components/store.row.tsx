import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreType } from "@/src/entities/models/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaLocationPin } from "react-icons/fa6";

const StoreRow = ({
  store,
  showFooter = true,
}: {
  store: StoreType;
  showFooter?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locationString, setLocationString] = useState<string>("Loading...");

  const handleClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());

    // Construct the new URL
    const newUrl = `/store/${store.store_id}?${currentParams.toString()}`;

    router.push(newUrl);
  };

  useEffect(() => {
    async function fetchLocationString() {
      if (store.latitude && store.longitude) {
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${store.latitude},${store.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
          );
          const data = await res.json();
          if (data.results && data.results[0]) {
            const localityAddress = data.results.find((r: any) =>
              r.types.includes("locality"),
            );
            setLocationString(localityAddress.formatted_address);
          } else {
            setLocationString("Location not available");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setLocationString("Error fetching location");
        }
      } else {
        setLocationString("Location data not available");
      }
    }

    fetchLocationString();
  }, [store.latitude, store.longitude]);

  return (
    <Card
      className="w-full flex gap-2 min-h-32 hover:bg-background/10"
      role="button"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="w-40 h-full">
          <img
            src={store.store_img || "/store_placeholder_img.png"}
            alt={store.store_img || "store"}
            className="h-full w-full object-cover rounded-md"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full p-4">
        <h3 className="font-bold">{store?.store_name}</h3>
        <div className="text-muted flex items-center gap-1 text-xs bg-muted/10 p-2 min-w-40 w-fit rounded-md">
          <FaLocationPin />
          {locationString}
        </div>
      </CardContent>
      {showFooter && (
        <CardFooter className="flex flex-col items-start gap-1 mt-auto">
          <span className="text-xs text-muted">From</span>
          {/* <span className="text-xl font-bold text-primary">
            {formattedPrice}/{store.price_granularity}
          </span> */}
        </CardFooter>
      )}
    </Card>
  );
};

const ListingsCardSkeleton = () => {
  return (
    <div className="min-w-80 flex flex-col gap-2">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export default StoreRow;
