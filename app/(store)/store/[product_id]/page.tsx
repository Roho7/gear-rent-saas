"use client";

import { useAuth } from "@/app/_providers/useAuth";
import { useCart } from "@/app/_providers/useCart";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useMemo } from "react";
import AddToCartButton from "../_components/add-to-cart.button";

type Props = {};

const ProductPage = ({ params }: { params: { product_id: string } }) => {
  const { products } = useAuth();
  const { cartItems } = useCart();

  const activeProduct = useMemo(() => {
    return products.find((p) => {
      return p.product_id === params.product_id;
    });
  }, [params.product_id, products]);

  const addedToCart = useMemo(() => {
    if (!activeProduct || !cartItems) return false;
    return cartItems[activeProduct?.product_id || ""]?.quantity > 0 || false;
  }, [cartItems]);

  return (
    activeProduct && (
      <div className="flex gap-2 w-full h-full">
        <Card className="flex-1 overflow-hidden">
          <img
            src={activeProduct?.image_url || ""}
            alt=""
            className="object-contain w-full"
          />
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <h1 className="text-2xl">{activeProduct?.product_title}</h1>
            <CardDescription>{activeProduct?.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <AddToCartButton
              addedToCart={addedToCart}
              product={activeProduct}
            />
          </CardFooter>
        </Card>
      </div>
    )
  );
};

export default ProductPage;
