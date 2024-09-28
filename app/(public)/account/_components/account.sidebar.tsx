import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navItemClassName =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
const AccountSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="border-r max-w-[20vw] flex-1 sticky left-0 top-0">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4 ">
        <Link
          href="/account"
          className={clsx(
            navItemClassName,
            pathname === "/account" && "bg-muted text-primary",
          )}
        >
          <User className="h-4 w-4" />
          Account
        </Link>
        <Link
          href="/account/bookings"
          className={clsx(
            navItemClassName,
            pathname === "/account/bookings" && "bg-muted text-primary",
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          Bookings
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            6
          </Badge>
        </Link>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
