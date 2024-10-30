import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@radix-ui/react-label";

import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateUserDetails } from "../_actions/mygear.actions";

const userDetailsSchema = z.object({
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  age: z.string().min(1, "Age is required"),
  sex: z.enum(["male", "female", "other"], {
    required_error: "Please select a sex",
  }),
});

export type UserDetailsSchema = z.infer<typeof userDetailsSchema>;

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userDetails: UserDetailsSchema | undefined;
  setUserDetails: (userDetails: UserDetailsSchema) => void;
  children: React.ReactNode;
};

const EditUserDetailsModal = ({
  isOpen,
  setIsOpen,
  userDetails,
  setUserDetails,
  children,
}: Props) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserDetailsSchema>({
    resolver: zodResolver(userDetailsSchema),
    values: userDetails,
  });

  const onSubmit = async (data: UserDetailsSchema) => {
    setUserDetails(data);
    if (!user) {
      toast({
        variant: "destructive",
        title: "User not found",
        description: "Please login to update your details",
      });
      return;
    }
    await updateUserDetails(data, user.user_id);
    toast({
      title: "User details updated",
      description: "Your user details have been updated",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" type="number" {...register("height")} />
            {errors.height && (
              <p className="text-sm text-red-500">{errors.height.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" type="number" {...register("weight")} />
            {errors.weight && (
              <p className="text-sm text-red-500">{errors.weight.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" {...register("age")} />
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select
              value={userDetails?.sex}
              onValueChange={(value) =>
                setValue("sex", value as "male" | "female" | "other")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.sex && (
              <p className="text-sm text-red-500">{errors.sex.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDetailsModal;
