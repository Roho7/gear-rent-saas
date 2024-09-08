"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const StoreLayout = ({ children }: Props) => {
  return <div className="">{children}</div>;
};

export default StoreLayout;
