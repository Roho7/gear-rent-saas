import { useProducts } from "@/app/_providers/useProducts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InventoryType } from "@/supabase/types";

type Props = {
  inventoryItem: InventoryType;
};

const InventoryItemCard = ({ inventoryItem }: Props) => {
  const { products } = useProducts();
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent className="flex gap-2">
        <div className="h-40 ">
          <img
            src={
              products.find((d) => d.product_id === inventoryItem.product_id)
                ?.image_url || ""
            }
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <ul className="flex flex-col w-full">
          <li className="flex justify-between w-full items-center">
            {inventoryItem.product_title}{" "}
            <span className="text-gray-400 text-xs">
              {inventoryItem.product_id}
            </span>
          </li>
          <li></li>
          <li>{inventoryItem.category}</li>
          <li>{inventoryItem.total_units}</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default InventoryItemCard;
