"use client";
import { useAuth } from "@/app/_providers/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {};

const LoginPage = (props: Props) => {
  const { handleSignUpWithEmail, handleLogout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  if (localStorage.getItem("user")) {
    router.push("/");
  }
  return (
    <main className="w-full h-[70vh] flex flex-col gap-8 justify-center items-center">
      <img src="/logo-black.svg" alt="" />
      <Card className="w-[20vw]">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="w-full"
            onClick={() => handleSignUpWithEmail(email, password)}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
      <a href="/login">Already have an account?</a>
      <Button variant="ghost" onClick={() => handleLogout()}>
        Logout
      </Button>
    </main>
  );
};

export default LoginPage;
