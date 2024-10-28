import React from "react";

const EmptyState = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 bg-muted/20 p-4 rounded-lg w-full min-h-[200px] items-center justify-center text-muted">
      {children}
    </div>
  );
};

export default EmptyState;
