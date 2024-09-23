"use client";

import { toast } from "@/components/ui/use-toast";
import {
  BusinessType,
  GearyoUser,
  ListingType,
  StoreType,
} from "@/src/entities/models/types";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { deleteListing } from "../inventory/listings/[listing_id]/_actions/inventory.actions";

interface InventoryContextValue {
  inventory: ListingType[] | undefined;
  storeDetails: StoreType | undefined;
  businessUser: GearyoUser | undefined;
  isLoading: boolean;
  handleDeleteListing: (listing_id: string) => void;
  refreshBusinessData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined,
);

export const InventoryProvider = ({
  business,
  children,
  refreshBusiness,
}: {
  business: BusinessType | null;
  children: React.ReactNode;
  refreshBusiness: () => Promise<void>;
}) => {
  const [storeDetails, setStoreDetails] = useState<StoreType>();
  const [inventory, setInventory] = useState<ListingType[]>();
  const [businessUser, setBusinessUser] = useState<GearyoUser>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteListing = async (listing_id: string) => {
    try {
      const { success, message } = await deleteListing(listing_id);
      if (success) {
        toast({
          title: message,
        });
        refreshBusinessData();
        router.push("/inventory/listings");
      }
    } catch (error: any) {
      toast({
        title: "Could not delete listing",
        variant: "destructive",
        description: error.message ?? "Please try again later",
      });
    }
  };

  const refreshBusinessData = useCallback(async () => {
    setIsLoading(true);
    try {
      await refreshBusiness();
    } finally {
      setIsLoading(false);
    }
  }, [refreshBusiness]);

  useEffect(() => {
    setStoreDetails(business?.store);
    setInventory(business?.inventory);
    setBusinessUser(business?.user);
  }, [business]);

  const value: InventoryContextValue = useMemo(
    () => ({
      inventory,
      storeDetails,
      businessUser,
      isLoading,
      handleDeleteListing,
      refreshBusinessData,
    }),
    [inventory, storeDetails, isLoading, business, refreshBusinessData],
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
