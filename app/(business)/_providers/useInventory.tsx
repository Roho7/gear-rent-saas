"use client";

import {
  BusinessType,
  GearyoUser,
  ListingType,
  StoreType,
} from "@/src/entities/models/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface InventoryContextValue {
  inventory: ListingType[] | undefined;
  storeDetails: StoreType | undefined;
  businessUser: GearyoUser | undefined;
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined,
);

export const InventoryProvider = ({
  business,
  children,
}: {
  business: BusinessType | null;
  children: React.ReactNode;
}) => {
  const [storeDetails, setStoreDetails] = useState<StoreType>();
  const [inventory, setInventory] = useState<ListingType[]>();
  const [businessUser, setBusinessUser] = useState<GearyoUser>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Business data:", business);
    setStoreDetails(business?.store);
    setInventory(business?.inventory);
    setBusinessUser(business?.user);
  }, []);

  const value: InventoryContextValue = useMemo(
    () => ({
      inventory,
      storeDetails,
      businessUser,
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
