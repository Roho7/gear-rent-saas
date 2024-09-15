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

import { useProducts } from "@/app/_providers/useProducts";
import { Label } from "@/components/ui/label";
import { MainSearchFormSchema } from "@/src/entities/models/formSchemas";
import { categoryMap, expertiseMap } from "@/src/entities/models/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { addDays, format } from "date-fns";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { BiSearch } from "react-icons/bi";
import { FaSkiing, FaTrophy } from "react-icons/fa";
import { MdCalendarMonth, MdLocationPin } from "react-icons/md";
import { date, z } from "zod";
import LocationPicker from "./location.dropdown";

type CollapsedSearchBarProps = {
  location?: string;
  from?: Date;
  to?: Date;
  experience?: string;
  sport?: string;
  collapsed: boolean;
  setCollapsed: React.Dispatch<SetStateAction<boolean>>;
};

const CollapsedSearchBar = ({
  location,
  from,
  to,
  experience,
  sport,
  collapsed,
  setCollapsed,
}: CollapsedSearchBarProps) => {
  const collapsedItemsClassName = "flex items-center gap-1 capitalize";
  return (
    <div
      className={clsx(
        "flex items-center justify-center shadow-md gap-8 p-2 transition-all ease-in-out text-sm w-fit rounded-md bg-card mx-auto text-muted-foreground",
        !collapsed
          ? "-translate-y-[100%] opacity-0 scale-0"
          : "translate-y-10 opacity-100 scale-100",
      )}
      role="button"
      onClick={() => setCollapsed(false)}
    >
      <span className={collapsedItemsClassName}>
        <MdLocationPin />
        {location ?? "Anywhere"}
      </span>
      <span className={collapsedItemsClassName}>
        <MdCalendarMonth />
        {dayjs(from).format("D MMM")} -{" "}
        {dayjs(to).format("D MMM") ?? "Flexible"}
      </span>
      <span className={collapsedItemsClassName}>
        <FaSkiing />
        {sport ?? "Any Sport"}
      </span>
      <span className={collapsedItemsClassName}>
        <FaTrophy />
        {experience ?? "Any Experience"}
      </span>
    </div>
  );
};

const MainSearchbar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { fetchListings } = useProducts();
  const form = useForm<z.infer<typeof MainSearchFormSchema>>({
    resolver: zodResolver(MainSearchFormSchema),
    defaultValues: {
      rentPeriod: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      location: {
        ...(
          JSON.parse(localStorage.getItem("search-results") || "{}") ||
          ({} as (typeof MainSearchFormSchema)["_output"])
        ).location,
      },
    },
  });

  const handleSearch = async (data: z.infer<typeof MainSearchFormSchema>) => {
    localStorage.setItem("search-results", JSON.stringify(data));
    await fetchListings(data);
    router.push("/store");
  };

  return (
    <div className="flex flex-col items-center relative">
      <CollapsedSearchBar
        location={form.getValues().location?.name}
        from={form.getValues().rentPeriod?.from}
        to={form.getValues().rentPeriod?.to}
        experience={form.getValues()?.experience}
        sport={form.getValues()?.sport}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSearch)}
          className={clsx(
            " rounded-md text-black flex animate-in items-center p-2 transition-all delay-75 ease-out",
            collapsed
              ? "-translate-y-[100%] opacity-0"
              : "translate-y-[-20%] opacity-100",
          )}
        >
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-48 px-2 border-r border-gray-100 flex flex-col">
                <FormLabel className="text-gray-400 text-xs pt-1">
                  Location
                </FormLabel>
                <LocationPicker
                  setSearchLocation={field.onChange}
                  searchLocation={field.value}
                  isForm={true}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rentPeriod"
            render={({ field }) => (
              <FormItem className="w-full px-2 border-r border-gray-100 flex flex-col">
                <FormLabel className="text-gray-400 pt-1 text-xs">
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
                        <CalendarIcon className=" h-4 w-4" />
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
            name="sport"
            render={({ field }) => (
              <FormItem className="w-48 px-2 border-r border-gray-100 flex-col flex gap-0.5">
                <Label className="text-gray-400 text-xs mb-0">Sport</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
              <FormItem className="w-48 px-2 border-r border-gray-100 flex flex-col gap-0.5">
                <FormLabel className="text-gray-400 text-xs">
                  Experience
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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

          <Button
            type="submit"
            className="mt-auto ml-2 px-2 rounded-full w-10 h-10 shrink-0"
            size={"icon"}
          >
            <BiSearch />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MainSearchbar;
