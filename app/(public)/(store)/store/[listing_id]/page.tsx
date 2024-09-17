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

import LocationPicker from "@/app/_components/_landing/location.dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { MainSearchFormSchema } from "@/src/entities/models/formSchemas";
import { ListingType, ProductMetadataKeys } from "@/src/entities/models/types";
import { useEffect, useMemo, useState } from "react";

import { BiDollar } from "react-icons/bi";
import { FaClock } from "react-icons/fa";
import {
  getInventoryForProduct,
  getNearbyStores,
} from "../_actions/store-inventory.action";
import AddToCartButton from "../_components/add-to-cart.button";

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

const ListingPage = ({ params }: { params: { product_id: string } }) => {
  const { allProducts, allStores, searchLocation, setSearchLocation } =
    useProducts();
  const { cartItems } = useProducts();
  const [nearbyStoreIds, setNearbyStoreIds] = useState<string[]>([]);
  const [inventory, setInventory] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);

  const activeProduct = useMemo(() => {
    return allProducts.find((p) => p.product_id === params.product_id);
  }, [params.product_id, allProducts]);

  const addedToCart = useMemo(() => {
    if (!activeProduct || !cartItems) return false;
    return cartItems[activeProduct?.product_id || ""]?.quantity > 0 || false;
  }, [cartItems, activeProduct]);

  const nearbyStores = useMemo(() => {
    return allStores.filter((store) => nearbyStoreIds.includes(store.store_id));
  }, [nearbyStoreIds, inventory]);

  useEffect(() => {
    try {
      setLoading(true);
      if (searchLocation && activeProduct) {
        // Fetch nearby stores and inventory
        const fetchNearbyStoresAndInventory = async () => {
          const store_ids = await getNearbyStores(
            searchLocation.lat,
            searchLocation.lng,
          );
          setNearbyStoreIds(store_ids);

          const inv = await getInventoryForProduct(
            activeProduct.product_id,
            store_ids,
          );
          setInventory(inv);
        };

        fetchNearbyStoresAndInventory();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchLocation, activeProduct]);

  useEffect(() => {
    setSearchLocation(
      (
        JSON.parse(
          localStorage.getItem("main-search-details") || "{}",
        ) as (typeof MainSearchFormSchema)["_output"]
      ).location,
    );
  }, []);

  if (!activeProduct) {
    return <div className="text-center p-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-2">
        <Card className="flex-1 overflow-hidden">
          <CardContent className="pt-4">
            <img
              src={activeProduct.image_url || "/placeholder-image.jpg"}
              alt={activeProduct.product_title || ""}
              className="w-full h-[400px] object-contain"
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  {activeProduct.product_title}
                </CardTitle>
                <Badge variant="secondary" className="mb-4">
                  {activeProduct.category}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-primary">
                $<span className="text-sm text-muted-foreground">/ day</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <CardDescription className="text-lg mb-6">
              {activeProduct.description}
            </CardDescription>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex flex-col text-gray-500 text-sm">
                Product details:
                {Object.keys(MetadataMap).map((key) => {
                  const metadata = activeProduct.product_metadata?.[key];
                  if (metadata?.length) {
                    return (
                      <div className="flex gap-1" key={key}>
                        {MetadataMap[key as ProductMetadataKeys].label}{" "}
                        {metadata.map((g: string, index: number) => (
                          <span className="flex gap-0.5 capitalize" key={index}>
                            {g}
                          </span>
                        ))}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
              <div className="flex items-center">
                <FaClock className="w-5 h-5 mr-2" />
                <span>
                  Available for rent:{" "}
                  {/* {activeProduct.closing_time || "Contact for details"} */}
                </span>
              </div>
              <div className="flex items-center">
                <BiDollar className="w-5 h-5 mr-2" />
                <span>Price: $ per day</span>
              </div>
              {activeProduct.product_link && (
                <div className="flex items-center">
                  <a
                    href={activeProduct.product_link}
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
              product={activeProduct}
            />
          </CardFooter>
        </Card>
      </div>
      <div className="mt-12">
        <div className="flex gap-2 items-center mb-2">
          <span className="text-2xl font-semibold">Rent near</span>
          <LocationPicker
            setSearchLocation={setSearchLocation}
            searchLocation={searchLocation}
          />
        </div>
        {loading && (
          <div className="flex gap-2">
            <Skeleton className="h-48 w-72" />
            <Skeleton className="h-48 w-72" />
            <Skeleton className="h-48 w-72" />
          </div>
        )}
        {!loading && nearbyStoreIds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyStores.map((store) => {
              const storeInventory = inventory.find(
                (i) => i.store_id === store.store_id,
              );

              console.log("llll", storeInventory);
              if (!storeInventory) return null;

              return (
                <Card key={store.store_id}>
                  <CardHeader>
                    <CardTitle>{store.store_name}</CardTitle>
                    <CardDescription>
                      {store.address_line1}, {store.city}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Available: {storeInventory.available_units}</p>
                    <p>
                      Price: ${storeInventory.base_price} per{" "}
                      {storeInventory.price_granularity}
                    </p>
                  </CardContent>
                  <CardFooter>
                    {/* <AddToCartButton
                      addedToCart={false}
                      product={activeProduct}
                      storeId={store_ids}
                    /> */}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : !searchLocation ? (
          <p>Select a location to view available stores</p>
        ) : (
          <p>No nearby rentals available for this product.</p>
        )}
      </div>

      <div className="mt-12">
        <ProductRibbon />
      </div>
    </div>
  );
};

export default ListingPage;
