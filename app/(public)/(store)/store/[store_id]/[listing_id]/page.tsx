"use client";
import { useProducts } from "@/app/_providers/useProducts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  GenderType,
  ListingType,
  ProductMetadataKeys,
} from "@/src/entities/models/types";
import { Map, Marker, useMarkerRef } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { formatProductName } from "@/lib/utils";
import { getSingleListingDetails } from "../../_actions/store-inventory.action";
import StoreBookingCard from "../../_components/store.booking.card";

const MetadataMap: Record<ProductMetadataKeys, any> = {
  heights: {
    label: "Heights:",
  },
  sizes: {
    label: "Sizes:",
  },
  colors: {
    label: "Colors:",
  },
  widths: {
    label: "Widths:",
  },
  lengths: {
    label: "Lengths:",
  },
};

const ListingPage = ({ params }: { params: { listing_id: string } }) => {
  const { allStores, productGroups } = useProducts();
  const [markerRef, marker] = useMarkerRef();

  const searchParams = useSearchParams();
  const product_id = searchParams.get("product_id");
  const [listing, setListing] = useState<ListingType>();
  const [loading, setLoading] = useState(false);

  const productDetails = useMemo(() => {
    return productGroups.find((p) => p.product_group_id === product_id);
  }, [params, productGroups]);

  const storeDetails = useMemo(() => {
    return allStores.find((s) => s.store_id === listing?.store_id);
  }, [allStores, listing?.store_id]);

  useEffect(() => {
    if (product_id) {
      setLoading(true);
      getSingleListingDetails(params.listing_id)
        .then((data) => {
          setListing(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast({
            title: "Error fetching listing details",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  }, [product_id, params.listing_id]);

  if (!productDetails) {
    return <div className="text-center p-8">Product not found</div>;
  }

  return (
    <main className="container mx-auto px-4 flex flex-col gap-4">
      <section className="flex flex-col md:flex-row gap-2">
        <Card className="flex-1 overflow-hidden">
          <CardContent className="pt-4">
            <img
              src={productDetails?.image_url || "/placeholder_image.png"}
              alt={productDetails.product_group_name || ""}
              className="w-full h-[400px] object-contain"
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <div>
              <CardTitle className="text-3xl font-bold capitalize mb-2">
                {formatProductName({
                  product_group_name: productDetails.product_group_name,
                  gender: listing?.gender as GenderType,
                  size: listing?.size,
                  sport: productDetails.sport,
                })}
              </CardTitle>
              <Badge variant="secondary" className="">
                {productDetails.sport}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Separator className="my-2" />

            <div className="space-y-4">
              <div className="flex flex-col text-gray-500 text-sm gap-2">
                Available brands:
                <div className="flex gap-1">
                  {listing?.brands?.map((value, key) => {
                    return (
                      <Badge
                        key={key}
                        className="mr-1 w-fit capitalize"
                        variant={"outline"}
                      >
                        {value}
                      </Badge>
                    );
                  })}
                </div>
                Available Sizes: <div>{listing?.size}</div>
                Description: <div>{listing?.description}</div>
              </div>
            </div>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </section>
      <section className="grid grid-cols-2 gap-2 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">About the store</h2>
          <Map
            style={{ width: "100%", height: "200px", borderRadius: "8px" }}
            center={{
              lat: storeDetails?.latitude || 0,
              lng: storeDetails?.longitude || 0,
            }}
            defaultZoom={12}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            disableDoubleClickZoom={true}
          >
            <Marker
              ref={markerRef}
              // key={store.store_id}
              position={{
                lat: storeDetails?.latitude || 0,
                lng: storeDetails?.longitude || 0,
              }}
            />
          </Map>
          <div className="p-2 text-xs bg-muted/10 text-muted rounded-md">
            <h3 className="text-md font-bold">Address:</h3>
            <p>
              {storeDetails?.address_line1}, {storeDetails?.address_line2}
            </p>
            <p>{storeDetails?.city}</p>
            <p>{storeDetails?.country}</p>
            <p>{storeDetails?.postcode}</p>
          </div>
          <p className="text-xs text-muted line-clamp-3">
            {storeDetails?.description}
          </p>
          <h2 className="text-2xl font-semibold mt-2">
            More from {storeDetails?.store_name}
          </h2>
        </div>
        {listing && <StoreBookingCard listing={listing} />}
      </section>

      {loading && (
        <div className="flex gap-2">
          <Skeleton className="h-48 w-72" />
          <Skeleton className="h-48 w-72" />
          <Skeleton className="h-48 w-72" />
        </div>
      )}
    </main>
  );
};

export default ListingPage;
