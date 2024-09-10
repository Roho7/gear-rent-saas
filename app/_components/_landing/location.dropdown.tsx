import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { popularLocations } from "@/src/entities/models/constants";
import { SearchLocationType } from "@/src/entities/models/types";

import { CommandList } from "cmdk";

import { BiSearch } from "react-icons/bi";

const LocationPicker = () => {
  const { searchLocation, setSearchLocation } = useProducts();
  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* <FormControl> */}
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {searchLocation?.name ? searchLocation?.name : "Search locations..."}
          <BiSearch className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {/* </FormControl> */}
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {popularLocations.map((location: SearchLocationType) => (
                <CommandItem
                  key={location.name}
                  onSelect={() => {
                    setSearchLocation(location);
                  }}
                >
                  {location.name}
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
