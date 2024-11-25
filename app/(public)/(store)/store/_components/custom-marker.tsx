import { AdvancedMarker } from "@vis.gl/react-google-maps";
import classNames from "classnames";
import { FunctionComponent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreType } from "@/src/entities/models/types";
import { StoreIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  store: StoreType;
}

export const CustomMarker: FunctionComponent<Props> = ({ store }) => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const position = {
    lat: store.latitude || 0,
    lng: store.longitude || 0,
  };
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());

    // Construct the new URL
    const newUrl = `/store/${store.store_id}?${currentParams.toString()}`;

    router.push(newUrl);
  };

  const renderCustomPin = () => {
    return (
      <div className="cursor-pointer">
        <div className="overflow-hidden p-2 group flex flex-col items-center">
          {!clicked ? (
            <div className="rounded-full overflow-hidden scale-0 h-20 w-20 group-hover:scale-100 transition-all duration-300 object-cover">
              <Image
                src={store.store_img || ""}
                alt={store.store_name}
                width={150}
                height={150}
              />
            </div>
          ) : (
            <Card className="flex flex-col justify-between">
              <CardHeader className="flex gap-2 flex-col">
                <CardTitle className="flex gap-2 items-center">
                  <div className="rounded-full overflow-hidden h-20 w-20 object-cover shrink-0">
                    <Image
                      src={store.store_img || ""}
                      alt={store.store_name}
                      width={200}
                      height={200}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {store.store_name}{" "}
                    </h3>
                    <p className="text-sm text-gray-500 font-normal">
                      {store.description}
                    </p>
                    <p className="text-sm text-gray-500 font-normal">
                      {store.address_line1} {store.address_line2}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-end">
                <Button size="sm" variant="outline" onClick={handleClick}>
                  View
                </Button>
              </CardFooter>
            </Card>
          )}

          <span
            className="bg-white rounded-full p-2"
            onClick={() => setClicked(!clicked)}
          >
            <StoreIcon />
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <AdvancedMarker
        position={position}
        title={store.store_name}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={classNames("real-estate-marker", { clicked, hovered })}
        onClick={() => setClicked(!clicked)}
      >
        {renderCustomPin()}
      </AdvancedMarker>
    </>
  );
};
