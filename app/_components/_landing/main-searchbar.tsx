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

import { Label } from "@/components/ui/label";
import { popularLocations } from "@/src/entities/models/constants";
import { MainSearchFormSchema } from "@/src/entities/models/formSchemas";
import { sportMap } from "@/src/entities/models/product";
import { SearchLocationType } from "@/src/entities/models/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { format } from "date-fns";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSearch } from "react-icons/bi";
import { FaDice } from "react-icons/fa";
import { MdCalendarMonth, MdLocationPin } from "react-icons/md";
import { date, z } from "zod";
import LocationPicker from "./location-picker";
import SportPicker from "./sport-picker";

type CollapsedSearchBarProps = {
  location?: string;
  from?: Date;
  to?: Date;
  sport?: string;
  collapsed: boolean;
  onClick: () => void;
};

const CollapsedSearchBar = ({
  location,
  from,
  to,
  sport,
  collapsed,
  onClick,
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
      onClick={onClick}
    >
      <span className={collapsedItemsClassName}>
        <MdLocationPin />
        {location ?? "Anywhere"}
      </span>
      <span className={collapsedItemsClassName}>
        <MdCalendarMonth />
        {from
          ? `${dayjs(from).format("D MMM")} - ${dayjs(to).format("D MMM")}`
          : "Anytime"}
      </span>
      <span className={collapsedItemsClassName}>
        {sport ? sportMap[sport].icon(<div />) : <FaDice />}
        {sport ?? "Any Sport"}
      </span>
    </div>
  );
};

const MainSearchbar = ({
  collapsed,
  setCollapsed,
  setIsSearchActive,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<SetStateAction<boolean>>;
  setIsSearchActive: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationSelectorRef = useRef<HTMLButtonElement>(null);
  const sportSelectorRef = useRef<HTMLButtonElement>(null);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof MainSearchFormSchema>>({
    resolver: zodResolver(MainSearchFormSchema),
    defaultValues: {
      location: null,
      rentPeriod: {
        from: undefined,
        to: undefined,
      },
      sport: undefined,
    },
  });

  const handleSearch = async (data: z.infer<typeof MainSearchFormSchema>) => {
    setIsSearchActive(false);
    const searchParams = new URLSearchParams();

    if (data.sport) searchParams.append("sport", data.sport);
    if (data.rentPeriod?.from)
      searchParams.append(
        "rentFrom",
        format(data.rentPeriod.from, "yyyy-MM-dd"),
      );
    if (data.rentPeriod?.to)
      searchParams.append("rentTill", format(data.rentPeriod.to, "yyyy-MM-dd"));
    if (data.location) {
      searchParams.append("locationId", data.location.id);
      searchParams.append("lat", data.location.lat.toString());
      searchParams.append("lng", data.location.lng.toString());
      if (data.location.radius)
        searchParams.append("radius", data.location.radius.toString());
    }

    const searchUrl = `/store?${searchParams.toString()}`;
    router.push(searchUrl);
  };

  // EFFECT FOR OPENING DATE PICKER WHEN LOCATION IS SELECTED
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === "location" && type === "change" && value.location) {
        setIsDatePopoverOpen(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // EFFECT FOR RESETING FORM FIELDS WHEN SEARCH BAR IS COLLAPSED
  useEffect(() => {
    if (collapsed) {
      if (isDatePopoverOpen) {
        setIsDatePopoverOpen(false);
      }
      const currentValues = form.getValues();
      const sport = searchParams.get("sport");
      const rentFrom = searchParams.get("rentFrom");
      const rentTill = searchParams.get("rentTill");
      const locationId = searchParams.get("locationId");

      if (!sport) form.resetField("sport");
      if (!rentFrom || !rentTill) form.resetField("rentPeriod");
      if (!locationId) form.resetField("location");
    }
  }, [collapsed, searchParams]);

  // EFFECT FOR POPULATING FORM FIELDS FROM URL SEARCH PARAMS
  useEffect(() => {
    const sport = searchParams.get("sport");
    const rentFrom = searchParams.get("rentFrom");
    const rentTill = searchParams.get("rentTill");
    const locationId = searchParams.get("locationId");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");

    if (sport) {
      form.setValue("sport", sport);
    } else {
      form.setValue("sport", undefined);
    }

    if (rentFrom && rentTill) {
      form.setValue("rentPeriod", {
        from: new Date(rentFrom),
        to: new Date(rentTill),
      });
    }

    if (locationId && lat && lng) {
      const location: SearchLocationType = {
        id: locationId,
        name: popularLocations.find((l) => l.id === locationId)?.name || "",
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius: radius ? parseFloat(radius) : undefined,
      };
      form.setValue("location", location);
    }
  }, [searchParams, form]);

  return (
    <div className="flex flex-col items-center relative">
      <CollapsedSearchBar
        location={form.getValues().location?.name}
        from={form.getValues().rentPeriod?.from}
        to={form.getValues().rentPeriod?.to}
        sport={form.getValues()?.sport}
        collapsed={collapsed}
        onClick={() => {
          setCollapsed(false);
          if (locationSelectorRef.current) {
            locationSelectorRef.current.click();
          }
        }}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSearch)}
          onClick={() => {
            setIsSearchActive(true);
          }}
          className={clsx(
            " rounded-md text-black flex gap-2 animate-in items-center p-2 transition-all delay-75 ease-out",
            collapsed
              ? "-translate-y-[100%] opacity-0"
              : "translate-y-[-20%] opacity-100",
          )}
        >
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="min-w-52 px-2 border-r border-gray-100 flex flex-col">
                <FormLabel className="text-gray-400 text-xs pt-1">
                  Location
                </FormLabel>
                <LocationPicker
                  triggerRef={locationSelectorRef}
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
              <FormItem className="min-w-60 px-2 border-r border-gray-100 flex flex-col">
                <FormLabel className="text-gray-400 pt-1 text-xs">
                  Rent period
                </FormLabel>
                <Popover
                  open={isDatePopoverOpen}
                  onOpenChange={setIsDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id="date"
                        variant={"outline"}
                        onClick={() => setIsDatePopoverOpen(!isDatePopoverOpen)}
                        className={clsx(
                          "min-w-48 w-full justify-start text-left font-normal",
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
                <SportPicker
                  triggerRef={sportSelectorRef}
                  isForm={true}
                  sport={field.value}
                  setSport={(value) => field.onChange(value)}
                />
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
