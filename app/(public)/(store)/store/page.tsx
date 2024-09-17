"use client";
import { useProducts } from "@/app/_providers/useProducts";
import { popularLocations } from "@/src/entities/models/constants";
import { MainSearchFormOutputType } from "@/src/entities/models/formSchemas";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import StoreHeader from "./_components/store-header";
import StoreListingCard from "./_components/store.listings.card";

const StorePage = () => {
  const { loading, availableListings, fetchListings } = useProducts();
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState({
    sport: "",
    location: { name: "" },
  });

  useEffect(() => {
    const sport = searchParams.get("sport") ?? null;
    const locationId = searchParams.get("locationId") ?? null;
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");
    const checkin = searchParams.get("checkin");
    const checkout = searchParams.get("checkout");
    const experience = searchParams.get("experience");

    const searchData = {
      sport,
      experience,
      rentPeriod:
        checkin && checkout
          ? {
              from: new Date(checkin),
              to: new Date(checkout),
            }
          : undefined,
      location: {
        id: locationId,
        name: popularLocations.find((l) => l.id === locationId)?.name || "",
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        radius: radius ? parseFloat(radius) : undefined,
      },
    };
    setSearchResults({
      sport: sport || "",
      location: {
        name: popularLocations.find((l) => l.id === locationId)?.name || "",
      },
    });

    console.log("searchData", searchData);
    fetchListings(searchData as MainSearchFormOutputType);
  }, [searchParams]);

  return (
    <section className="flex flex-col gap-2 h-screen">
      <StoreHeader title="Adventure Store" image="/store-cover.jpg" />

      <h2 className="text-3xl capitalize my-4">
        {searchResults.sport} Gear{" "}
        {searchResults.location.name
          ? `near ${searchResults.location.name}`
          : "worldwide"}
      </h2>
      <div className="flex gap-4 w-full relative">
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 ">
          {availableListings?.map((d) => (
            <StoreListingCard
              listing={d}
              key={d.product_id}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorePage;
