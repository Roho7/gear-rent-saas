import { useProducts } from "@/app/_providers/useProducts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import {
  AvailableListingsType,
  ProductType,
} from "@/src/entities/models/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BiMapPin } from "react-icons/bi";

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
  const { allProducts, allStores } = useProducts();
  const [locationString, setLocationString] = useState<string>("Loading...");

  const handleClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());

    // Construct the new URL
    const newUrl = `/store/${storeDetails?.store_id}/${
      listing.listing_id
    }?product_id=${listing.product_id}&${currentParams.toString()}`;

    router.push(newUrl);
  };

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
    <Card
      className="w-full flex gap-2 min-h-64 hover:bg-background/10 cursor-pointer"
      role="button"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="w-40 h-40">
          <img
            src={productDetails?.image_url || ""}
            alt="img"
            className=" object-cover rounded-md"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 w-full p-4">
        <h3 className="font-bold">{productDetails?.product_title}</h3>
        <div className="text-muted text-xs bg-muted/10 p-2 min-w-40 w-fit rounded-md">
          <div className="flex justify-between items-center mb-1">
            <p>Rent from</p>
          </div>
          <Link
            href="/sellers"
            className="text-primary font-medium text-sm hover:underline"
          >
            {storeDetails?.store_name}{" "}
          </Link>
          <div className="flex items-center gap-2">
            <BiMapPin />
            <span>{locationString}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(listing?.product_metadata).map(([key, value]) => {
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
          })}
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

export default StoreListingRow;
