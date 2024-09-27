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
import { sportMap } from "@/src/entities/models/product";
import React from "react";

type Props = {
  triggerRef?: React.RefObject<HTMLButtonElement>;
  isForm?: boolean;
  sport: string | undefined;
  setSport: (sport: string | undefined) => void;
};

const SportPicker = ({
  triggerRef,
  isForm = false,
  sport,
  setSport,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger className="w-48">
        {isForm ? (
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className="justify-between w-48"
              ref={triggerRef}
            >
              {sport ? sportMap[sport].name : "Any Sport"}
              {sport &&
                sportMap[sport].icon({
                  className: "ml-2 h-4 w-4 shrink-0 opacity-50",
                })}
            </Button>
          </FormControl>
        ) : (
          <Button
            variant="outline"
            role="combobox"
            className="justify-between w-48"
            ref={triggerRef}
          >
            {sport ? sportMap[sport].name : "Any Sport"}
            {sport &&
              sportMap[sport].icon({
                className: "ml-2 h-4 w-4 shrink-0 opacity-50",
              })}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search sports..." />
          <CommandList>
            <CommandEmpty>No sport found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSport(undefined);
                }}
              >
                Any Sport
              </CommandItem>
              {Object.entries(sportMap).map(([category, value]) => (
                <CommandItem
                  key={category}
                  onSelect={() => {
                    setSport(category);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {value.icon({ className: "text-muted" })}
                    {value.name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SportPicker;
