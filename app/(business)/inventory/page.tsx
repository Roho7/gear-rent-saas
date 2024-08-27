"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventory } from "../_providers/useInventory";
import AddInventoryItemModal from "./_components/add-inventory.modal";
import InventoryItemCard from "./_components/inventory.card";

type Props = {};

const InventoryPage = (props: Props) => {
  const { inventory, storeDetails, fetchInventory, isLoading } = useInventory();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div>
        <AddInventoryItemModal />
        <Button onClick={() => fetchInventory()}>Refresh</Button>
      </div>
      <Card>
        <CardHeader>{storeDetails?.store_name} Inventory</CardHeader>
      </Card>
      <div className="flex flex-col gap-2">
        {inventory?.map((item) => (
          <InventoryItemCard inventoryItem={item} key={item.inventory_id} />
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
