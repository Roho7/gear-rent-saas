import { Card, CardContent } from "@/components/ui/card";
import { ProductType } from "@/supabase/types";
import React from "react";

const CartItemCard = ({ product }: { product: ProductType | undefined }) => {
  if (!product) {
    return null;
  }
  return (
    <Card className="h-16 w-16 ">
      <CardContent className="object-cover h-full w-full p-1">
        <img
          src={product.image_url || ""}
          alt="product"
          className="object-cover h-full w-full"
        />
      </CardContent>
    </Card>
  );
};

export default CartItemCard;
