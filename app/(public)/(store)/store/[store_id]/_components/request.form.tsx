import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendEmail } from "../_actions/send-email.action";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  gearType: z.string().min(2, "Please specify the type of gear"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

const RequestForm = ({ storeName, storeId }: { storeName: string, storeId: string }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      gearType: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Ensure we're passing a plain object with primitive values
      const emailData = {
        ...values,
        storeName: String(storeName),
        storeId: String(storeId),
      };
      
      const { data, success } = await sendEmail(emailData);
      if (success) {
        toast({
          title: "Email sent successfully",
          description: "We've received your request and will get back to you soon.",
        });
        router.back();
      } else {
        toast({
          title: "Error submitting form",
          description: "An error occurred, please try again.",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Request Gear</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="POST"
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gearType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Gear</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What gear are you looking for?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Request</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RequestForm;
