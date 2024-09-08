"use client";
import { BusinessType } from "@/packages/types";
import React, { useEffect, useState } from "react";
import Spinner from "../_components/_shared/spinner";
import { getBusiness } from "./_actions/store.actions";
import { InventoryProvider } from "./_providers/useInventory";

const BusinessLayout = ({ children }: { children: React.ReactElement }) => {
  const [businessData, setBusinessData] = useState<BusinessType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("here");
        const res = await getBusiness({});
        setBusinessData(res || null);
      } catch (error) {
        console.error("Error fetching business data:", error);
        setBusinessData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <InventoryProvider business={businessData}>{children}</InventoryProvider>
  );
};

export default BusinessLayout;
