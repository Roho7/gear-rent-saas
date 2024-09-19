"use client";
import ProductRibbon from "@/app/_components/product-ribbon";
import { useProducts } from "@/app/_providers/useProducts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { ListingType, ProductMetadataKeys } from "@/src/entities/models/types";
import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import { formatPrice, formatPriceGranularity } from "@/lib/utils";
import { getSingleListingDetails } from "../../_actions/store-inventory.action";
import AddToCartButton from "../../_components/add-to-cart.button";
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
  const { allProducts, allStores } = useProducts();
  const searchParams = useSearchParams();
  const product_id = searchParams.get("product_id");
  const { cartItems } = useProducts();
  const [listing, setListing] = useState<ListingType>();
  const [loading, setLoading] = useState(false);

  const productDetails = useMemo(() => {
    return allProducts.find((p) => p.product_id === product_id);
  }, [params, allProducts]);

  const storeDetails = useMemo(() => {
    return allStores.find((s) => s.store_id === listing?.store_id);
  }, [allStores, listing?.store_id]);

  const addedToCart = useMemo(() => {
    if (!productDetails || !cartItems) return false;
    return cartItems[productDetails?.product_id || ""]?.quantity > 0 || false;
  }, [cartItems, productDetails]);

  useEffect(() => {
    if (product_id) {
      setLoading(true);
      getSingleListingDetails(product_id, params.listing_id)
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
              src={productDetails.image_url || "/placeholder-image.jpg"}
              alt={productDetails.product_title || ""}
              className="w-full h-[400px] object-contain"
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  {productDetails.product_title}
                </CardTitle>
                <Badge variant="secondary" className="mb-4">
                  {productDetails.category}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <CardDescription className="text-lg mb-6">
              {productDetails.description}
            </CardDescription>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex flex-col text-gray-500 text-sm gap-2">
                <span>Product details:</span>
                {Object.entries(listing?.product_metadata || []).map(
                  ([key, value]) => {
                    return (
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-muted capitalize">
                          {key}
                        </span>
                        {value.map((p) => (
                          <Badge
                            key={key + p}
                            className="mr-1"
                            variant={"outline"}
                          >
                            {p}
                          </Badge>
                        ))}
                      </div>
                    );
                  },
                )}
              </div>

              <div className="flex items-center">
                <span>
                  {formatPrice({
                    base_price: listing?.base_price,
                    currency_code: listing?.currency_code,
                  })}{" "}
                  {formatPriceGranularity(listing?.price_granularity || null)}
                </span>
              </div>
              {productDetails.product_link && (
                <div className="flex items-center">
                  <a
                    href={productDetails.product_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    More product details
                  </a>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <AddToCartButton
              addedToCart={addedToCart}
              product={productDetails}
            />
          </CardFooter>
        </Card>
      </section>
      <section className="flex gap-2 w-full">
        <div className="flex-1">
          <span className="text-2xl font-semibold">About the store</span>
          <p className="text-xs text-muted">{storeDetails?.description}</p>

          {loading && (
            <div className="flex gap-2">
              <Skeleton className="h-48 w-72" />
              <Skeleton className="h-48 w-72" />
              <Skeleton className="h-48 w-72" />
            </div>
          )}
        </div>
        {listing && <StoreBookingCard listing={listing} />}
      </section>

      <section className="mt-12">
        <ProductRibbon />
      </section>
    </main>
  );
};

export default ListingPage;
