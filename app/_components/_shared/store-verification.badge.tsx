import { Badge } from "@/components/ui/badge";

const StoreVerificationBadge = ({ isVerified }: { isVerified: boolean }) => {
  return (
    <Badge
      variant={"outline"}
      className={`${isVerified ? "text-green-700 bg-green-500/10" : "text-yellow-700 bg-yellow-500/10"}`}
    >
      {isVerified ? "Verified" : "Awaiting Verification"}
    </Badge>
  );
};

export default StoreVerificationBadge;
