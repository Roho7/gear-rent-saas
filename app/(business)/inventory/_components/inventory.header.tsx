import UserDropdown from "@/app/_components/_navbar/user.dropdown";
import MobileInventorySidebar from "./mobile.inventory.sidebar";

const InventoryHeader = () => {
  return (
    <header className="flex items-center gap-4 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6 justify-between">
      <MobileInventorySidebar />
      <UserDropdown />
    </header>
  );
};

export default InventoryHeader;
