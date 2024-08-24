"use client";
import { useProducts } from "@/app/_providers/useProducts";
import StoreCard from "./_components/store-card";

type Props = {};

const SellerPage = (props: Props) => {
  const { stores } = useProducts();
  return (
    <div>
      <h1>Your stores</h1>
      <div className="flex flex-col gap-2 ">
        {stores.map((store) => (
          <StoreCard store={store} key={store.store_id} />
        ))}
      </div>
    </div>
  );
};

export default SellerPage;
