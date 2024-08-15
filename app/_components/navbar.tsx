import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import CartPopup from "./cart-popup";

const Navbar: React.FC = () => {
  return (
    <div className="mx-12 px-4 py-0.5 glass sticky top-4 max-h-14 z-10 flex items-center">
      <a href="/" className="text-white font-bold">
        Home
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
                      href="/store">
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
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Rent your gear</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none hover:shadow-md"
                      href="/store">
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Connect your store
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        If you're a renter, connect your store to our platform
                        and start renting your gear to a wider audience.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <a href="" className="text-sm w-full">
                    APIs
                  </a>
                </li>
                <li>
                  <a href="" className="text-sm w-full">
                    Manual setup
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
                      href="/store">
                      <div className="mb-2 mt-4 text-lg font-medium">
                        About Us
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        We're just two dudes tyring to make adventure more about
                        adventureing.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <a href="" className="text-sm w-full">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="" className="text-sm w-full">
                    Licenses
                  </a>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <CartPopup />
    </div>
  );
};

export default Navbar;
