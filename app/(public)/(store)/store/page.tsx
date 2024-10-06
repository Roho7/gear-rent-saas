"use client";
import useMobile from "@/app/_providers/useMobile";
import DesktopStorePage from "./_components/desktop-store.page";
import MobileStorePage from "./_components/mobile-store.page";

const RootStorePage = () => {
  const { isMobile } = useMobile();

  return isMobile ? <MobileStorePage /> : <DesktopStorePage />;
};

export default RootStorePage;
