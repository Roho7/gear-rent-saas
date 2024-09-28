"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";

const ContactUs = () => {
  return (
    <Card className="w-full max-w-md mx-auto my-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Contact Us
        </CardTitle>
        <CardDescription className="text-center">
          We are here to help with any questions or concerns.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <a
          href="mailto:alex@gearyo.com"
          className="bg-muted/10 p-2 rounded-md flex gap-1 items-center"
        >
          <EnvelopeOpenIcon className="mr-2 h-5 w-5" />
          Email Support
        </a>
      </CardContent>
    </Card>
  );
};

export default ContactUs;
