import { useAuth } from "@/app/_providers/useAuth";
import { createClientComponentClient } from "@/app/_utils/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "@/components/ui/use-toast";

import { RegisterShopFormSchema } from "@/src/entities/models/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useInventory } from "../../_providers/useInventory";

export function EditStoreModal({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth();
  const { storeDetails } = useInventory();
  const form = useForm<z.infer<typeof RegisterShopFormSchema>>({
    resolver: zodResolver(RegisterShopFormSchema),
  });

  async function onSubmit(data: z.infer<typeof RegisterShopFormSchema>) {
    try {
      const supabase = createClientComponentClient();
      const formattedData = {
        ...data,
        store_id: user?.store_id,
        user_id: user?.user_id,
        business_number: `${data.country_code}${data.business_number}`,
      };
      const { country_code, ...insertedData } = formattedData;

      const { data: insertData, error } = await supabase
        .from("tbl_stores")
        .upsert(insertedData);

      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Error inserting data:", error);
      toast({
        title: "Error submitting form",
      });
      return;
    } finally {
      refreshUser();
    }
  }

  useEffect(() => {
    form.reset({
      store_name: storeDetails?.store_name,
      country_code: storeDetails?.business_number?.slice(0, 2),
      business_number: storeDetails?.business_number?.slice(2),
      business_email: storeDetails?.business_email || "",
      address_line1: storeDetails?.address_line1 || "",
      address_line2: storeDetails?.address_line2 || "",
      city: storeDetails?.city || "",
      country: storeDetails?.country || "",
      postcode: storeDetails?.postcode || "",
    });
  }, [storeDetails]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg ">
        <DialogHeader>
          <DialogTitle>Edit Store Details</DialogTitle>
          <DialogDescription>Update your store details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6 max-h-[70vh] overflow-y-scroll px-4 w-full">
            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="country_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Country Code
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="44">UK +44</SelectItem>
                          <SelectItem value="33">AU +33</SelectItem>
                          <SelectItem value="91">IN +91</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>e.g., +91, +44, +33.</FormDescription>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">
                      Business Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your business contact number.
                    </FormDescription>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="business_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Business Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your business email address.
                  </FormDescription>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your country" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Address Line 1
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Street Address" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your business&apos;s physical address.
                  </FormDescription>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Address Line 2
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street No., building no. etc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">City/Town</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Postcode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your postcode" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />

            <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
