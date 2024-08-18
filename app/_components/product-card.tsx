import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductType } from "@/supabase/types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import AddToCartButton from "../(store)/store/_components/add-to-cart.button";
import { useCart } from "../_providers/useCart";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { cartItems } = useCart();
  const router = useRouter();

  const addedToCart = useMemo(() => {
    if (!cartItems) return false;
    return cartItems[product.product_id]?.quantity > 0 || false;
  }, [cartItems]);

  return (
    <Card
      className="min-w-80 flex flex-col gap-2"
      onClick={() => router.push(`/store/${product.product_id}`)}>
      <CardHeader>
        <CardTitle>{product.product_title}</CardTitle>
        <CardDescription>{product.product_title}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <img src={product.image_url || ""} alt="img" className="max-h-40" />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1 mt-auto">
        <p className="text-gray-400 flex items-center gap-2">
          <h2 className=" text-xl">${product.price}</h2>
          <p className="text-xs">/day</p>
        </p>
        <AddToCartButton
          addedToCart={addedToCart}
          product={product}
          className=""
        />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
