"use client";
import { useInventory } from "../_providers/useInventory";
import AddInventoryItemModal from "./_components/add-inventory.modal";
import InventoryItemCard from "./_components/inventory.card";

type Props = {};

const InventoryPage = (props: Props) => {
  const { inventory } = useInventory();
  return (
    <div>
      <AddInventoryItemModal />
      <div className="flex flex-col gap-2">
        {inventory?.map((item) => (
          <InventoryItemCard inventoryItem={item} key={item.inventory_id} />
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
