import { useProducts } from "@/app/_providers/useProducts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { InventoryType } from "@/supabase/types";
import { useRouter } from "next/navigation";

type Props = {
  inventoryItem: InventoryType;
};

const InventoryItemCard = ({ inventoryItem }: Props) => {
  const { products } = useProducts();
  const router = useRouter();
  return (
    <Card
      className="flex flex-col gap-2 hover:bg-card/10"
      role="button"
      onClick={() => {
        router.push(`/inventory/${inventoryItem.inventory_id}`);
      }}
    >
      <CardHeader>
        <div className="">
          {inventoryItem.product_title}{" "}
          <p className="text-gray-400 text-xs">{inventoryItem.inventory_id}</p>
        </div>
        {inventoryItem.category && (
          <Badge variant="outline" className="capitalize mr-auto">
            {inventoryItem.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="h-40 w-40 mx-auto">
          <img
            src={
              products.find((d) => d.product_id === inventoryItem.product_id)
                ?.image_url || ""
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
          {inventoryItem.base_price} /{" "}
          {inventoryItem.price_granularity === "daily" ? "day" : "hour"}
        </h2>
      </CardFooter>
    </Card>
  );
};

export default InventoryItemCard;
