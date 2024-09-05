"use client";

import { Separator } from "@/components/ui/separator";
import FAQSection from "./_components/_landing/faq";
import ForBusinessesSection from "./_components/_landing/for-businesses";
import Hero from "./_components/_landing/hero";
import LogoRibbon from "./_components/_landing/logo-ribbon";
import ProductRibbon from "./_components/product-ribbon";
import ServicesSection from "./_components/services-card";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Hero />
      <Separator className="my-4" />
      <LogoRibbon />
      <Separator className="my-4" />
      <ProductRibbon />
      <Separator className="my-4" />
      <ServicesSection />
      <Separator className="my-4" />
      <ForBusinessesSection />
      <Separator className="my-4" />
      {/* <AdCard /> */}
      <FAQSection />
    </div>
  );
}
