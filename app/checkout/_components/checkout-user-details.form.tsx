import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export const CheckoutUserDetailsFormSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  name: z.string().min(3),
});

const CheckoutUserDetailsForm = ({}: {}) => {
  const { control } = useFormContext();

  return (
    <div className="col-span-3 space-y-6">
      <h2 className="text-2xl">Confirm your details</h2>

      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`userDetails.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`userDetails.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your email address</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`userDetails.phone`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your phone number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="e.g. +441234567890"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutUserDetailsForm;
