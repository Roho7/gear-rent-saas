import { useProducts } from "@/app/_providers/useProducts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  categoryMap,
  expertiseMap as experienceMap,
  genderMap,
  styleMap,
} from "@/data/contants";
import { BiFilterAlt } from "react-icons/bi";

const StoreSidebar = () => {
  const { setProductFilters, productFilters } = useProducts();

  return (
    <aside className="flex gap-2 justify-start max-w-fit flex-col min-w-[20vw] bg-slate-100 p-4 rounded-lg">
      <div className="flex flex-col gap-2">
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
        {experienceMap.map((d) => (
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
