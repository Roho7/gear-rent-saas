import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tables } from "@/supabase/supabase.types";
import { ProductType } from "@/supabase/types";
import React, { useMemo, useState } from "react";
import { useCart } from "../_providers/useCart";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { addToCart, cartItems, removeFromCart } = useCart();

  const addedToCart = useMemo(() => {
    return cartItems[product.product_id]?.quantity || 0;
  }, [cartItems]);
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{product.product_title}</CardTitle>
        <CardDescription>{product.product_title}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={product.image_url || ""} alt="img" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-gray-400 flex items-center gap-2">
          <h2 className=" text-xl">${product.price}</h2>
          <p className="text-xs">/day</p>
        </span>
        {addedToCart ? (
          <div className="flex">
            <Button
              onClick={() => {
                removeFromCart(product.product_id);
              }}>
              -
            </Button>
            <div className="p-2 px-4">
              {cartItems[product.product_id]?.quantity || 0}
            </div>
            <Button onClick={() => addToCart(product.product_id)}>+</Button>
          </div>
        ) : (
          <Button onClick={() => addToCart(product.product_id)}>
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
