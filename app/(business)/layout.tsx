"use client";

import { BusinessType } from "@/src/entities/models/types";
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
        const { success, data, message } = await getBusiness({});
        if (success) {
          setBusinessData(data || null);
        }
      } catch (error: any) {
        setBusinessData(null);
        throw new Error(error.message);
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
