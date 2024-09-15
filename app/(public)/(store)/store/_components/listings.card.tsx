import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AvailableListingsType,
  ProductType,
} from "@/src/entities/models/types";
import { Calendar, MapPin } from "lucide-react";
import { useMemo } from "react";

const ListingsCard = ({
  listing,
  loading,
  showFooter = true,
}: {
  listing: AvailableListingsType;
  loading: boolean;
  showFooter?: boolean;
}) => {
  const { allProducts, allStores } = useProducts();

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: listing?.currency_code ?? "GBP",
    }).format(listing.base_price);
  }, [listing.base_price, listing?.currency_code]);

  const formattedDistance = useMemo(() => {
    if (listing.distance === null) return "N/A";
    return `${listing.distance?.toFixed(2)} km`;
  }, [listing.distance]);

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

        <div className="flex items-center gap-2 w-full">
          <MapPin className="h-4 w-4" />
          <span>{formattedDistance}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{`${new Date(
            listing.available_from,
          ).toLocaleDateString()} - ${new Date(
            listing.available_until,
          ).toLocaleDateString()}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{formattedPrice} / day</span>
        </div>
      </CardContent>
      {showFooter && (
        <CardFooter className="flex flex-col items-start gap-1 mt-auto">
          <p className="text-secondary">{storeDetails?.store_name} </p>
          <Button className="w-full">View Details</Button>
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

export default ListingsCard;
