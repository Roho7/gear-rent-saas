import { useCart } from "@/app/_providers/useCart";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/supabase/types";

type Props = {
  addedToCart: boolean;
  product: ProductType;
};

const AddToCartButton = ({ addedToCart, product }: Props) => {
  const { addToCart, cartItems, removeFromCart } = useCart();
  return addedToCart ? (
    <div className="flex">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          removeFromCart(product.product_id);
        }}>
        -
      </Button>
      <div className="p-2 px-4">
        {cartItems?.[product.product_id]?.quantity || 0}
      </div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product.product_id);
        }}>
        +
      </Button>
    </div>
  ) : (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        addToCart(product.product_id);
      }}>
      Add to cart
    </Button>
  );
};

export default AddToCartButton;
