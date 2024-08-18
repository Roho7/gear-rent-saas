import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {};

const AdCard = (props: Props) => {
  return (
    <Card className="bg-slate-700 flex w-full h-[70vh] bg-snowski bg-cover">
      <div className="flex flex-col p-8">
        <h1 className="text-[100px] text-slate-500 ">
          Rent what's best for you
        </h1>
        <Button className="max-w-fit">See Our Guides</Button>
      </div>
      <div className="p-8 w-full h-full">
        <Card className="w-full h-full overflow-hidden glass"></Card>
      </div>
    </Card>
  );
};

export default AdCard;
