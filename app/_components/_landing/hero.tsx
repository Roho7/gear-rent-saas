import clsx from "clsx";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import CTA from "../CTA";
import GearRecommendationCard from "../recommendation-card";

type Props = {};

const Hero = (props: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <section className="rounded-lg h-[80vh]">
      <div className="gap-2 items-center h-full relative flex w-full">
        <div
          className={clsx(
            "text-white rounded-lg bg-cover p-4 h-full relative flex w-full justify-between items-center",
            theme === "dark" ? "bg-summer" : "bg-ski",
          )}
        >
          <div className="flex flex-col gap-1 z-10">
            <img src="/logo-white-large.svg" alt="" width={500} />
            <p>An Open marketplace for renting adventure gera</p>
            <CTA
              callback={() => {
                document.getElementById("main-search-location-input")?.click();
              }}
              classNames="w-fit text-background my-2"
            >
              Explore <FaArrowRight />
            </CTA>
          </div>
          <GearRecommendationCard />
          <div className="absolute bg-gradient-to-r from-black/20 to-transparent inset-0 w-full h-full rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
