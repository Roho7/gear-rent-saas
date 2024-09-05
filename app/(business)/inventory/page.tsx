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

import { useProducts } from "@/app/_providers/useProducts";
import { createClientComponentClient } from "@/app/_utils/supabase";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { IoImageOutline, IoRefreshOutline } from "react-icons/io5";
import { useInventory } from "../_providers/useInventory";
import DeleteStoreModal from "./_components/confirm-delete.modal";
import { EditStoreModal } from "./_components/edit-store.modal";
import InventoryItemCard from "./_components/inventory.card";

type EditModalRefType = {
  open: () => void;
  onClose: () => void;
};

const InventoryPage = () => {
  const { user } = useAuth();
  const { fetchAndCacheData } = useProducts();
  const router = useRouter();
  const { inventory, storeDetails, fetchInventory, isLoading } = useInventory();
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async () => {
    const file = imageUploadRef.current?.files?.[0];
    if (!user?.store_id) return;
    if (file) {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase.storage
        .from("store")
        .upload(
          `${storeDetails?.store_id}/store-cover-${storeDetails?.store_id}`,
          file,
          {
            upsert: true,
          },
        );

      toast({
        title: "Success",
        description: "Image uploaded successfully",
        variant: "default",
      });
      if (!data || error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Error uploading image",
          variant: "destructive",
        });
        return;
      }
      const store_image_path = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store/${data?.path}`;

      const { error: updateError } = await supabase
        .from("tbl_stores")
        .update({
          store_img: store_image_path,
        })
        .eq("store_id", user?.store_id);

      if (updateError) {
        console.error("Error updating store image:", updateError);
        toast({
          title: "Error",
          description: "Error updating store image",
          variant: "destructive",
        });
        return;
      }
      await fetchAndCacheData("stores", true);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (!user?.store_id) {
    redirect("/register-store");
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
      <Card className="flex gap-2 overflow-hidden relative">
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
              <iframe
                width="450"
                height="250"
                className="mt-2"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&q=place_id:ChIJBbQud9pzAjoReuWgIJcwP3A`}
              ></iframe>
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
        <CardContent className="flex-1 p-0 h-80">
          <div className="w-full">
            <img
              src={storeDetails?.store_img || ""}
              alt=""
              className="w-full h-full object-cover"
            />

            <label
              htmlFor={`image`}
              className="flex cursor-pointer items-center gap-x-3 whitespace-nowrap px-2 py-1 text-gray-600 hover:bg-gray-200 absolute bottom-2 right-2 bg-white rounded-full"
            >
              <IoImageOutline className="h-4 w-4" />
              <span>Change Image</span>
              <input
                type="file"
                name="image"
                id={`image`}
                hidden
                accept="image/*"
                onChange={handleFileUpload}
                ref={imageUploadRef}
              />
            </label>
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
