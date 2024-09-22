import { useProducts } from "@/app/_providers/useProducts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ListingType } from "@/src/entities/models/types";

import { useRouter } from "next/navigation";

type Props = {
  inventoryItem: ListingType;
  showStoreDetails?: boolean;
};

const ListingItemCard = ({
  inventoryItem,
  showStoreDetails = false,
}: Props) => {
  const { productGroups, allStores } = useProducts();
  const router = useRouter();

  const productDetails = productGroups.find(
    (p) => p.product_group_id === inventoryItem.product_group_id,
  );
  return (
    <Card
      className="flex flex-col gap-2 hover:bg-card/10 h-fit"
      role="button"
      onClick={() => {
        router.push(`/inventory/listings/${inventoryItem.listing_id}`);
      }}
    >
      <CardHeader>
        <div className="">
          {productDetails?.product_group_name}
          <p className="text-gray-400 text-xs">{inventoryItem.listing_id}</p>
        </div>
        {productDetails?.sport && (
          <Badge variant="outline" className="capitalize mr-auto">
            {productDetails?.sport}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="h-40 w-40 mx-auto">
          <img
            src={
              productGroups.find(
                (d) => d.product_group_id === inventoryItem.product_group_id,
              )?.image_url || ""
            }
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
        <ul className="flex flex-col w-full">
          <li>{inventoryItem.total_units}</li>
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1 mt-auto">
        <h2
          className="font-bold text-primary
        "
        >
          {formatPrice({
            base_price: inventoryItem.base_price || 0,
            currency_code: inventoryItem.currency_code,
          })}{" "}
          / {inventoryItem.price_granularity === "daily" ? "day" : "hour"}
        </h2>
        {showStoreDetails && (
          <p className="text-muted text-xs">
            {
              allStores.find((p) => p.store_id === inventoryItem.store_id)
                ?.store_name
            }
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default ListingItemCard;
