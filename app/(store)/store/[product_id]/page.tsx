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

import { ProductMetadataKeys } from "@/supabase/types";
import { useMemo } from "react";
import { BiDollar } from "react-icons/bi";
import { FaClock } from "react-icons/fa";
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

const ProductPage = ({ params }: { params: { product_id: string } }) => {
  const { products } = useProducts();
  const { cartItems } = useProducts();

  const activeProduct = useMemo(() => {
    return products.find((p) => p.product_id === params.product_id);
  }, [params.product_id, products]);

  const addedToCart = useMemo(() => {
    if (!activeProduct || !cartItems) return false;
    return cartItems[activeProduct?.product_id || ""]?.quantity > 0 || false;
  }, [cartItems, activeProduct]);

  if (!activeProduct) {
    return <div className="text-center p-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0">
            <img
              src={activeProduct.image_url || "/placeholder-image.jpg"}
              alt={activeProduct.product_title || ""}
              className="w-full h-[400px] object-cover"
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
                        {metadata.map((g: string, index) => (
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
        <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
        <ProductRibbon />
      </div>
    </div>
  );
};

export default ProductPage;
