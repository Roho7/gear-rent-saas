import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
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
import { CheckoutUserFormSchema } from "@/src/entities/models/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const CheckoutUserDetails = ({
  onSubmit,
  formRef,
  onValidityChange,
}: {
  onSubmit: (data: z.infer<typeof CheckoutUserFormSchema>) => void;
  formRef: React.RefObject<HTMLFormElement>;
  onValidityChange: (isValid: boolean) => void;
}) => {
  const searchParams = useSearchParams();
  const quantity = parseInt(searchParams.get("quantity") || "1", 10);

  const form = useForm<z.infer<typeof CheckoutUserFormSchema>>({
    resolver: zodResolver(CheckoutUserFormSchema),
    defaultValues: {
      users: Array(quantity).fill({
        name: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
        shoeSize: "",
      }),
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
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

  useEffect(() => {
    const subscription = form.watch(() => {
      onValidityChange(form.formState.isValid);
    });
    return () => subscription.unsubscribe();
  }, [form, onValidityChange]);

  return (
    <div className="col-span-3 space-y-6">
      <h2 className="text-2xl">Request to book</h2>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle>Person {index + 1} Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`users.${index}.name`}
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
                    control={form.control}
                    name={`users.${index}.gender`}
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
                    control={form.control}
                    name={`users.${index}.age`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter age"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`users.${index}.height`}
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
                    control={form.control}
                    name={`users.${index}.weight`}
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
                    control={form.control}
                    name={`users.${index}.shoeSize`}
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
        </form>
      </Form>
    </div>
  );
};

export default CheckoutUserDetails;
