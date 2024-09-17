"use client";

import { BusinessType } from "@/src/entities/models/types";
import React, { useEffect, useState } from "react";
import Spinner from "../_components/_shared/spinner";
import { useAuth } from "../_providers/useAuth";
import { getBusiness } from "./_actions/store.actions";
import { InventoryProvider } from "./_providers/useInventory";

const BusinessLayout = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth();
  const [businessData, setBusinessData] = useState<BusinessType | null>(null);
  const [isBusinessLoading, setIsBusinessLoading] = useState(true);

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
        setIsBusinessLoading(false);
      }
    };
    fetchData();
  }, [user?.store_id]);

  if (isBusinessLoading || isLoading) {
    return <Spinner />;
  }

  return (
    <InventoryProvider business={businessData}>{children}</InventoryProvider>
  );
};

export default BusinessLayout;
