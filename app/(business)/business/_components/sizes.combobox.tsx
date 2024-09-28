import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
  allSizes: string[];
  setSelectedSize: (value: string) => void;
  selectedSize: string;
};

const SizesCombobox = ({ allSizes, selectedSize, setSelectedSize }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={clsx(
              "w-[200px] justify-between",
              !selectedSize && "text-muted-foreground",
            )}
          >
            {selectedSize
              ? allSizes.find((curr) => curr === selectedSize)
              : "Select sizes"}
            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search sizes..." />
          <CommandList>
            <CommandEmpty>No sizes found.</CommandEmpty>
            <CommandGroup>
              {allSizes.map((curr) => (
                <CommandItem
                  value={curr}
                  key={curr}
                  onSelect={() => {
                    setSelectedSize(curr);
                  }}
                >
                  {curr}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SizesCombobox;
