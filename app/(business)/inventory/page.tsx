"use client";
import { useInventory } from "../_providers/useInventory";
import AddInventoryItemModal from "./_components/add-inventory.modal";

type Props = {};

const InventoryPage = (props: Props) => {
  const { inventory } = useInventory();
  return (
    <div>
      <AddInventoryItemModal />
      {inventory?.map((item) => (
        <div key={item.inventory_id}>{item.store_id}</div>
      ))}
    </div>
  );
};

export default InventoryPage;
