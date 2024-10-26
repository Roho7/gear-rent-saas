import useMobile from "@/app/_providers/useMobile";
import clsx from "clsx";
import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navItemClassName =
  "flex md:w-full w-fit items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
const AccountSidebar = () => {
  const pathname = usePathname();
  const { isMobile } = useMobile();
  return (
    <aside className="border-r md:w-[20vw] h-screen sticky top-0 left-0">
      <a
        href="/"
        className="text-white font-bold py-4 lg:h-[60px] h-14 px-2 md:px-8 w-fit flex items-center max-md:mx-auto"
      >
        {isMobile ? (
          <img src="/logo-short.png" alt="" className="w-8" />
        ) : (
          <img src="/logo-black.svg" alt="" className="w-full h-full" />
        )}
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
          {!isMobile && "Account"}
        </Link>
        <Link
          href="/account/bookings"
          className={clsx(
            navItemClassName,
            pathname === "/account/bookings" && "bg-muted text-primary",
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          {!isMobile && "Bookings"}
        </Link>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
