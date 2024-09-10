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

import { Label } from "@/components/ui/label";
import { categoryMap, expertiseMap } from "@/src/entities/models/product";
import clsx from "clsx";
import { DateRange } from "react-day-picker";
import { date, z } from "zod";
import LocationPicker from "./location.dropdown";

const FormSchema = z.object({
  category: z.string().optional(),
  experience: z.string().optional(),
  rentPeriod: z
    .object({
      from: date().optional(),
      to: date().optional(),
    })
    .optional() as z.ZodType<DateRange, any>,
});

const MainSearchbar = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rentPeriod: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
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

        <Label className="text-gray-400">Location</Label>
        <LocationPicker />

        <Button type="submit" className="mt-auto">
          Search
        </Button>
      </form>
    </Form>
  );
};

export default MainSearchbar;
