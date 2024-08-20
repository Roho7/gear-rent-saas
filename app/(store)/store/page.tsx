"use client";
import ProductCard from "../../_components/product-card";
import { useAuth } from "../../_providers/useAuth";
import StoreHeader from "./_components/store-header";
import StoreSidebar from "./_components/store-sidebar";

type Props = {};

const StorePage = (props: Props) => {
  const { products, stores, loading } = useAuth();

  return (
    <div className="flex flex-col gap-2">
      <StoreHeader title="Adventure Store" image="/store-cover.jpg" />

      <section className="flex gap-4 w-full relative">
        <StoreSidebar />
        <div className="grid gap-2 md: grid-cols-2 lg:grid-cols-3 ">
          {products?.map((d, index) => {
            return (
              <ProductCard product={d} key={d.product_id} loading={loading} />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default StorePage;
