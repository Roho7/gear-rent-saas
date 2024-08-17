import { Card } from "@/components/ui/card";
import clsx from "clsx";
import { MdArrowOutward } from "react-icons/md";
import CTA from "./CTA";

type Props = {
  link: string;
  title: string;
};

const VenueCard = ({ link, title }: Props) => {
  return (
    <Card
      className={clsx(
        "relative flex-1 overflow-hidden p-4 flex flex-col group",
      )}>
      <h2 className="text-white text-5xl bold z-20 break-words ">{title}</h2>
      <div className="absolute inset-0 ">
        <img
          className=" w-full h-full object-cover group-hover:scale-110 transition-transform"
          src={link}></img>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
      <CTA callback={() => {}} classNames="relative w-fit ml-auto mt-auto ">
        <MdArrowOutward className="shrink-0" />
      </CTA>
    </Card>
  );
};

export default VenueCard;
