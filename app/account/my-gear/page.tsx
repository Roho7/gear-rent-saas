"use client";

import BackButton from "@/app/_components/_shared/back-button";
import { useAuth } from "@/app/_providers/useAuth";

import {
  SkillLevelSchema,
  SkiStyleSchema,
  SnowboardStyleSchema,
} from "@/lib/recommendation.utils";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  getUserDetails,
  getUserSportsDetails,
} from "./_actions/mygear.actions";
import { UserDetailsSchema } from "./_components/edit-user-details.modal";
import SportsDetailsCard from "./_components/sports-details.card";
import UserDetailsCard from "./_components/user-details.card";

export type SportsDetailsSchema = {
  snowboarding?: {
    skillLevel: z.infer<typeof SkillLevelSchema>;
    ridingStyle: z.infer<typeof SnowboardStyleSchema>;
  };
  surfing?: {
    skillLevel: z.infer<typeof SkillLevelSchema>;
  };
  camping?: {
    skillLevel: z.infer<typeof SkillLevelSchema>;
  };
  skiing?: {
    skillLevel: z.infer<typeof SkillLevelSchema>;
    ridingStyle: z.infer<typeof SkiStyleSchema>;
  };
  paddleboarding?: {
    skillLevel: z.infer<typeof SkillLevelSchema>;
  };
};

const MyGearPage = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetailsSchema>();
  const [sportsDetails, setSportsDetails] = useState<SportsDetailsSchema>();

  useEffect(() => {
    getUserDetails().then((data) => {
      setUserDetails(data as UserDetailsSchema);
    });
    getUserSportsDetails().then((data) => {
      setSportsDetails(data as SportsDetailsSchema);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-4 flex-1 px-2 sm:px-6 md:px-8 max-w-4xl mx-auto w-full">
      <BackButton />
      <UserDetailsCard
        userDetails={userDetails}
        setUserDetails={setUserDetails}
      />
      <SportsDetailsCard
        sportsDetails={sportsDetails}
        setSportsDetails={setSportsDetails}
      />
    </div>
  );
};

export default MyGearPage;
