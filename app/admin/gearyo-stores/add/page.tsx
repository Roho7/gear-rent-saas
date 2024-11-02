"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import CountryCombobox from "@/app/(business)/business/_components/country.combobox";
import BackButton from "@/app/_components/_shared/back-button";
import { useAuth } from "@/app/_providers/useAuth";
import { createClientComponentClient } from "@/app/_utils/supabase";
import { RegisterShopFormSchema } from "@/src/entities/models/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { useAdmin } from "../../_providers/useAdmin";

const RegisterGearyoStore = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const { gearyoStores, refreshGearyoStores } = useAdmin();

  const form = useForm<z.infer<typeof RegisterShopFormSchema>>({
    resolver: zodResolver(RegisterShopFormSchema),
  });

  async function onSubmit(data: z.infer<typeof RegisterShopFormSchema>) {
    try {
      const supabase = createClientComponentClient();
      const store_id = params.get("store_id") || v4();
      const formattedData = {
        ...data,
        store_id,
        user_id: user?.user_id,
        business_number: `${data.country_code}${data.business_number}`,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
      };
      const { country_code, ...insertedData } = formattedData;

      const { data: insertData, error } = await supabase
        .from("tbl_gearyo_stores")
        .upsert(insertedData);

      toast({
        title: "New Gearyo Store Added",
        description: <p>Your store has been added.</p>,
      });
      await refreshGearyoStores();
    } catch (error) {
      console.error("Error inserting data:", error);
      toast({
        title: "Error submitting form",
      });
      return;
    } finally {
      router.back();
    }
  }

  const storeId = params.get("store_id");

  useEffect(() => {
    if (storeId) {
      const store = gearyoStores?.find((store) => store.store_id === storeId);

      if (store) {
        form.reset({
          store_name: store.store_name || "",
          country_code: store.business_number?.slice(0, 2) || "",
          business_number: store.business_number?.slice(2) || "",
          business_email: store.business_email || "",
          address_line1: store.address_line1 || "",
          address_line2: store.address_line2 || "",
          city: store.city || "",
          country: store.country || "",
          postcode: store.postcode || "",
          latitude: store.latitude?.toString() || "",
          longitude: store.longitude?.toString() || "",
        });
      }
    }
  }, [storeId]);

  return (
    <section className="flex flex-col items-center gap-4 text-gray-700 my-8 h-[calc(100vh-100px)]">
      <Card className="p-4">
        <CardHeader>
          <BackButton />
          <CardTitle className="text-2xl">
            {storeId ? "Edit Gearyo Store" : "Add a Gearyo Store"}
          </CardTitle>
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
              <div className="flex gap-2 flex-1">
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Longitude</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter longitude" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Longitude</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your postcode" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-700" />
                    </FormItem>
                  )}
                />
              </div>

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

export default RegisterGearyoStore;
