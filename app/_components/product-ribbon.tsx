import { useAuth } from "../_providers/useAuth";
import ProductCard from "./product-card";

type Props = {};

const ProductRibbon = (props: Props) => {
  const { products } = useAuth();
  return (
    <div className="py-8">
      <h1 className="text-2xl">Featured</h1>
      <div className=" py-4 w-full overflow-x-scroll flex gap-2">
        {products.map((item, index) => (
          <ProductCard product={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductRibbon;
