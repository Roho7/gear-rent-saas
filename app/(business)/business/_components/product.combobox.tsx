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
import { ProductGroupType } from "@/src/entities/models/types";
import { ChevronsUpDown } from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

type Props = {
  productId: string;
  setProductId: (value: string) => void;
  disabled: boolean;
};

const InnerProductList = ({
  products,
  setOpen,
  setProductId,
  callback,
}: {
  products: ProductGroupType[];
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
          {products.map((product, index) => (
            <CommandItem
              key={product.product_group_id}
              value={product.product_group_id}
              onSelect={(currentValue) => {
                setProductId(currentValue as string);
                setOpen(false);
              }}
              className="grid grid-cols-2"
            >
              <div className="h-20 w-20 ">
                <img
                  src={product.image_url || "/placeholder_image.png"}
                  alt=""
                  className="object-contain h-full w-full"
                />
              </div>
              {product.product_group_name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const ProductCombobox = ({ productId, setProductId, disabled }: Props) => {
  const { productGroups } = useProducts();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const aggregatedProductGroupsBySport = useMemo(() => {
    return productGroups.reduce(
      (acc: Record<string, Record<string, ProductGroupType>>, curr) => {
        if (!acc[curr.sport]) {
          acc[curr.sport] = {};
        }

        // Use product_group_id as the key if product_group_name is null
        const key = curr.product_group_name || curr.product_group_id;
        acc[curr.sport][key] = curr;

        return acc;
      },
      {},
    );
  }, [productGroups]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          disabled={disabled}
        >
          {productId
            ? productGroups.find((p) => p.product_group_id === productId)
                ?.product_group_name
            : "Select product..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        {!category ? (
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No product found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(aggregatedProductGroupsBySport).map(
                  ([sport, values]) => (
                    <CommandItem
                      key={sport}
                      value={sport}
                      onSelect={(currentValue) => {
                        setCategory(currentValue);
                      }}
                      className="capitalize"
                    >
                      {sport}
                    </CommandItem>
                  ),
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <InnerProductList
            productId={productId}
            setProductId={setProductId}
            products={productGroups.filter((p) => p.sport === category)}
            setOpen={setOpen}
            callback={() => setCategory(null)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ProductCombobox;
