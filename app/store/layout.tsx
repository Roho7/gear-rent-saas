import React from "react";

type Props = {
  children: React.ReactNode;
};

const StoreLayout = ({ children }: Props) => {
  return <div className="p-4">{children}</div>;
};

export default StoreLayout;
