"use client";
import { InventoryType } from "@/supabase/types";
import { DBSchema, openDB } from "idb";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getInventory } from "../_actions/inventory.actions";
interface InventoryDb extends DBSchema {
  inventory: {
    key: string;
    value: InventoryType;
  };
}
interface InventoryContextValue {
  inventory: InventoryType[] | null;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined,
);

export const InventoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inventory, setInventory] = useState<InventoryType[] | null>(null);

  const dbPromise = useMemo(() => {
    return openDB<InventoryDb>("InventoryDatabase", 1, {
      upgrade(db) {
        db.createObjectStore("inventory", {
          keyPath: "inventory_id",
        });
      },
    });
  }, []);

  const fetchInventory = async ({
    hardRefresh = false,
  }: {
    hardRefresh?: boolean;
  }) => {
    const db = await dbPromise;
    const cachedData = await db?.getAll("inventory");

    if (cachedData && !hardRefresh) {
      setInventory(cachedData);
      console.log("Fetched inventory from cache");
    }
    const inventory: InventoryType[] | null = await getInventory();
    if (!inventory) {
      return;
    }
    setInventory(inventory);
    const inventoryTransaction = db.transaction("inventory", "readwrite");
    await Promise.all(inventory.map((i) => inventoryTransaction.store.add(i)));
    console.log("Fetched inventory from server");
  };

  useEffect(() => {
    fetchInventory({ hardRefresh: false });
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
