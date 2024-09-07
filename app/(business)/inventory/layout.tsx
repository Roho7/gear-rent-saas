"use client";
import InventoryHeader from "./_components/inventory.header";
import InventorySidebar from "./_components/inventory.sidebar";

const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] max-w-screen">
      <InventorySidebar />
      <div className="flex flex-col">
        <InventoryHeader />
        {children}
      </div>
    </div>
  );
};

export default BusinessLayout;
