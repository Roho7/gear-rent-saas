"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import { redirect } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../_providers/useAuth";
import { createClientComponentClient } from "../_utils/supabase";

type Props = {};

const UserPage = (props: Props) => {
  const { handleLogout, user } = useAuth();
  const [password, setPassword] = useState("");

  const handleResetPassword = async () => {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error || !data) {
      toast({ title: "Error updating password" });
    }

    toast({ title: "Password updated" });
  };

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <h1>Account</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div>
            <h2 className="font-semibold">Account information</h2>

            <p>Email: {user?.email}</p>
            <p>Name: {user?.name}</p>
            <p>Store: {user?.store_id}</p>
          </div>
          <div>
            <h2 className="font-semibold">Reset Password</h2>
            <div className="flex gap-1">
              <div>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <p className="text-gray-400 text-xs">
                  Password should be at least 5 characters long
                </p>
              </div>
              <Button
                onClick={handleResetPassword}
                disabled={password.length < 5}
              >
                Reset Password
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
