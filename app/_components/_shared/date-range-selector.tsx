import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

type Props = {
  rentPeriod: DateRange | undefined;
  setRentPeriod: React.Dispatch<DateRange | undefined>;
};

const DateRangeSelector = ({ rentPeriod, setRentPeriod }: Props) => {
  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "LLL dd, y") : "";
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={clsx("w-full justify-start text-left font-normal")}
        >
          <CalendarIcon className=" h-4 w-4" />
          {rentPeriod?.from ? (
            rentPeriod.to ? (
              <>
                {format(rentPeriod.from, "LLL dd, y")} -{" "}
                {format(rentPeriod.to, "LLL dd, y")}
              </>
            ) : (
              format(rentPeriod.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={new Date(rentPeriod?.from || new Date())}
          selected={rentPeriod}
          onSelect={setRentPeriod}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
