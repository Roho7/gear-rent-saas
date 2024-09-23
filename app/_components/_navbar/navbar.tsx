"use client";
import clsx from "clsx";
import { useState } from "react";
import CartPopup from "../_cart/cart-popup";
import MainSearchbar from "../_landing/main-searchbar";
import UserDropdown from "./user.dropdown";

const Navbar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  if (typeof window === "undefined") {
    return null;
  }

  window.onscroll = function () {
    if (window.scrollY > 18) {
      setCollapsed(true);
      setIsSearchActive(false);
    } else {
      setCollapsed(false);
    }
  };
  return (
    <div>
      <nav
        className={clsx(
          "navbar px-8 py-4 mb-2 flex justify-between border-b items-center w-full fixed top-0 z-20 transition-all ease-in-out",
          collapsed ? "h-14 glass" : "h-28 bg-background",
          isSearchActive && "h-36",
        )}
      >
        {/* <div className="flex items-center justify-between"> */}
        <a href="/" className="text-white font-bold">
          <img src="/logo-short.png" alt="" className="w-8" />
        </a>
        <MainSearchbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setIsSearchActive={setIsSearchActive}
        />

        <div className="flex gap-2 items-center">
          {/* <ModeSwitcher /> */}
          <CartPopup />
          <UserDropdown />
        </div>
        {/* </div> */}
      </nav>
      {isSearchActive && (
        <div
          className="absolute bg-primary/30 inset-0 z-10"
          onClick={() => {
            setIsSearchActive(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
