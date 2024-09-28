import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useCheckout } from "../_providers/useCheckout";

const CheckoutCustomerDetailsForm = ({}: {}) => {
  const { control } = useFormContext();
  const { quantity } = useCheckout();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "customerDetails.customers",
  });

  useEffect(() => {
    // Adjust the number of user forms based on the quantity
    const currentLength = fields.length;
    if (quantity > currentLength) {
      for (let i = currentLength; i < quantity; i++) {
        append({
          name: "",
          gender: "",
          age: "",
          height: "",
          weight: "",
          shoeSize: "",
        });
      }
    } else if (quantity < currentLength) {
      for (let i = currentLength - 1; i >= quantity; i--) {
        remove(i);
      }
    }
  }, [quantity, fields.length, append, remove]);

  return (
    <div className="col-span-3 space-y-6">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader>
            <CardTitle>Person {index + 1} Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`customerDetails.customers.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`customerDetails.customers.${index}.gender`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`customerDetails.customers.${index}.age`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter age" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`customerDetails.customers.${index}.height`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter height"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`customerDetails.customers.${index}.weight`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter weight"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`customerDetails.customers.${index}.shoeSize`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shoe Size</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter shoe size"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CheckoutCustomerDetailsForm;
