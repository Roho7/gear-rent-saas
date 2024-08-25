import { useRouter } from "next/navigation";
import MainSearchbar from "./hero-searchbar";

type Props = {};

const Hero = (props: Props) => {
  const router = useRouter();
  return (
    <section className="rounded-lg h-[80vh]">
      <div className="gap-2 items-center h-full relative">
        <div className="text-white bg-ski rounded-lg bg-cover p-4 h-full relative flex flex-col justify-between">
          <img src="/logo-white-large.svg" alt="" width={2000} />
          <p className="text-right mt-4">
            An open marketplace to rent adventure gear
          </p>
          <MainSearchbar />
          {/* <CTA
            callback={() => router.replace("/store")}
            classNames="absolute right-8 bottom-8"
          >
            Explore <FaArrowRight />
          </CTA> */}
        </div>
        {/* <Card className="h-full">
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
        </Card> */}
      </div>
      {/* <div className="bg-ski w-full h-screen absolute top-0 -z-10"></div> */}
    </section>
  );
};

export default Hero;
