import { useProducts } from "@/app/_providers/useProducts";
import { ProductType } from "@/supabase/types";

type Props = {
  product: ProductType | undefined;
};

const CartRowItem = ({ product }: Props) => {
  const { cartItems } = useProducts();
  return (
    <div className="p-2 border-b border-stone-200 flex gap-2">
      <div className="object-cover h-20 w-20">
        <img src={product?.image_url || ""} alt="" className="rounded-sm" />
      </div>
      <div>
        <p className="text-xl">{product?.product_title}</p>
        <p>$</p>
        <p className="text-gray-400">
          Qt. {cartItems?.[product?.product_id || ""]?.quantity}
        </p>
      </div>
    </div>
  );
};

export default CartRowItem;
