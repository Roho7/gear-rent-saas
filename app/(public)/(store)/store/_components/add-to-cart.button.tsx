import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/src/entities/models/types";

import clsx from "clsx";

type Props = {
  addedToCart: boolean;
  product: ProductType;
  className?: string;
};

const AddToCartButton = ({ addedToCart, product, className }: Props) => {
  const { addToCart, cartItems, removeFromCart } = useProducts();
  return addedToCart ? (
    <div className={clsx("flex items-center", className)}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          removeFromCart(product.product_id);
        }}
      >
        -
      </Button>
      <div className="px-4">
        {cartItems?.[product.product_id]?.quantity || 0}
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product.product_id);
        }}
      >
        +
      </Button>
    </div>
  ) : (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        addToCart(product.product_id);
      }}
    >
      Add to cart
    </Button>
  );
};

export default AddToCartButton;
