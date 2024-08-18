"use client";
import AdCard from "./_components/ad-card";
import Hero from "./_components/hero";
import ProductRibbon from "./_components/product-ribbon";

export default function Home() {
  return (
    <main className="px-8">
      <Hero />
      <ProductRibbon />
      <AdCard />
    </main>
  );
}
