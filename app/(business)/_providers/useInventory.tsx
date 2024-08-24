"use client";
import { InventoryType } from "@/supabase/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getInventory } from "../_actions/inventory.actions";

interface InventoryContextValue {
  inventory: InventoryType[] | undefined;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined,
);

export const InventoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inventory, setInventory] = useState<InventoryType[]>();

  const fetchInventory = async () => {
    const inventory = await getInventory();
    setInventory(inventory);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const value: InventoryContextValue = useMemo(
    () => ({
      inventory,
    }),
    [inventory],
  );
  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextValue => {
  const inventoryContext = useContext(InventoryContext);

  if (!inventoryContext) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }

  return inventoryContext;
};
