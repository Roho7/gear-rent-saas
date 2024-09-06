import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  data: string[];
};

const DropdownSelector = ({ value, onValueChange, data }: Props) => {
  return (
    <div>
      <Label htmlFor="title">Category</Label>
      <Select
        value={value || undefined}
        onValueChange={(value) => onValueChange(value)}
      >
        <SelectTrigger id="category">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {data.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownSelector;
