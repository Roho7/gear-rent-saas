"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import {
  Bell,
  Home,
  LineChart,
  ListChecksIcon,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItemClassName =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";

const BusinessSidebar = () => {
  const pathname = usePathname();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/home" className="text-white font-bold w-8">
            <img src="/logo-short.png" alt="" className="w-full h-full" />
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/business"
              className={clsx(
                navItemClassName,
                pathname === "/business" && "bg-muted text-primary",
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="#"
              className={clsx(
                navItemClassName,
                pathname === "/business/orders" && "bg-muted text-primary",
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </Link>
            <Link
              href="/business/listings"
              className={clsx(
                pathname.includes("listings") && "bg-muted text-primary",
                navItemClassName,
              )}
            >
              <ListChecksIcon className="h-4 w-4" />
              Listings{" "}
            </Link>
            <Link
              href="#"
              className={clsx(
                pathname.includes("products") && "bg-muted text-primary",
                navItemClassName,
              )}
            >
              <Package className="h-4 w-4" />
              Products{" "}
            </Link>
            <Link
              href="#"
              className={clsx(
                navItemClassName,
                pathname === "/business/customers" && "bg-muted text-primary",
              )}
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="#"
              className={clsx(
                navItemClassName,
                pathname === "/business/analytics" && "bg-muted text-primary",
              )}
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </div>
        {/* <div className="mt-auto p-4">
            <Card x-chunk="A card with a call to action">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
      </div>
    </div>
  );
};

export default BusinessSidebar;
