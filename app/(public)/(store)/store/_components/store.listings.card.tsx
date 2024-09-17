import { useProducts } from "@/app/_providers/useProducts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import {
  AvailableListingsType,
  ProductType,
} from "@/src/entities/models/types";
import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const StoreListingCard = ({
  listing,
  loading,
  showFooter = true,
}: {
  listing: AvailableListingsType;
  loading: boolean;
  showFooter?: boolean;
}) => {
  const { allProducts, allStores } = useProducts();
  const [locationString, setLocationString] = useState<string>("Loading...");

  const formattedPrice = useMemo(() => {
    return formatPrice({
      base_price: listing.base_price,
      currency_code: listing?.currency_code,
    });
  }, [listing.base_price, listing?.currency_code]);

  useEffect(() => {
    async function fetchLocationString() {
      if (listing.latitude && listing.longitude) {
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${listing.latitude},${listing.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
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
  }, [listing.latitude, listing.longitude]);

  const productDetails: ProductType | undefined = useMemo(() => {
    const prod = allProducts.find((p) => p.product_id === listing.product_id);
    return prod;
  }, [listing]);

  const storeDetails = useMemo(() => {
    return allStores.find((s) => s.store_id === listing.store_id);
  }, [listing]);

  return loading ? (
    <ListingsCardSkeleton />
  ) : (
    <Card className="min-w-64 flex flex-col gap-2 h-full" onClick={() => {}}>
      <CardHeader>
        <CardTitle>
          {productDetails?.product_title ?? "Product Title"}
        </CardTitle>
        <CardDescription className="text-secondary leading-1 truncate">
          {listing.store_id}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="mx-auto">
          <img
            src={productDetails?.image_url || ""}
            alt="img"
            className="max-h-40"
          />
        </div>
        {/* <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{`${new Date(
            listing.available_from,
          ).toLocaleDateString()} - ${new Date(
            listing.available_until,
          ).toLocaleDateString()}`}</span>
        </div> */}
        <div className="text-muted">
          <p className="text-secondary">{storeDetails?.store_name} </p>

          <div className="flex items-center gap-2 w-full">
            <MapPin className="h-4 w-4" />
            <span>{locationString}</span>
          </div>
        </div>
      </CardContent>
      {showFooter && (
        <CardFooter className="flex flex-col items-start gap-1 mt-auto">
          <span className="text-xs text-muted">From</span>
          <span className="text-xl font-bold text-primary">
            {formattedPrice}/{listing.price_granularity}
          </span>
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

export default StoreListingCard;
