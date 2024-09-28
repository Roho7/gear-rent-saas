import Link from "next/link";
import { BiMapPin } from "react-icons/bi";

type Props = {
  store_name: string;
  locationString: string;
};

const MiniStoreCard = ({ store_name, locationString }: Props) => {
  return (
    <div className="text-muted text-xs bg-muted/10 p-2 min-w-40 w-fit rounded-md">
      <div className="flex justify-between items-center mb-1">
        <p>From</p>
      </div>
      <Link
        href="/sellers"
        className="text-primary font-medium text-sm hover:underline"
      >
        {store_name}{" "}
      </Link>
      <div className="flex items-center gap-2">
        <BiMapPin />
        <span>{locationString}</span>
      </div>
    </div>
  );
};

export default MiniStoreCard;
