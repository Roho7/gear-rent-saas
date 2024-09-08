"use client";
import { useAuth } from "@/app/_providers/useAuth";
import { redirect } from "next/navigation";

import React from "react";

const RegisterStoreLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.store_id) {
    redirect("/inventory");
  }
  return <div>{children}</div>;
};

export default RegisterStoreLayout;
