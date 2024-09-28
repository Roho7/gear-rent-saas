"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useInventory } from "../../_providers/useBusiness";
import { ListingTable } from "../_components/listing.table";

const ListingsPage = () => {
  const router = useRouter();
  const { inventory } = useInventory();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Your Listings</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/business/listings/${"new"}`)}>
            Add Listing
          </Button>
        </div>
      </div>
      {!inventory?.length ? (
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
              onClick={() => router.push(`/business/listings/${"new"}`)}
              className="mt-4"
            >
              Add Listing
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Separator />
          <div className="">
            {/* {inventory?.map((item) => (
              <ListingItemCard inventoryItem={item} key={item.listing_id} />
            ))} */}
            <ListingTable data={inventory} />
          </div>
        </>
      )}
    </main>
  );
};

export default ListingsPage;
