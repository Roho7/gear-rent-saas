"use client";

import { BusinessType } from "@/src/entities/models/types";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "../_components/_shared/spinner";
import { useAuth } from "../_providers/useAuth";
import { getBusiness } from "./_actions/store.actions";
import { InventoryProvider } from "./_providers/useInventory";

const BusinessLayout = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth();
  const [businessData, setBusinessData] = useState<BusinessType | null>(null);
  const [isBusinessLoading, setIsBusinessLoading] = useState(true);

  const fetchBusinessData = useCallback(async () => {
    setIsBusinessLoading(true);
    try {
      const { success, data, message } = await getBusiness({});
      if (success) {
        setBusinessData(data || null);
      }
    } catch (error: any) {
      setBusinessData(null);
      throw new Error(error.message);
    } finally {
      setIsBusinessLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData, user?.store_id]);

  if (isBusinessLoading || isLoading) {
    return <Spinner />;
  }

  return (
    <InventoryProvider
      business={businessData}
      refreshBusiness={fetchBusinessData}
    >
      {children}
    </InventoryProvider>
  );
};

export default BusinessLayout;
