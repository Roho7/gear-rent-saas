"use client";
import React from "react";
import { useAuth } from "../_providers/useAuth";
import { InventoryProvider } from "./_providers/useInventory";

const BusinessLayout = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuth();

  return <InventoryProvider user={user}>{children}</InventoryProvider>;
};

export default BusinessLayout;
