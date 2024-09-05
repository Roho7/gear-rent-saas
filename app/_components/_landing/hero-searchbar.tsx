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
import { categoryMap, expertiseMap } from "@/data/contants";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

import { z } from "zod";
import LocationPicker from "./location.dropdown";

const FormSchema = z.object({
  category: z.string().optional(),
  experience: z.string().optional(),
  rentFrom: z.date().optional(),
  rentUntil: z.date().optional(),
  location: z.string().optional(),
});

const MainSearchbar = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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
          name="rentFrom"
          render={({ field }) => (
            <FormItem className="w-full px-2 border-r border-gray-100">
              <FormLabel className="text-gray-400">Rent from</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={clsx(
                        "w-[200px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rentUntil"
          render={({ field }) => (
            <FormItem className="w-full px-2 border-r border-gray-100">
              <FormLabel className="text-gray-400">Rent until</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={clsx(
                        "w-[200px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
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
            <FormItem className="w-full px-2">
              <FormLabel className="text-gray-400">Location</FormLabel>
              <LocationPicker
                location={field.value ?? ""}
                setLocation={field.onChange}
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
