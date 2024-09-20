"use client";
import { toast } from "@/components/ui/use-toast";

import { Separator } from "@/components/ui/separator";
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
      <div className="mb-4">
        <h1 className="text-2xl font-bold my-2">All Sellers</h1>
        <p className="text-sm text-muted">
          All stores on Gearyo are verified by us. Rent with confidence.
        </p>
      </div>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-2 ">
        {allStores.map((store) => (
          <StoreCard store={store} key={store.store_id} />
        ))}
      </div>
    </div>
  );
};

export default SellerPage;
