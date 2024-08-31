import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { categoryMap } from "@/data/contants";
import { ProductType } from "@/supabase/types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

type Props = {
  productId: string;
  setProductId: (value: string) => void;
};

const InnerProductList = ({
  products,
  setOpen,
  productId,
  setProductId,
  callback,
}: {
  products: ProductType[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  productId: string;
  setProductId: (value: string) => void;
  callback: () => void;
}) => {
  return (
    <Command>
      <Button variant={"outline"} className="m-2" onClick={callback}>
        Back
      </Button>
      <CommandInput placeholder="Search product..." />
      <CommandList>
        <CommandEmpty>No product found.</CommandEmpty>
        <CommandGroup>
          {products.map((product: ProductType) => (
            <CommandItem
              key={product.product_id}
              value={product.product_title || ""}
              onSelect={(currentValue) => {
                setProductId(
                  products.find(
                    (d) => currentValue && currentValue === d.product_title,
                  )?.product_id || productId,
                );
                setOpen(false);
              }}
              className="grid grid-cols-2"
            >
              <div className="h-20 w-20 ">
                <img
                  src={product.image_url || ""}
                  alt=""
                  className="object-contain h-full w-full"
                />
              </div>
              {product.product_title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const ProductCombobox = ({ productId, setProductId }: Props) => {
  const { products } = useProducts();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product: ProductType) =>
        product.category === category || category === null,
    );
  }, [category]);
  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {productId
            ? products.find(
                (product: ProductType) => product.product_id === productId,
              )?.product_title
            : "Select product..."}
          {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        {!category ? (
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No product found.</CommandEmpty>
              <CommandGroup>
                {categoryMap.map((c: string) => (
                  <CommandItem
                    key={c}
                    value={c || ""}
                    onSelect={(currentValue) => {
                      setCategory(currentValue);
                    }}
                    className="capitalize"
                  >
                    {c}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <InnerProductList
            productId={productId}
            setProductId={setProductId}
            products={filteredProducts}
            setOpen={setOpen}
            callback={() => setCategory(null)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ProductCombobox;
