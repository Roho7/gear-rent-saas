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
import { SearchLocationType } from "@/src/entities/models/types";

import { CommandList } from "cmdk";

import { BiSearch } from "react-icons/bi";

type Props = {
  triggerRef?: React.RefObject<HTMLButtonElement>;
  isForm?: boolean;
  searchLocation: SearchLocationType | null;
  setSearchLocation: (location: SearchLocationType | null) => void;
};

const LocationPicker = ({
  triggerRef,
  isForm = false,
  searchLocation,
  setSearchLocation,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {isForm ? (
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className="justify-between"
              ref={triggerRef}
            >
              {searchLocation?.name
                ? searchLocation?.name
                : "Search locations..."}
              <BiSearch className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        ) : (
          <Button
            variant="outline"
            role="combobox"
            className="justify-between"
            ref={triggerRef}
          >
            {searchLocation?.name
              ? searchLocation?.name
              : "Search locations..."}
            <BiSearch className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSearchLocation(null);
                }}
              >
                Anywhere
              </CommandItem>
              {popularLocations.map((location: SearchLocationType) => (
                <CommandItem
                  key={location.id}
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
