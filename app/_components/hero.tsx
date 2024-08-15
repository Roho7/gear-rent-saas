import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

import React from "react";

type Props = {};

const Hero = (props: Props) => {
  const router = useRouter();
  return (
    <section>
      <div className="p-4 px-16 flex justify-between items-center h-screen bg-opacity-15 relative">
        <div className="text-white">
          <h1 className="text-5xl font-bold text-white glass p-2">Gear Town</h1>
          <h2>Adventure freely</h2>
          <p>An open marketplace to rent adventure gear</p>
        </div>
        <Card className="w-[350px] ">
          <CardHeader>
            <CardTitle>Book your gear</CardTitle>
            <CardDescription>
              Book equipment for your upcoming adventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Type of gear</Label>
                  <Input id="name" placeholder="Type of gear" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Experience Level</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Beginner</SelectItem>
                      <SelectItem value="nuxt">Intermediate</SelectItem>
                      <SelectItem value="sveltekit">Advanced</SelectItem>
                      <SelectItem value="astro">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {/* <Button variant="outline">Cancel</Button> */}
            <Button onClick={() => router.replace("/store")}>Search</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="bg-ski w-full h-screen absolute top-0 -z-10"></div>
    </section>
  );
};

export default Hero;
