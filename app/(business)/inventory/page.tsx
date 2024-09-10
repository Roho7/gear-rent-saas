"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createClientComponentClient } from "@/app/_utils/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BiEdit, BiTrash } from "react-icons/bi";
import { IoImageOutline } from "react-icons/io5";
import DeleteStoreModal from "./_components/confirm-delete.modal";
import { EditStoreModal } from "./_components/edit-store.modal";

import { useRef } from "react";
import { useInventory } from "../_providers/useInventory";

export default function BusinessDashboard() {
  const { storeDetails } = useInventory();
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async () => {
    const file = imageUploadRef.current?.files?.[0];
    if (!storeDetails?.store_id) return;
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
        .eq("store_id", storeDetails?.store_id);

      if (updateError) {
        console.error("Error updating store image:", updateError);
        toast({
          title: "Error",
          description: "Error updating store image",
          variant: "destructive",
        });
        return;
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen w-full p-4">
      <Card className="flex gap-2 overflow-hidden relative h-1/3">
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

      <Card>
        <CardHeader>
          <CardTitle>Store Location</CardTitle>
        </CardHeader>
        <CardContent>
          {storeDetails?.google_place_id ? (
            <iframe
              width="100%"
              height="250"
              className="mt-2"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&q=place_id:${storeDetails?.google_place_id}`}
            ></iframe>
          ) : (
            <div className="h-20 text-muted">
              Your store is under review, please check back later.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
