"use client";
import useMobile from "@/app/_providers/useMobile";
import clsx from "clsx";
import { useEffect, useState } from "react";
import MainSearchbar from "../_landing/main-searchbar";
import UserDropdown from "./user.dropdown";

const Navbar: React.FC = () => {
  const { isMobile } = useMobile();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
    const handleScroll = () => {
      if (window.scrollY > 18) {
        setCollapsed(true);
        setIsSearchActive(false);
      } else {
        isMobile
          ? () => {
              console.log("itsmobile");
              setCollapsed(true);
            }
          : setCollapsed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.scrollY]);

  return (
    <div>
      <nav
        className={clsx(
          "navbar px-4 sm:px-8 py-4 mb-2 flex justify-between border-b items-center w-full fixed top-0 z-20 transition-all ease-in-out",
          collapsed ? "h-14 glass" : "h-20 sm:h-28 bg-background",
          isSearchActive && "h-36",
        )}
      >
        <a href="/" className="text-white font-bold">
          <img src="/logo-short.png" alt="" className="w-8" />
        </a>

        <div className="flex-grow mx-4">
          <MainSearchbar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setIsSearchActive={setIsSearchActive}
          />
        </div>

        <div className="flex gap-2 items-center">
          <div className=" gap-2 items-center">
            <UserDropdown />
          </div>
        </div>
      </nav>

      {isSearchActive && (
        <div
          className="absolute bg-primary/30 inset-0 z-10"
          onClick={() => {
            isMobile && setCollapsed(true);
            setIsSearchActive(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
