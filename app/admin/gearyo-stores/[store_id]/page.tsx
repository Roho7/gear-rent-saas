"use client";
import BackButton from "@/app/_components/_shared/back-button";
import { handleStoreImageUpload } from "@/app/_utils/helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { IoImageOutline } from "react-icons/io5";
import { useAdmin } from "../../_providers/useAdmin";
import { verifyGearyoStore } from "../_actions/gearyo-store.actions";

type Props = {
  params: {
    store_id: string;
  };
};

export default function AdminStorePage({ params }: Props) {
  const { gearyoStores, refreshGearyoStores } = useAdmin();
  const router = useRouter();
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const store = useMemo(
    () => gearyoStores?.find((store) => store.store_id === params.store_id),
    [gearyoStores, params.store_id],
  );

  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex">
        <BackButton />

        <div className="flex gap-2">
          <Button
            size={"sm"}
            onClick={async () => {
              try {
                await verifyGearyoStore(store.store_id);
                toast({
                  title: "Store Location Generated",
                  description: "Store location has been generated successfully",
                });
                await refreshGearyoStores();
              } catch (error) {
                console.error(error);
                toast({
                  title: "Error",
                  description:
                    JSON.stringify(error) ||
                    "An error occurred while generating the store location",
                });
              }
            }}
          >
            Generate Store Location
          </Button>
          <Button
            variant="outline"
            size={"sm"}
            onClick={() =>
              router.push(`/admin/gearyo-stores/add?store_id=${store.store_id}`)
            }
          >
            Edit Store
          </Button>
          {/* <Button variant="destructive">Delete Store</Button> */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Store Name:</span> {store.store_name}
          </p>
          <p>
            <span className="font-medium">Store ID:</span> {store.store_id}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {store.user_id}
          </p>
          <p>
            <span className="font-medium">Description:</span>{" "}
            {store.description || "N/A"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Business Email:</span>{" "}
            {store.business_email || "N/A"}
          </p>
          <p>
            <span className="font-medium">Business Number:</span>{" "}
            {store.business_number || "N/A"}
          </p>
          <p>
            <span className="font-medium">Closing Time:</span>{" "}
            {store.closing_time || "N/A"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Address Line 1:</span>{" "}
            {store.address_line1 || "N/A"}
          </p>
          <p>
            <span className="font-medium">Address Line 2:</span>{" "}
            {store.address_line2 || "N/A"}
          </p>
          <p>
            <span className="font-medium">City:</span> {store.city || "N/A"}
          </p>
          <p>
            <span className="font-medium">Postcode:</span>{" "}
            {store.postcode || "N/A"}
          </p>
          <p>
            <span className="font-medium">Country:</span>{" "}
            {store.country || "N/A"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Categories:</span>{" "}
            {store.categories?.join(", ") || "N/A"}
          </p>
          <p>
            <span className="font-medium">Google Place ID:</span>{" "}
            {store.google_place_id || "N/A"}
          </p>
          <p>
            <span className="font-medium">Google Rating:</span>{" "}
            {store.google_rating || "N/A"}
          </p>
          <p>
            <span className="font-medium">Latitude:</span>{" "}
            {store.latitude || "N/A"}
          </p>
          <p>
            <span className="font-medium">Longitude:</span>{" "}
            {store.longitude || "N/A"}
          </p>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-lg">Store Image</CardTitle>
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
              onChange={async (e) => {
                handleStoreImageUpload(
                  e.target.files?.[0],
                  store,
                  true,
                  refreshGearyoStores,
                );
              }}
              ref={imageUploadRef}
            />
          </label>
        </CardHeader>
        <CardContent>
          <img
            src={store?.store_img || "/store_placeholder_img.png"}
            alt={store.store_name}
            className="w-64 h-64 object-cover rounded-lg"
          />
        </CardContent>
      </Card>
    </div>
  );
}
