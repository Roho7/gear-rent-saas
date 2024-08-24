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
import { ProductType } from "@/supabase/types";
import { useState } from "react";

type Props = {
  value: ProductType | null;
  setValue: (value: ProductType | null) => void;
};

const ProductCombobox = ({ value, setValue }: Props) => {
  const { products } = useProducts();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? products.find(
                (product: ProductType) =>
                  product.product_id === value.product_id,
              )?.product_title
            : "Select product..."}
          {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {products.map((product: ProductType) => (
                <CommandItem
                  key={product.product_id}
                  value={product.product_title || ""}
                  onSelect={(currentValue) => {
                    setValue(
                      products.find(
                        (d) => currentValue && currentValue === d.product_title,
                      ) || value,
                    );
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  <div className="h-20 w-20 ">
                    <img
                      src={product.image_url || ""}
                      alt=""
                      className="object-cover"
                    />
                  </div>
                  {product.product_title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductCombobox;
