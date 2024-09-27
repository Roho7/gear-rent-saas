"use client";
import BackButton from "@/app/_components/_shared/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../_providers/useAuth";
import { createClientComponentClient } from "../../_utils/supabase";

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

  return (
    <div className="min-h-screen flex flex-col gap-2">
      <BackButton />
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Account</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div>
              <p>
                <span className="text-muted">Email:</span> {user?.email}
              </p>
              <p>
                <span className="text-muted">Name:</span> {user?.name}
              </p>
            </div>
            <Image
              src={`https://avatar.iran.liara.run/username?username=${
                user?.name?.split(" ").join("+") || user?.email
              }`}
              height={100}
              width={100}
              alt={user?.email || ""}
            />
          </div>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-fit"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
      {user?.store_id?.length && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Your store</h2>
          </CardHeader>
          <CardContent>
            <span className="text-muted">Store Id:</span>{" "}
            <Badge variant="outline">{user?.store_id}</Badge>
            <p>
              <Link href="/inventory" className="hover:underline text-muted">
                Go to store
              </Link>
            </p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Security</h2>
        </CardHeader>
        <CardContent>
          <div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
