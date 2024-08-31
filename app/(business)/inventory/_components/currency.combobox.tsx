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
  currency: string;
  setCurrency: (value: string) => void;
  onChange: () => void;
};

const CurrencyCombobox = ({ currency, setCurrency, onChange }: Props) => {
  const currencies = ["USD", "GBP", "EUR"];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={clsx(
              "w-[200px] justify-between",
              !currency && "text-muted-foreground",
            )}
          >
            {currency
              ? currencies.find((curr) => curr === currency)
              : "Select currency"}
            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((curr) => (
                <CommandItem
                  value={curr}
                  key={curr}
                  onSelect={() => {
                    setCurrency(curr);
                    onChange();
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

export default CurrencyCombobox;
