"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  business_name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  country_code: z.string().min(2, {
    message: "Country code must be at least 2 characters.",
  }),
  business_number: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  business_email: z.string().email({
    message: "Please enter a valid email.",
  }),
  business_address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
});

const RegisterBusinessPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      business_name: "",
      country_code: "",
      business_number: "",
      business_email: "",
      business_address: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <section className="flex flex-col items-center gap-4">
      <h1 className="text-xl p-4 ">Register your store</h1>

      <Card className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="country_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                      <Select>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your business contact number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="business_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your business email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business address" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your business's physical address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
          control={form.control}
          name="business_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a brief description of your business"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short description of your business and its services.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default RegisterBusinessPage;
