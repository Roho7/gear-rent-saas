import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaArrowRight } from "react-icons/fa";
import CTA from "./CTA";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VenueCard from "./venue-card";

type Props = {};

const Hero = (props: Props) => {
  const router = useRouter();
  return (
    <section className="rounded-lg h-[80vh]">
      <div className="grid grid-cols-3 gap-2 grid-rows-2 items-center h-full relative">
        <div className="text-white col-span-2 bg-ski rounded-lg bg-cover p-4 h-full relative row-span-2">
          <h1 className="text-[100px]  text-white">Gear Town</h1>
          <p>An open marketplace to rent adventure gear</p>
          <CTA
            callback={() => router.replace("/store")}
            classNames="absolute right-8 bottom-8">
            Explore <FaArrowRight />
          </CTA>
        </div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Where are you going?</CardTitle>
            <CardDescription>
              Pre book your gear for your next adventure
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <VenueCard
              link="https://frenchmoments.eu/wp-content/uploads/2012/11/Chamonix-Mont-Blanc-Featured-Image-web-copyright-French-Moments.jpg"
              title="Chamonix"
            />
            <VenueCard
              link="https://www.alpineanswers.co.uk/media/W1siZiIsIjIwMTUvMTEvMjUvM3N1OGM2NmVxdl9DaGFsZXRzX2luX1N0X0FudG9uLmpwZyJdXQ/67b817c0b9f6da7b/Chalets_in_St_Anton.jpg"
              title="St. Anton"
            />
            <VenueCard
              link="https://images.contentstack.io/v3/assets/blt00454ccee8f8fe6b/blt83c35dc643c50768/609132eef07013101daf2908/UK_Tignes_FR_Header.jpg"
              title="Tignes"
            />
          </CardContent>
        </Card>
        <Card className="h-full ">
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
            <Button onClick={() => router.replace("/store")}>Search</Button>
          </CardFooter>
        </Card>
      </div>
      {/* <div className="bg-ski w-full h-screen absolute top-0 -z-10"></div> */}
    </section>
  );
};

export default Hero;
