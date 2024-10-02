import { Card, CardContent } from "@/components/ui/card";
import { SnowboardRecommendationType } from "@/lib/recommendation.utils";
import { FaSnowboarding } from "react-icons/fa";

type Props = {
  snowboardRecommendation: SnowboardRecommendationType;
};

const SnowboardRecommendationResult = ({ snowboardRecommendation }: Props) => {
  return (
    <div className="flex-1 flex items-center justify-center mt-4 w-full">
      <Card className="max-w-xl max-h-lg shadow-xl relative">
        <CardContent className="pt-4">
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
                  {snowboardRecommendation?.lengthRange.min} cm
                  {snowboardRecommendation.lengthRange.max !== Infinity
                    ? snowboardRecommendation.lengthRange.max ===
                      snowboardRecommendation.lengthRange.min
                      ? ""
                      : `- ${snowboardRecommendation.lengthRange.max} cm`
                    : "+"}
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
        </CardContent>
        {snowboardRecommendation && (
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-sky-600 rounded-lg blur transition -z-10 animate-pulse"></div>
        )}
      </Card>
    </div>
  );
};

export default SnowboardRecommendationResult;
