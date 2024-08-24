"use client";
import React from "react";
import { InventoryProvider } from "./_providers/useInventory";

const BusinessLayout = ({ children }: { children: React.ReactElement }) => {
  return <InventoryProvider>{children}</InventoryProvider>;
};

export default BusinessLayout;
