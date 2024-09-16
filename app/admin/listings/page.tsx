"use client";
import ListingItemCard from "@/app/(business)/inventory/_components/listing.card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useAdmin } from "../_providers/useAdmin";

type Props = {};

const AdminListingsPage = (props: Props) => {
  const { allInventory } = useAdmin();
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold md:text-2xl">All Listings</h1>
      </div>
      {!allInventory?.length ? (
        <div
          x-chunk="An empty state showing no products with a heading, description and a call to action to add a product."
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no products
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button
              onClick={() => router.push(`/allInventory/listings/${"new"}`)}
              className="mt-4"
            >
              Add Listing
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Separator />
          <div className="grid grid-cols-4 gap-2 h-[80vh] overflow-y-scroll pb-8">
            {allInventory?.map((item) => (
              <ListingItemCard
                inventoryItem={item}
                key={item.listing_id}
                showStoreDetails={true}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default AdminListingsPage;
