"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const StoreLayout = ({ children }: Props) => {
  return <div className="min-h-screen px-4">{children}</div>;
};

export default StoreLayout;
