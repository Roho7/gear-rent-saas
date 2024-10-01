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
import { ChevronsUpDown } from "lucide-react";

type Props = {
  data: string[];
  value: string | undefined | null;
  setValue: (value: string) => void;
  onChange?: () => void;
  hasSearch?: boolean;
  emptyMessage?: string;
};

const SingleSelectCombobox = ({
  data,
  value,
  setValue,
  onChange,
  hasSearch,
  emptyMessage,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={clsx(
              "min-w-[200px] w-full justify-between",
              !value && "text-muted-foreground",
            )}
          >
            {value
              ? data.find((curr) => curr === value)
              : emptyMessage
              ? emptyMessage
              : "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {hasSearch && <CommandInput />}
          <CommandList>
            <CommandEmpty>Nothing found.</CommandEmpty>
            <CommandGroup>
              {data.map((curr) => (
                <CommandItem
                  value={curr}
                  key={curr}
                  onSelect={() => {
                    setValue(curr);
                    onChange && onChange();
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

export default SingleSelectCombobox;
