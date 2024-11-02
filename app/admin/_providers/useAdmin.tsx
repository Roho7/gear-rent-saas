"use client";

import { ListingType, StoreType } from "@/src/entities/models/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getGearyoStores, getInventory } from "../_actions/admin.actions";

interface AdminContext {
  allListings: ListingType[] | undefined;
  gearyoStores: StoreType[] | undefined;
  isLoading: boolean;
  refreshGearyoStores: () => Promise<void>;
}

const AdminContext = createContext<AdminContext | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [allListings, setAllListings] = useState<ListingType[]>();
  const [gearyoStores, setGearyoStores] = useState<StoreType[]>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllInventory = async () => {
    setIsLoading(true);
    const res = await getInventory();
    setAllListings(res.data as ListingType[]);
    setIsLoading(false);
  };

  const fetchGearyoStores = async () => {
    setIsLoading(true);
    const res = await getGearyoStores();
    if (res.success) {
      setGearyoStores(res.data as StoreType[]);
    }
    setIsLoading(false);
  };

  const refreshGearyoStores = async () => {
    await fetchGearyoStores();
  };

  useEffect(() => {
    fetchAllInventory();
    refreshGearyoStores();
  }, []);

  const value: AdminContext = useMemo(
    () => ({
      allListings,
      gearyoStores,
      isLoading,
      refreshGearyoStores,
    }),
    [allListings, gearyoStores, isLoading, refreshGearyoStores],
  );
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContext => {
  const adminContext = useContext(AdminContext);

  if (!adminContext) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return adminContext;
};
