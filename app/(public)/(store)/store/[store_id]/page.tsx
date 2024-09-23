"use client";
import { useProducts } from "@/app/_providers/useProducts";
import { MainSearchFormOutputType } from "@/src/entities/models/formSchemas";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StoreFilterBar from "../_components/filter.bar";
import StoreListingRow from "../_components/store.listing.row";

const StorePage = ({ params }: { params: { store_id: string } }) => {
  const { loading, availableListings, fetchListings, allStores } =
    useProducts();
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState({
    sport: "",
  });

  const storeDetails = useMemo(() => {
    return allStores.find((s) => s.store_id === params.store_id);
  }, [params.store_id, allStores]);

  useEffect(() => {
    const sport = searchParams.get("sport") ?? null;
    const checkin = searchParams.get("checkin");
    const checkout = searchParams.get("checkout");
    // const experience = searchParams.get("experience");
    const storeId = params.store_id;

    const searchData = {
      sport,
      // experience,
      storeId,
      rentPeriod:
        checkin && checkout
          ? {
              from: new Date(checkin),
              to: new Date(checkout),
            }
          : undefined,
    };
    setSearchResults({
      sport: sport || "",
    });

    fetchListings(searchData as MainSearchFormOutputType);
  }, [searchParams]);

  return (
    <main className="flex flex-col gap-2 min-h-screen">
      <StoreFilterBar />
      <h2 className="text-md capitalize my-4">
        {searchResults.sport} Gear from{" "}
        <strong>{storeDetails?.store_name}</strong>
      </h2>
      <section className="flex gap-4 w-full relative">
        <div className="flex flex-col gap-2 w-full">
          {availableListings?.map((d) => (
            <StoreListingRow
              listing={d}
              key={d.product_group_id}
              loading={loading}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default StorePage;
