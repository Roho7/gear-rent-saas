import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductType } from "@/supabase/types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import AddToCartButton from "../(store)/store/_components/add-to-cart.button";
import { useCart } from "../_providers/useCart";

const ProductCard = ({
  product,
  loading,
}: {
  product: ProductType;
  loading: boolean;
}) => {
  const { cartItems } = useCart();
  const router = useRouter();

  const addedToCart = useMemo(() => {
    if (!cartItems) return false;
    return cartItems[product.product_id]?.quantity > 0 || false;
  }, [cartItems]);

  return loading ? (
    <ProductCardSkeleton />
  ) : (
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
          <span className=" text-xl">${product.price}</span>
          <span className="text-xs">/day</span>
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

const ProductCardSkeleton = () => {
  return (
    <div className="min-w-80 flex flex-col gap-2">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-4 w-[50%]" />
    </div>
  );
};

export default ProductCard;
