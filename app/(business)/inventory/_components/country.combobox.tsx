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
import { useEffect, useState } from "react";

type Props = {
  country: string;
  setCountry: (value: string) => void;
};

const CountryCombobox = ({ country, setCountry }: Props) => {
  const [countries, setCountries] = useState([]);
  const fetchCountries = async () => {
    const countries = await fetch("https://restcountries.com/v3.1/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await countries.json();
    setCountries(data.map((curr: any) => curr.name.common));
  };

  useEffect(() => {
    fetchCountries();
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={clsx(
              "w-full justify-between",
              !country && "text-muted-foreground",
            )}
          >
            {country
              ? countries.find((curr) => curr === country)
              : "Select country"}
            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((curr: string) => (
                <CommandItem
                  value={curr.toString()}
                  key={curr}
                  onSelect={() => {
                    setCountry(curr);
                  }}
                  className="flex justify-between"
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

export default CountryCombobox;
