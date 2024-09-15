"use client";
import { useProducts } from "@/app/_providers/useProducts";

import ListingsCard from "./_components/listings.card";
import StoreHeader from "./_components/store-header";

const StorePage = () => {
  const { loading, availableListings } = useProducts();

  return (
    <div className="flex flex-col gap-2">
      <StoreHeader title="Adventure Store" image="/store-cover.jpg" />

      <section className="flex gap-4 w-full relative">
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 ">
          {availableListings?.map((d) => {
            return (
              <ListingsCard listing={d} key={d.product_id} loading={loading} />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default StorePage;
