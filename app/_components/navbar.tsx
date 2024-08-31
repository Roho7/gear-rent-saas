"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import CartPopup from "./cart-popup";
import ModeSwitcher from "./mode-switcher";
import UserButton from "./user-button";

const Navbar: React.FC = () => {
  if (typeof window === "undefined") {
    return null;
  }
  window.onscroll = function () {
    if (window.scrollY > 18) {
      document.querySelector(".navbar")?.classList.remove("mx-8");

      document.querySelector(".navbar")?.classList.add("mx-16");
    } else {
      document.querySelector(".navbar")?.classList.remove("mx-16");
      document.querySelector(".navbar")?.classList.add("mx-8");
    }
  };
  return (
    <div className="navbar mx-8 px-4 mb-8 py-0.5 glass sticky top-4 max-h-14 z-10 flex items-center transition-all delay-75 ease-in-out">
      <a href="/" className="text-white font-bold">
        <img src="/logo-short.png" alt="" className="w-8" />
      </a>
      <NavigationMenu className="bg-none mx-auto py-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Rent</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none hover:shadow-md"
                      href="/store"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Our store
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Find everything you need for your next adventure from a
                        wider range of renters.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <a href="/seller" className="text-sm w-full">
                    See all sellers
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Businesses</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none hover:shadow-md"
                      href="/register"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Rent through us
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        If you are a renter, connect your store to our platform
                        and start renting your gear to more customers.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <a href="/inventory" className="text-sm w-full">
                    Your listings
                  </a>
                </li>
                <li>
                  <a href="" className="text-sm w-full">
                    Need help?
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>About</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none hover:shadow-md"
                      href="/store"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        About Us
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        We are just two dudes tyring to make adventure more
                        about adventureing.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <a href="/admin" className="text-sm w-full">
                    Admin
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex gap-2 items-center">
        <ModeSwitcher />
        <CartPopup />
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
