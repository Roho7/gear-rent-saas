import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/use-toast";
import { popularLocations } from "@/src/entities/models/constants";
import { StoreType } from "@/src/entities/models/types";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { ChevronUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSearchedStores } from "../_actions/fetch-searched-stores.actions";
const MobileStorePage = () => {
  const { loading } = useProducts();
  const [searchedStores, setSearchedStores] = useState<StoreType[]>([]);
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
          radius: radius ? parseFloat(radius) : 10000,
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
    <main className="relative h-screen">
      <Map
        style={{ width: "100%", height: "80%" }}
        defaultCenter={{
          lat: searchResults.location.lat,
          lng: searchResults.location.lng,
        }}
        defaultZoom={13}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {searchedStores?.map((store) => (
          <Marker
            key={store.store_id}
            position={{
              lat: store.latitude || 0,
              lng: store.longitude || 0,
            }}
          />
        ))}
      </Map>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10"
            variant="outline"
          >
            <ChevronUp className="mr-2 h-4 w-4" />
            View Stores
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh] px-2">
          <DrawerHeader className="text-lg font-semibold capitalize">
            {searchResults.sport} Stores{" "}
            {searchResults.location.name
              ? `near ${searchResults.location.name}`
              : "worldwide"}
          </DrawerHeader>
          <div className="space-y-4">
            <div className="space-y-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              {loading || storeLoading ? (
                <div className="text-center">Loading...</div>
              ) : searchedStores.length ? (
                searchedStores.map((store) => (
                  <div
                    key={store.store_id}
                    className="p-4 border rounded-lg shadow-sm"
                  >
                    <h3 className="font-semibold">{store.store_name}</h3>
                    <p className="text-sm text-gray-600">
                      {store.address_line1}, {store.city}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">
                  Coming soon for this location
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
};

export default MobileStorePage;
