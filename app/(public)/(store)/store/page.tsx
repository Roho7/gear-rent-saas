"use client";
import { useProducts } from "@/app/_providers/useProducts";
import { toast } from "@/components/ui/use-toast";
import { popularLocations } from "@/src/entities/models/constants";
import { StoreType } from "@/src/entities/models/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSearchedStores } from "./_actions/fetch-searched-stores.actions";
import StoreRow from "./_components/store.row";

const StorePage = () => {
  const { loading, availableListings } = useProducts();
  const [searchedStores, setSearchedStores] = useState<StoreType[]>();
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState({
    sport: "",
    location: { name: "" },
  });
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    const getStoresFromParams = async () => {
      try {
        const sport = searchParams.get("sport") ?? null;
        const locationId = searchParams.get("locationId") ?? null;
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");
        const radius = searchParams.get("radius");

        if (!lat || !lng) {
          return;
        }
        const searchData = {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          radius: radius ? parseFloat(radius) : 10,
        };
        setSearchResults({
          sport: sport || "",
          location: {
            name: popularLocations.find((l) => l.id === locationId)?.name || "",
          },
        });

        const res = await fetchSearchedStores(searchData);
        setSearchedStores(res);
      } catch (err: any) {
        toast({
          title: "Error fetching stores",
          description: err.message ?? "Error fetching stores",
          variant: "destructive",
        });
      } finally {
        setStoreLoading(false);
      }
    };

    getStoresFromParams();
  }, [searchParams]);

  return (
    <main className="flex flex-col gap-2 min-h-screen">
      <h2 className="text-3xl capitalize my-4">
        {searchResults.sport} Stores{" "}
        {searchResults.location.name
          ? `near ${searchResults.location.name}`
          : "worldwide"}
      </h2>
      <section className="flex gap-4 w-full relative">
        <div className="flex flex-col gap-2 w-full">
          {searchedStores?.map((store) => {
            return (
              <StoreRow
                key={store.store_id}
                store={store}
                loading={loading && storeLoading}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default StorePage;
