"use client";
import { toast } from "@/components/ui/use-toast";

import { StoreType } from "@/src/entities/models/types";
import { useEffect, useState } from "react";
import { getAllStores } from "./_actions/getAllStores.action";
import StoreCard from "./_components/store-card";

type Props = {};

const SellerPage = (props: Props) => {
  const [allStores, setAllStores] = useState<StoreType[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { success, message, data } = await getAllStores();
        if (success && data) {
          setAllStores(data);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching stores",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    fetchStores();
  }, []);
  return (
    <div>
      <h1>Your stores</h1>
      <div className="flex flex-col gap-2 ">
        {allStores.map((store) => (
          <StoreCard store={store} key={store.store_id} />
        ))}
      </div>
    </div>
  );
};

export default SellerPage;
