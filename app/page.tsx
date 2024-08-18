"use client";
import AdCard from "./_components/ad-card";
import FAQSection from "./_components/faq";
import Hero from "./_components/hero";
import ProductRibbon from "./_components/product-ribbon";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Hero />
      <ProductRibbon />
      <AdCard />
      <FAQSection />
    </div>
  );
}
