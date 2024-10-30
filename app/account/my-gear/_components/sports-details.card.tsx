import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  SkillLevelSchema,
  SkiStyleSchema,
  SnowboardStyleSchema,
} from "@/lib/recommendation.utils";
import clsx from "clsx";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { updateUserSportsDetails } from "../_actions/mygear.actions";
import { SportsDetailsSchema } from "../page";

type Props = {
  sportsDetails: SportsDetailsSchema | undefined;
  setSportsDetails: (sportsDetails: SportsDetailsSchema) => void;
};

const EditButton = ({
  isEditActive,
  callback,
}: {
  isEditActive: boolean;
  callback: () => void;
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={clsx(isEditActive && "border border-primary bg-primary/10")}
      onClick={callback}
    >
      <BiEdit />
    </Button>
  );
};

const SportsDetailsCard = ({ sportsDetails, setSportsDetails }: Props) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});

  const handleSportsUpdate = async (
    sport: keyof SportsDetailsSchema,
    data: any,
  ) => {
    const updatedSportsDetails = {
      ...sportsDetails,
      [sport]: data,
    };

    setSportsDetails(updatedSportsDetails);

    if (!user) return;
    await updateUserSportsDetails(updatedSportsDetails, user.user_id);

    toast({
      title: "Sports details updated",
      description: "Your sports details have been updated",
    });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">My Gears</h2>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="snowboards">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="snowboards">Snowboards</TabsTrigger>
            <TabsTrigger value="surfboards">Surfboards</TabsTrigger>
            <TabsTrigger value="skis">Skis</TabsTrigger>
            <TabsTrigger value="paddleboards">Paddleboards</TabsTrigger>
            <TabsTrigger value="camping">Camping</TabsTrigger>
          </TabsList>
          <TabsContent value="snowboards">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Snowboarding Preferences
                </h3>
                <EditButton
                  isEditActive={isEditing.snowboarding}
                  callback={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      snowboarding: !prev.snowboarding,
                    }))
                  }
                />
              </div>
              {isEditing.snowboarding || !sportsDetails?.snowboarding ? (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Riding Style</label>
                    <Select
                      defaultValue={sportsDetails?.snowboarding?.ridingStyle}
                      onValueChange={(value) =>
                        handleSportsUpdate("snowboarding", {
                          ...sportsDetails?.snowboarding,
                          ridingStyle: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SnowboardStyleSchema.enum).map(
                          (style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Skill Level</label>
                    <Select
                      defaultValue={sportsDetails?.snowboarding?.skillLevel}
                      onValueChange={(value) =>
                        handleSportsUpdate("snowboarding", {
                          ...sportsDetails?.snowboarding,
                          skillLevel: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SkillLevelSchema.enum).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    Riding style:{" "}
                    <span className="font-bold capitalize">
                      {sportsDetails.snowboarding.ridingStyle}
                    </span>
                  </p>
                  <p>
                    Skill level:{" "}
                    <span className="font-bold capitalize">
                      {sportsDetails.snowboarding.skillLevel}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="surfboards">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Surfing Preferences</h3>
                <EditButton
                  isEditActive={isEditing.surfing}
                  callback={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      surfing: !prev.surfing,
                    }))
                  }
                />
              </div>
              {isEditing.surfing || !sportsDetails?.surfing ? (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Skill Level</label>
                    <Select
                      defaultValue={sportsDetails?.surfing?.skillLevel}
                      onValueChange={(value) =>
                        handleSportsUpdate("surfing", {
                          skillLevel: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SkillLevelSchema.enum).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    Skill level:{" "}
                    <span className="font-bold capitalize">
                      {sportsDetails.surfing.skillLevel}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="skis">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Skiing Preferences</h3>
                <EditButton
                  isEditActive={isEditing.skiing}
                  callback={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      skiing: !prev.skiing,
                    }))
                  }
                />
              </div>
              {isEditing.skiing || !sportsDetails?.skiing ? (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Riding Style</label>
                    <Select
                      defaultValue={sportsDetails?.skiing?.ridingStyle}
                      onValueChange={(value) =>
                        handleSportsUpdate("skiing", {
                          ...sportsDetails?.skiing,
                          ridingStyle: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SkiStyleSchema.enum).map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Skill Level</label>
                    <Select
                      defaultValue={sportsDetails?.skiing?.skillLevel}
                      onValueChange={(value) =>
                        handleSportsUpdate("skiing", {
                          ...sportsDetails?.skiing,
                          skillLevel: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SkillLevelSchema.enum).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    Riding style:{" "}
                    <span className="font-bold capitalize">
                      {sportsDetails.skiing.ridingStyle}
                    </span>
                  </p>
                  <p>
                    Skill level:{" "}
                    <span className="font-bold capitalize">
                      {sportsDetails.skiing.skillLevel}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="paddleboards">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Paddleboarding Preferences
                </h3>
                <EditButton
                  isEditActive={isEditing.paddleboarding}
                  callback={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      paddleboarding: !prev.paddleboarding,
                    }))
                  }
                />
              </div>
              {isEditing.paddleboarding || !sportsDetails?.paddleboarding ? (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Skill Level</label>
                    <Select
                      defaultValue={sportsDetails?.paddleboarding?.skillLevel}
                      onValueChange={(value) =>
                        handleSportsUpdate("paddleboarding", {
                          skillLevel: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SkillLevelSchema.enum).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    Skill level:{" "}
                    <span className="font-bold capitalize">
                      {sportsDetails.paddleboarding.skillLevel}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="camping">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Camping Preferences</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      camping: !prev.camping,
                    }))
                  }
                >
                  <BiEdit />
                </Button>
              </div>
              {isEditing.camping || !sportsDetails?.camping ? (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Skill Level</label>
                    <Select
                      defaultValue={sportsDetails?.camping?.skillLevel}
                      onValueChange={(value) =>
                        handleSportsUpdate("camping", {
                          skillLevel: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SkillLevelSchema.enum).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    Skill level:{" "}
                    <span className="font-bold capitalize">
                      {sportsDetails.camping.skillLevel}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SportsDetailsCard;
