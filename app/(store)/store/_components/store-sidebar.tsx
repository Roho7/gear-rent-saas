import { useAuth } from "@/app/_providers/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";

type FilterObjectType = {
  id: string;
  label: string;
};

const filterMap: Record<string, FilterObjectType[]> = {
  sport: [
    {
      id: "skiing",
      label: "Skiing",
    },
    {
      id: "snowboarding",
      label: "Snoboarding",
    },
    {
      id: "hiking",
      label: "Hiking",
    },
    {
      id: "camping",
      label: "Camping",
    },
  ],
  location: [
    {
      id: "chamonix",
      label: "Chamonix",
    },
    {
      id: "tignis",
      label: "Tignis",
    },
    {
      id: "vermont",
      label: "Vermont",
    },
  ],
  price: [
    {
      id: "0-100",
      label: "$0 - $100",
    },
    {
      id: "100-200",
      label: "$100 - $200",
    },
    {
      id: "200-500",
      label: "$200 - $500",
    },
    {
      id: "500+",
      label: "$500+",
    },
  ],
  season: [
    {
      id: "winter",
      label: "Winter",
    },
    {
      id: "summer",
      label: "Summer",
    },
    {
      id: "all",
      label: "All seasons",
    },
  ],
} as const;

const StoreSidebar = () => {
  const { fetchAndCacheData } = useAuth();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <aside className="flex gap-2 justify-start max-w-fit flex-col min-w-[20vw] bg-slate-100 p-4 rounded-lg">
      <div className="flex flex-col">
        {Object.keys(filterMap).map((item) => (
          <div className="flex flex-col gap-2" key={item}>
            <h2 className="font-medium text-slate-500 capitalize">{item}</h2>
            {filterMap[item].map((d: FilterObjectType) => (
              <div className="flex gap-1 text-sm items-center" key={d.id}>
                <Checkbox
                  checked={selectedValues.includes(d.id)}
                  key={d.id}
                  onCheckedChange={(checked) => {
                    return checked
                      ? setSelectedValues([...selectedValues, d.id])
                      : setSelectedValues(
                          selectedValues.filter((value) => value !== d.id),
                        );
                  }}
                />
                <Label htmlFor={d.id}>{d.label}</Label>
              </div>
            ))}
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default StoreSidebar;
