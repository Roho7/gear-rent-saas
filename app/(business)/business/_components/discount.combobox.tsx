import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import clsx from "clsx";

type Props = {
  discount: number;
  setDiscount: (value: number) => void;
  recommendedDiscount?: number;
  onChange: () => void;
};

const DiscountCombobox = ({
  discount,
  setDiscount,
  recommendedDiscount,
  onChange,
}: Props) => {
  const discounts = [0, 5, 10, 15, 20, 30];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={clsx(
              "w-[200px] justify-between",
              !discount && "text-muted-foreground",
            )}
          >
            {discount
              ? discounts.find((curr) => curr === discount)
              : "Select discount"}
            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No discount found.</CommandEmpty>
            <CommandGroup>
              {discounts.map((curr) => (
                <CommandItem
                  value={curr.toString()}
                  key={curr}
                  onSelect={() => {
                    setDiscount(curr);
                    onChange();
                  }}
                  className="flex justify-between"
                >
                  {curr}%
                  {curr === recommendedDiscount && (
                    <Badge
                      variant="secondary"
                      className="font-normal pointer-events-none"
                    >
                      Recommended
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DiscountCombobox;
