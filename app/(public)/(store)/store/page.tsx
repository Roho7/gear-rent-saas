"use client";
import { useProducts } from "@/app/_providers/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { popularLocations } from "@/src/entities/models/constants";
import { StoreType } from "@/src/entities/models/types";
import { Map, Marker, useMarkerRef } from "@vis.gl/react-google-maps";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSearchedStores } from "./_actions/fetch-searched-stores.actions";
import StoreRow from "./_components/store.row";

const StorePage = () => {
  const { loading } = useProducts();
  const [markerRef, marker] = useMarkerRef();
  const [searchedStores, setSearchedStores] = useState<StoreType[]>();
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState({
    sport: "",
    location: { name: "", lat: 0, lng: 0 },
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

        const locationDetails = popularLocations.find(
          (l) => l.id === locationId,
        );
        setSearchResults({
          sport: sport || "",
          location: {
            name: locationDetails?.name || "",
            lat: searchData.lat,
            lng: searchData.lng,
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
    <main className="flex flex-col gap-2">
      <h2 className="text-md capitalize">
        {searchResults.sport} Stores{" "}
        {searchResults.location.name
          ? `near ${searchResults.location.name}`
          : "worldwide"}
      </h2>
      <section className="flex gap-4 w-full relative">
        <Map
          style={{ width: "100vw", height: "70vh" }}
          defaultCenter={{
            lat: searchResults.location.lat,
            lng: searchResults.location.lng,
          }}
          defaultZoom={10}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          {searchedStores?.map((store) => {
            return (
              <Marker
                ref={markerRef}
                key={store.store_id}
                position={{
                  lat: store.latitude || 0,
                  lng: store.longitude || 0,
                }}
              />
            );
          })}
        </Map>
        <div className="flex flex-col gap-2 w-full h-[70vh] overflow-y-scroll">
          {loading ||
            (storeLoading && Array(6).map((_, i) => <Skeleton key={i} />))}
          {searchedStores?.map((store) => {
            return <StoreRow key={store.store_id} store={store} />;
          })}
        </div>
      </section>
    </main>
  );
};

export default StorePage;
