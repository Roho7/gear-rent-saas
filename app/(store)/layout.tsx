"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const StoreLayout = ({ children }: Props) => {
  return <div className="px-8">{children}</div>;
};

export default StoreLayout;
