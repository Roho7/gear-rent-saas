import { Button } from "@/components/ui/button";
import { BiMinus, BiPlus } from "react-icons/bi";

type Props = {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  availableUnits: number;
};

const QuantityCounter = ({ quantity, setQuantity, availableUnits }: Props) => {
  return (
    <>
      <div className="flex text-muted text-xs w-full justify-between">
        <span>Qty.</span>
        <span>{availableUnits && "Available:" + " " + availableUnits}</span>
      </div>
      <div className="border border-muted/20 rounded-full p-1 flex items-center justify-between">
        <Button
          size={"xs"}
          className="rounded-full"
          disabled={quantity === 1 || !availableUnits}
          onClick={() => setQuantity((prev) => (prev > 1 ? quantity - 1 : 1))}
        >
          <BiMinus />
        </Button>
        <span>{availableUnits ? quantity : "-"}</span>
        <Button
          size={"xs"}
          className="rounded-full"
          disabled={!availableUnits}
          onClick={() =>
            setQuantity((prev) => (prev < availableUnits ? quantity + 1 : prev))
          }
        >
          <BiPlus />
        </Button>
      </div>
    </>
  );
};

export default QuantityCounter;
