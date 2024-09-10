import { useProducts } from "../_providers/useProducts";
import ProductCard from "./product-card";

type Props = {};

const ProductRibbon = (props: Props) => {
  const { allProducts, loading } = useProducts();
  return (
    <div className="py-8">
      <h1 className="text-2xl">Featured</h1>
      <div className=" py-4 w-full overflow-x-scroll flex gap-2">
        {allProducts.map((item, index) => (
          <ProductCard product={item} key={item.product_id} loading={loading} />
        ))}
      </div>
    </div>
  );
};

export default ProductRibbon;
