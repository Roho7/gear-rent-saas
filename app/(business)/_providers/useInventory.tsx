"use client";
import { Tables } from "@/supabase/supabase.types";
import { InventoryType, StoreType } from "@/supabase/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getInventory } from "../_actions/inventory.actions";

interface InventoryContextValue {
  inventory: InventoryType[] | null;
  storeDetails: StoreType | null;
  fetchInventory: () => Promise<void>;
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined,
);

export const InventoryProvider = ({
  user,
  children,
}: {
  user: Tables<"tbl_users"> | null;
  children: React.ReactNode;
}) => {
  const [storeDetails, setStoreDetails] = useState<StoreType | null>(null);
  const [inventory, setInventory] = useState<InventoryType[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    if (!user?.store_id) {
      console.log("User does not have a store ID");
      setIsLoading(false);
      return;
    }
    try {
      const data: {
        store_details: StoreType;
        inventory: InventoryType[];
      } | null = await getInventory(user?.store_id || null);
      if (!data) {
        return;
      }
      setStoreDetails(data.store_details);
      setInventory(data.inventory);

      console.log("Fetched inventory from server");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.store_id) {
      fetchInventory();
    }
    setIsLoading(false);
  }, [user]);

  const value: InventoryContextValue = useMemo(
    () => ({
      inventory,
      storeDetails,
      fetchInventory,
      isLoading,
    }),
    [inventory, storeDetails, isLoading],
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
