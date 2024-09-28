import UserDropdown from "../_navbar/user.dropdown";
import { GearyoBreadcrumb } from "./breadcrumb";

type Props = {};

const SecondaryNavbar = (props: Props) => {
  return (
    <nav className="bg-background w-full flex items-center justify-between h-14 border-b px-4 lg:h-[60px] lg:px-6 sticky top-0">
      <GearyoBreadcrumb />
      <UserDropdown />
    </nav>
  );
};

export default SecondaryNavbar;
