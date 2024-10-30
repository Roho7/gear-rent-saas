import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import EditUserDetailsModal, {
  UserDetailsSchema,
} from "./edit-user-details.modal";

type Props = {
  userDetails: UserDetailsSchema | undefined;
  setUserDetails: (userDetails: UserDetailsSchema) => void;
};

const UserDetailsCard = ({ userDetails, setUserDetails }: Props) => {
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-bold">User Details</h2>
        <EditUserDetailsModal
          isOpen={isUserDetailsOpen}
          setIsOpen={setIsUserDetailsOpen}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        >
          <Button variant="outline" size={"icon"}>
            <BiEdit />
          </Button>
        </EditUserDetailsModal>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="text-lg font-medium">
              {userDetails?.height || "-"} cm
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-lg font-medium">
              {userDetails?.weight || "-"} kg
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="text-lg font-medium">
              {userDetails?.age || "-"} years
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sex</p>
            <p className="text-lg font-medium capitalize">
              {userDetails?.sex || "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard;
