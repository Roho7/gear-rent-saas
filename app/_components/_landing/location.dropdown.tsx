import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { popularLocations } from "@/src/entities/models/constants";

import { CommandList } from "cmdk";

import { BiSearch } from "react-icons/bi";

type Props = {
  location: string;
  setLocation: (value: string) => void;
};

const LocationPicker = ({ location, setLocation }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {location ? location : "Search locations..."}
            <BiSearch className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {popularLocations.map((location: string) => (
                <CommandItem
                  key={location}
                  onSelect={() => {
                    setLocation(location);
                  }}
                >
                  {location}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationPicker;
