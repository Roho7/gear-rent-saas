"use client";
import BackButton from "@/app/_components/_shared/back-button";
import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useMemo } from "react";
import { verifyStore } from "../_actions/admin-stores.actions";

type Props = {
  params: {
    store_id: string;
  };
};

const AdminStorePage = async ({ params }: Props) => {
  const { allStores } = useProducts();

  const store = useMemo(
    () => allStores?.find((store) => store.store_id === params.store_id),
    [allStores, params.store_id],
  );

  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex">
        <BackButton />
        {
          <Button
            onClick={async () => {
              try {
                await verifyStore(store.store_id);
                toast({
                  title: "Store Location Generated",
                  description: "Store location has been generated successfully",
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description:
                    "An error occurred while generating the store location",
                });
              }
            }}
          >
            Generate Store Location
          </Button>
        }
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Store Image</CardTitle>
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
};

export default AdminStorePage;
