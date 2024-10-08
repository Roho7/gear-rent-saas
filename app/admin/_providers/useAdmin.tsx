"use client";

import { ListingType } from "@/src/entities/models/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getInventory } from "../_actions/admin.actions";

interface AdminContext {
  allListings: ListingType[] | undefined;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContext | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [allListings, setAllListings] = useState<ListingType[]>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllInventory = async () => {
    setIsLoading(true);
    const res = await getInventory();
    setAllListings(res.data as ListingType[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllInventory();
  }, []);

  const value: AdminContext = useMemo(
    () => ({
      allListings,
      isLoading,
    }),
    [allListings, isLoading],
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
