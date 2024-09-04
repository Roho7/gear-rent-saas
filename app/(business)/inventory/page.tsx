"use client";

import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Separator } from "@/components/ui/separator";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { IoRefreshOutline } from "react-icons/io5";
import { useInventory } from "../_providers/useInventory";
import DeleteStoreModal from "./_components/confirm-delete.modal";
import { EditStoreModal } from "./_components/edit-store.modal";
import InventoryItemCard from "./_components/inventory.card";

type EditModalRefType = {
  open: () => void;
  onClose: () => void;
};

const InventoryPage = () => {
  const { user, refreshUser } = useAuth();
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
      <Card className="flex gap-2 overflow-hidden">
        <CardHeader className="flex-1 flex gap-2 flex-row items-start justify-between">
          <div>
            <CardTitle>{storeDetails?.store_name}</CardTitle>{" "}
            <CardDescription className="flex flex-col">
              <span>{storeDetails?.address_line1}</span>
              <span>{storeDetails?.address_line2}</span>
              <span>
                {storeDetails?.city},{storeDetails?.postcode}{" "}
              </span>
              <span>{storeDetails?.country}</span>
              <span>{storeDetails?.business_email}</span>
              <span>{storeDetails?.business_number}</span>
            </CardDescription>
          </div>
          <div>
            <EditStoreModal>
              <Button variant={"ghost"}>
                <BiEdit />
              </Button>
            </EditStoreModal>
            <DeleteStoreModal>
              <Button variant={"destructive"}>
                <BiTrash />
              </Button>
            </DeleteStoreModal>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <div className="w-full h-48">
            <img
              src={storeDetails?.store_img || ""}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between items-center">
        <h1 className="text-lg my-4">Your Listings</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/inventory/${"new"}`)}>
            Add New Listing
          </Button>
          <Button onClick={() => fetchInventory()} variant={"outline"}>
            <IoRefreshOutline />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-4 gap-2">
        {inventory?.map((item) => (
          <InventoryItemCard inventoryItem={item} key={item.inventory_id} />
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
