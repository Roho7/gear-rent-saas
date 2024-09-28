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
    <aside className="border-r w-[20vw] h-screen sticky top-0 left-0">
      <a
        href="/"
        className="text-white font-bold py-4 lg:h-[60px] h-14 px-8 w-[150px] flex items-center"
      >
        <img src="/logo-black.svg" alt="" className="w-full h-full" />
      </a>
      <nav className="grid items-start px-2 text-sm font-medium lg:px-2 gap-1 py-4">
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
