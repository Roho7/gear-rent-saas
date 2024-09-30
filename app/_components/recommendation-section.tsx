import { Card, CardContent } from "@/components/ui/card";
import { SnowboardRecommendationType } from "@/lib/recommendation.utils";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { FaSkiing, FaSnowboarding } from "react-icons/fa";
import { FaTent } from "react-icons/fa6";
import GearRecommendationForm from "./recommendation-card";

const ScrollingIcons = () => {
  return (
    <div className="w-24 overflow-hidden flex whitespace-nowrap">
      {/* <p className="text-lg mb-4 text-muted">
          Fill up the details to get your perfect gear
        </p> */}

      <div className="px-4 flex items-center gap-8 animate-scroll text-4xl text-muted whitespace-nowrap ">
        <FaSkiing className="" />
        <FaSnowboarding className="" />
        <FaTent className="" />
      </div>
      <div className="px-4 flex items-center gap-8 animate-scroll text-4xl text-muted whitespace-nowrap">
        <FaSkiing className="" />
        <FaSnowboarding className="" />
        <FaTent className="" />
      </div>
    </div>
  );
};

const RecommendationSection = () => {
  const [snowboardRecommendation, setSnowboardRecommendation] =
    React.useState<SnowboardRecommendationType | null>(null);
  return (
    <div className="flex gap-2 ">
      <div className="flex-1">
        <GearRecommendationForm
          setSnowboardRecommendation={setSnowboardRecommendation}
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-lg max-h-lg shadow-xl relative">
          <CardContent className="pt-4">
            {snowboardRecommendation ? (
              <div className="flex flex-col gap-2">
                <FaSnowboarding className="text-2xl text-muted mx-auto" />
                <h2 className="text-muted text-xl">Recommended Snowboard</h2>
                <div
                  className="flex flex-col text-primary
"
                >
                  <p className="flex justify-between items-center">
                    Length:{" "}
                    <span className="text-2xl font-bold">
                      {snowboardRecommendation?.length} cm
                    </span>
                  </p>
                  <p className="flex justify-between items-center">
                    Style:{" "}
                    <span className="text-2xl font-bold capitalize">
                      {snowboardRecommendation?.style}
                    </span>
                  </p>
                  <p className="flex justify-between items-center">
                    Flexibility:{" "}
                    <span className="text-2xl font-bold capitalize">
                      {snowboardRecommendation?.flexibility}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-muted text-xl flex gap-2 items-center">
                  <ArrowLeft /> Find the perfect gear
                </p>
                <div className="relative w-fit">
                  <div className="w-4 bg-gradient-to-r from-background to-transparent h-[40px] absolute inset-0 z-10"></div>
                  <ScrollingIcons />
                  <div className="w-4 bg-gradient-to-r from-transparent to-background h-[40px] absolute right-0 top-0 z-10"></div>
                </div>
              </div>
            )}
          </CardContent>
          {snowboardRecommendation && (
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-sky-600 rounded-lg blur transition -z-10 animate-pulse"></div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RecommendationSection;
