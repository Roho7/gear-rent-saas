import { useProducts } from "@/app/_providers/useProducts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { categoryMap } from "@/data/contants";

const StoreSidebar = () => {
  const { setProductFilters, productFilters } = useProducts();

  return (
    <aside className="flex gap-2 justify-start max-w-fit flex-col min-w-[20vw] bg-slate-100 p-4 rounded-lg">
      <div className="flex flex-col gap-2">
        {categoryMap.map((d) => (
          <div className="flex gap-1 text-sm items-center" key={d}>
            <Checkbox
              checked={productFilters.category.includes(d)}
              key={d}
              onCheckedChange={(checked) => {
                setProductFilters((prev) => ({
                  ...prev,
                  category: checked
                    ? [...prev.gender, d]
                    : prev.gender.filter((value) => value !== d),
                }));
              }}
            />
            <Label htmlFor={d} className="capitalize">
              {d}
            </Label>
          </div>
        ))}
        <Separator className="my-2" />
      </div>
    </aside>
  );
};

export default StoreSidebar;
