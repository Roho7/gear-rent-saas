import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { StoreType } from "@/packages/types";
import { FaAddressCard, FaStar } from "react-icons/fa";
import { MdCall } from "react-icons/md";

const StoreCard = ({ store }: { store: StoreType }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl">{store.store_name}</h2>
      </CardHeader>
      <CardContent className="flex gap-2">
        <div className="object-cover overflow-hidden rounded-md h-40 w-40">
          <img
            src={store.store_img || ""}
            alt={store.store_name}
            className="w-full h-full"
          />
        </div>
        <ul className="">
          <li className="text-gray-400">{store.description}</li>
          <li className="flex items-center gap-1">
            <MdCall />
            {/* {store.contact} */}
          </li>
          <li className="flex items-center gap-1">
            <FaAddressCard />
            <span>
              {store.address_line1}, {store.address_line2}
            </span>
            <span>
              {store.city}, {store.postcode}
            </span>
            <p>{store.country}</p>
          </li>
          <li>{store.closing_time}</li>
          <li className="flex items-center gap-1">
            <FaStar />
            {store.google_rating}
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <a href={store.google_link || ""} className="ml-auto">
          Google maps
        </a>
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
