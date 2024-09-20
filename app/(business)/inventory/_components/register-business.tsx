"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import CountryCombobox from "@/app/(business)/inventory/_components/country.combobox";
import BackButton from "@/app/_components/_shared/back-button";
import { useAuth } from "@/app/_providers/useAuth";
import { createClientComponentClient } from "@/app/_utils/supabase";
import { RegisterShopFormSchema } from "@/src/entities/models/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterBusinessForm = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterShopFormSchema>>({
    resolver: zodResolver(RegisterShopFormSchema),
    defaultValues: {
      store_name: "",
      country_code: "",
      business_number: user?.phone || "",
      business_email: user?.email || "",
      address_line1: "",
      address_line2: "",
      city: "",
      country: "",
      postcode: "",
    },
  });

  async function onSubmit(data: z.infer<typeof RegisterShopFormSchema>) {
    try {
      const supabase = createClientComponentClient();
      const formattedData = {
        ...data,
        user_id: user?.user_id,
        business_number: `${data.country_code}${data.business_number}`,
      };
      const { country_code, ...insertedData } = formattedData;

      const { data: insertData, error } = await supabase
        .from("tbl_stores")
        .insert(insertedData);
      1;

      toast({
        title: "Shop submitted for review",

        description: (
          <p>
            Your shop has been submitted for review. You will be notified once
            your shop is approved.
          </p>
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
      router.refresh();
    }
  }

  return (
    <section className="flex flex-col items-center gap-4 text-gray-700 my-8">
      <Card className="p-4">
        <CardHeader>
          <BackButton />

          <CardTitle className="text-2xl">Register Your Store</CardTitle>
          <CardDescription>
            Register your store to start selling on Gearyo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 min-w-[60vw]"
            >
              <FormField
                control={form.control}
                name="store_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Business Name
                    </FormLabel>
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
                    <FormItem>
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
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-gray-700">Country</FormLabel>
                    <FormControl>
                      <CountryCombobox
                        country={field.value}
                        setCountry={form.setValue.bind(null, "country")}
                      />
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
                      <Input placeholder="Enter your city/town" {...field} />
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

              {/* <FormField
          control={form.control}
          name="business_description"
          render={({ field }) => (
            <FormItem>
              FormLabel className="text-gray-700"Business Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a brief description of your business"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short description of your business and its services.
              </FormDescription>
                                <FormMessage className="text-red-700" />

            </FormItem>
          )}
        /> */}

              <Button type="submit" size={"sm"} className="w-full">
                Create your store
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default RegisterBusinessForm;
