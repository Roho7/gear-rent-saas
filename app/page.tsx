"use client";

import { Separator } from "@/components/ui/separator";
import AdCard from "./_components/ad-card";
import FAQSection from "./_components/faq";
import Hero from "./_components/hero";
import LogoRibbon from "./_components/logo-ribbon";
import ProductRibbon from "./_components/product-ribbon";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Hero />
      <Separator className="my-4" />
      <LogoRibbon />
      <Separator className="my-4" />
      <ProductRibbon />
      <AdCard />
      <FAQSection />
    </div>
  );
}
