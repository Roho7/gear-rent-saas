import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";

type Props = {};

const UserButton = (props: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    // Initial load
    handleStorageChange();

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full relative"
          onClick={() => router.replace("/account")}
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
