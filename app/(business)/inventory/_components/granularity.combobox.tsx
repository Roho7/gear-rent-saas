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
  granularity: string;
  setGranularity: (value: string) => void;
  onChange: () => void;
};

const GranularityCombobox = ({
  granularity,
  setGranularity,
  onChange,
}: Props) => {
  const granularities = ["daily", "hourly"];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={clsx(
              "w-[200px] justify-between",
              !granularity && "text-muted-foreground",
            )}
          >
            {granularity
              ? granularities.find((curr) => curr === granularity)
              : "Select granularity"}
            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search granularity..." />
          <CommandList>
            <CommandEmpty>No granularity found.</CommandEmpty>
            <CommandGroup>
              {granularities.map((curr) => (
                <CommandItem
                  value={curr}
                  key={curr}
                  onSelect={() => {
                    setGranularity(curr);
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

export default GranularityCombobox;
