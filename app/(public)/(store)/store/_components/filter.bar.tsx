import { Button } from "@/components/ui/button";
import { expertiseMap } from "@/src/entities/models/product";

type Props = {};

const StoreFilterBar = (props: Props) => {
  return (
    <nav className=" py-2 border-b border-border flex gap-2 rounded-md">
      {expertiseMap.map((expertise) => {
        return (
          <Button key={expertise} variant={"outline"} className="capitalize">
            {expertise}
          </Button>
        );
      })}
    </nav>
  );
};

export default StoreFilterBar;
