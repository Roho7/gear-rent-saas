import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { StoreType } from "@/src/entities/models/types";

import { FaAddressCard, FaStar } from "react-icons/fa";
import { MdAccessTime, MdCall } from "react-icons/md";

const StoreCard = ({ store }: { store: StoreType }) => {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader>
        <h2 className="text-2xl font-semibold">{store.store_name}</h2>
      </CardHeader>
      <CardContent className="flex gap-6">
        <div className="object-cover overflow-hidden rounded-md h-40 w-40 flex-shrink-0">
          <img
            src={store.store_img || "/store_placeholder_img.png"}
            alt={store.store_name}
            className="w-full h-full object-cover"
          />
        </div>
        <ul className="space-y-3 flex-1">
          <li className="text-muted-foreground text-sm">
            {store.description || "No description available"}
          </li>
          {store.business_number && (
            <li className="flex items-center gap-2 text-sm">
              <MdCall className="text-primary" />
              {store.business_number}
            </li>
          )}
          <li className="flex items-center gap-2 text-sm">
            <FaAddressCard className="text-primary" />
            <div className="flex flex-col">
              <span>
                {store.address_line1}
                {store.address_line2 && `, ${store.address_line2}`}
              </span>
              <span>
                {store.city}
                {store.postcode && `, ${store.postcode}`}
              </span>
              <span>{store.country}</span>
            </div>
          </li>
          {store.closing_time && (
            <li className="flex items-center gap-2 text-sm">
              <MdAccessTime className="text-primary" />
              {store.closing_time}
            </li>
          )}
          {store.google_rating && (
            <li className="flex items-center gap-2 text-sm">
              <FaStar className="text-yellow-400" />
              {store.google_rating} / 5
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        {store.google_place_id && (
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${store.google_place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm text-primary hover:underline"
          >
            View on Google Maps
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
