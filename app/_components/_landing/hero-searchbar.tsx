import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { useForm } from "react-hook-form";

import { HeroSearchFormType } from "@/src/entities/models/formSchemas";
import { categoryMap, expertiseMap } from "@/src/entities/models/product";
import clsx from "clsx";
import { date, z } from "zod";
import LocationPicker from "./location.dropdown";

const MainSearchbar = () => {
  const form = useForm<z.infer<typeof HeroSearchFormType>>({
    resolver: zodResolver(HeroSearchFormType),
    defaultValues: {
      rentPeriod: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
    },
  });

  const handleSearch = async (data: z.infer<typeof HeroSearchFormType>) => {
    console.log(data);
    localStorage.setItem("search-results", JSON.stringify(data));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSearch)}
        className="bg-white rounded-md text-black flex items-center p-2 shadow-lg"
      >
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full px-2 border-r border-gray-100">
              <FormLabel className="text-gray-400">Sport</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="category" className="py-4 capitalize">
                    <SelectValue
                      placeholder="Select Sport"
                      className="outline-none"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  {categoryMap.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="capitalize"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem className="w-full px-2 border-r border-gray-100">
              <FormLabel className="text-gray-400">Experience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="experience" className="py-4 capitalize">
                    <SelectValue
                      placeholder="Select Experience"
                      className="outline-none"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  {expertiseMap.map((experience) => (
                    <SelectItem
                      key={experience}
                      value={experience}
                      className="capitalize"
                    >
                      {experience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rentPeriod"
          render={({ field }) => (
            <FormItem className="w-full px-2 border-r border-gray-100 flex flex-col">
              <FormLabel className="text-gray-400 pt-1 mb-1">
                Rent period
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={clsx(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        field.value?.to ? (
                          <>
                            {format(field.value?.from, "LLL dd, y")} -{" "}
                            {format(field.value?.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value?.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="w-full px-2 border-r border-gray-100 flex flex-col">
              <FormLabel className="text-gray-400">Location</FormLabel>
              <LocationPicker
                setSearchLocation={field.onChange}
                searchLocation={field.value}
                isForm={true}
              />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-auto">
          Search
        </Button>
      </form>
    </Form>
  );
};

export default MainSearchbar;
