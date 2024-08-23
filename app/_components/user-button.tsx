import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
import { BiUser } from "react-icons/bi";
import { useAuth } from "../_providers/useAuth";

type Props = {};

const UserButton = (props: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full relative"
          onClick={() => router.replace("/login")}
        >
          <BiUser />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 overflow-hidden">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex gap-1 items-center">
              <BiUser /> Your account
            </h4>
            <p className="text-sm">Logged in as:</p>
            <p className="text-sm">{user?.email}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserButton;
