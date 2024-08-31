"use client";

import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import { useInventory } from "../_providers/useInventory";
import InventoryItemCard from "./_components/inventory.card";

type Props = {};

const InventoryPage = (props: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { inventory, storeDetails, fetchInventory, isLoading } = useInventory();

  useEffect(() => {
    fetchInventory();
  }, []);

  if (!user?.store_id) {
    redirect("/register");
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 ml-auto">
        <Button onClick={() => router.push("/inventory/add")}>
          Add New Listing
        </Button>
        <Button onClick={() => fetchInventory()} variant={"outline"}>
          <IoRefreshOutline />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{storeDetails?.store_name} Inventory</CardTitle>{" "}
          <CardDescription className="flex flex-col">
            <span>{storeDetails?.address}</span>
            <span>{storeDetails?.business_email}</span>
            <span>{storeDetails?.business_number}</span>
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-4 gap-2">
        {inventory?.map((item) => (
          <InventoryItemCard inventoryItem={item} key={item.inventory_id} />
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
