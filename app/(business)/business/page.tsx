"use client";
import { handleStoreImageUpload } from "@/app/_utils/helpers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRef } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { IoImageOutline } from "react-icons/io5";
import { useInventory } from "../_providers/useBusiness";
import DeleteStoreModal from "./_components/confirm-delete.modal";
import { EditStoreModal } from "./_components/edit-store.modal";

export default function BusinessDashboard() {
  const { storeDetails } = useInventory();
  const imageUploadRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4 min-h-screen w-full p-4">
      <Card className="flex gap-2 overflow-hidden relative h-1/3">
        <CardHeader className="flex-1 flex gap-2 flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">
              {storeDetails?.store_name}
            </CardTitle>{" "}
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
                onChange={(e) =>
                  handleStoreImageUpload(e.target.files?.[0], storeDetails)
                }
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
