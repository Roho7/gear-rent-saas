"use client";

import FAQSection from "@/app/_components/_landing/faq";
import ForBusinessesSection from "@/app/_components/_landing/for-businesses";
import Hero from "@/app/_components/_landing/hero";
import LogoRibbon from "@/app/_components/_landing/logo-ribbon";
import ServicesSection from "@/app/_components/services-card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 px-4">
      <Hero />
      <Separator className="my-4" />
      <LogoRibbon />
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
