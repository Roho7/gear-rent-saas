import { useProducts } from "@/app/_providers/useProducts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchLocationString,
  formatPrice,
  formatPriceGranularity,
  formatProductName,
} from "@/lib/utils";
import {
  AvailableListingsType,
  ProductGroupType,
} from "@/src/entities/models/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MiniStoreCard from "./mini-store.card";

const StoreListingRow = ({
  listing,
  loading,
  showFooter = true,
}: {
  listing: AvailableListingsType;
  loading: boolean;
  showFooter?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { allStores, productGroups } = useProducts();
  const [locationString, setLocationString] = useState<string>("Loading...");

  const handleClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());

    // Construct the new URL
    const newUrl = `/store/${storeDetails?.store_id}/${
      listing.listing_id
    }?product_id=${listing.product_group_id}&${currentParams.toString()}`;

    router.push(newUrl);
  };

  const formattedPrice = useMemo(() => {
    return formatPrice({
      base_price: listing.base_price,
      currency_code: listing?.currency_code,
    });
  }, [listing.base_price, listing?.currency_code]);

  useEffect(() => {
    const fetchLocation = async () => {
      const res = await fetchLocationString({
        latitude: listing.latitude,
        longitude: listing.longitude,
      });
      setLocationString(res);
    };

    fetchLocation();
  }, [listing.latitude, listing.longitude]);

  const productDetails: ProductGroupType | undefined = useMemo(() => {
    const prod = productGroups.find(
      (p) => p.product_group_id === listing.product_group_id,
    );
    return prod;
  }, [listing]);

  const storeDetails = useMemo(() => {
    return allStores.find((s) => s.store_id === listing.store_id);
  }, [listing]);

  return loading ? (
    <ListingsCardSkeleton />
  ) : (
    <Card
      className="w-full flex gap-2 min-h-64 hover:bg-background/10 cursor-pointer"
      role="button"
      onClick={handleClick}
    >
      <CardHeader className="h-[300px] w-[500px]">
        <img
          src={productDetails?.image_url || "/placeholder_image.png"}
          alt="product"
          className="object-cover rounded-md w-full h-full"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full p-4">
        <h3 className="font-bold capitalize text-2xl">
          {formatProductName({
            product_group_name: productDetails?.product_group_name,
            sport: productDetails?.sport,
            size: listing?.size,
            gender: listing.gender,
          })}
        </h3>

        <MiniStoreCard
          store_name={storeDetails?.store_name || ""}
          locationString={locationString}
        />
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(listing?.product_metadata || {}).map(
            ([key, value]) => {
              return (
                <div className="" key={key}>
                  <p className="text-xs text-muted capitalize">{key}</p>
                  {value.map((p) => (
                    <Badge key={key + p} className="mr-1" variant={"outline"}>
                      {p}
                    </Badge>
                  ))}
                </div>
              );
            },
          )}
        </div>
      </CardContent>
      {showFooter && (
        <CardFooter className="flex flex-col items-start gap-1 mt-auto">
          <span className="text-xs text-muted">From</span>
          <span className="text-xl font-bold text-primary whitespace-nowrap">
            {formattedPrice} {formatPriceGranularity(listing.price_granularity)}
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

export default StoreListingRow;
