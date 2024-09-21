import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type UserCheckoutDetailsType = {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  shoeSize: string;
};

const CheckoutUserDetails = () => {
  const searchParams = useSearchParams();
  const quantity = parseInt(searchParams.get("quantity") || "1", 10);
  const [users, setUsers] = useState<UserCheckoutDetailsType[]>([]);

  useEffect(() => {
    setUsers(
      Array(quantity).fill({
        name: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
        shoeSize: "",
      }),
    );
  }, [quantity]);

  const handleInputChange = (
    index: number,
    field: keyof UserCheckoutDetailsType,
    value: string,
  ) => {
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [field]: value };
    setUsers(newUsers);
  };

  return (
    <div className="col-span-3 space-y-6">
      <h2 className="text-2xl">Request to book</h2>
      {users.map((user, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Person {index + 1} Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Name</Label>
                <Input
                  id={`name-${index}`}
                  value={user.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`gender-${index}`}>Gender</Label>
                <Select
                  value={user.gender}
                  onValueChange={(value) =>
                    handleInputChange(index, "gender", value)
                  }
                >
                  <SelectTrigger id={`gender-${index}`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`age-${index}`}>Age</Label>
                <Input
                  id={`age-${index}`}
                  type="number"
                  value={user.age}
                  onChange={(e) =>
                    handleInputChange(index, "age", e.target.value)
                  }
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`height-${index}`}>Height (cm)</Label>
                <Input
                  id={`height-${index}`}
                  type="number"
                  value={user.height}
                  onChange={(e) =>
                    handleInputChange(index, "height", e.target.value)
                  }
                  placeholder="Enter height"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                <Input
                  id={`weight-${index}`}
                  type="number"
                  value={user.weight}
                  onChange={(e) =>
                    handleInputChange(index, "weight", e.target.value)
                  }
                  placeholder="Enter weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`shoeSize-${index}`}>Shoe Size</Label>
                <Input
                  id={`shoeSize-${index}`}
                  type="number"
                  value={user.shoeSize}
                  onChange={(e) =>
                    handleInputChange(index, "shoeSize", e.target.value)
                  }
                  placeholder="Enter shoe size"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CheckoutUserDetails;
