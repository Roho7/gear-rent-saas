import { useProducts } from "@/app/_providers/useProducts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  categoryMap,
  expertiseMap,
  genderMap,
  styleMap,
} from "@/src/entities/models/product";

import { BiFilterAlt } from "react-icons/bi";

const StoreSidebar = () => {
  const {
    setProductFilters,
    productFilters,
    setSearchQuery,
    fetchAndCacheData,
  } = useProducts();

  return (
    <aside className="flex gap-2 justify-start flex-col w-[15vw] max-w-[20vw] bg-secondary/50 p-4 rounded-md ">
      <div className="flex flex-col gap-2">
        <Button onClick={() => fetchAndCacheData("products", true)}>
          Refresh
        </Button>
        <Input
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <h2 className="text-gray-400 flex items-center gap-2 my-2">
          <BiFilterAlt className="" /> Filters
        </h2>
        {categoryMap.map((d) => (
          <div className="flex gap-1 text-sm items-center" key={d}>
            <Checkbox
              checked={productFilters.category.includes(d)}
              key={d}
              onCheckedChange={(checked) => {
                setProductFilters((prev) => ({
                  ...prev,
                  category: checked
                    ? [...prev.category, d]
                    : prev.category.filter((c) => c !== d),
                }));
              }}
            />
            <Label htmlFor={d} className="capitalize">
              {d}
            </Label>
          </div>
        ))}
        <Separator className="my-2" />
        {genderMap.map((d) => (
          <div className="flex gap-1 text-sm items-center" key={d}>
            <Checkbox
              checked={productFilters.gender.includes(d)}
              key={d}
              onCheckedChange={(checked) => {
                setProductFilters((prev) => ({
                  ...prev,
                  gender: checked
                    ? [...prev.gender, d]
                    : prev.gender.filter((c) => c !== d),
                }));
              }}
            />
            <Label htmlFor={d} className="capitalize">
              {d}
            </Label>
          </div>
        ))}
        <Separator className="my-2" />
        {expertiseMap.map((d) => (
          <div className="flex gap-1 text-sm items-center" key={d}>
            <Checkbox
              checked={productFilters.experience.includes(d)}
              key={d}
              onCheckedChange={(checked) => {
                setProductFilters((prev) => ({
                  ...prev,
                  experience: checked
                    ? [...prev.experience, d]
                    : prev.experience.filter((c) => c !== d),
                }));
              }}
            />
            <Label htmlFor={d} className="capitalize">
              {d}
            </Label>
          </div>
        ))}
        <Separator className="my-2" />
        {styleMap.map((d) => (
          <div className="flex gap-1 text-sm items-center" key={d}>
            <Checkbox
              checked={productFilters.style.includes(d)}
              key={d}
              onCheckedChange={(checked) => {
                setProductFilters((prev) => ({
                  ...prev,
                  style: checked
                    ? [...prev.style, d]
                    : prev.style.filter((c) => c !== d),
                }));
              }}
            />
            <Label htmlFor={d} className="capitalize">
              {d}
            </Label>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default StoreSidebar;
