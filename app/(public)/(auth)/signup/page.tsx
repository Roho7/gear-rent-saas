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
import { useEffect, useRef, useState } from "react";

type Props = {};

const LoginPage = (props: Props) => {
  const { handleSignUpWithEmail, handleSignInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      // ONE TAP prompt
      // window.google?.accounts?.id.prompt();
      window.google?.accounts?.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleSignInWithGoogle,
        context: "signin",
        ux_mode: "popup",
        itp_support: true,
      });
      window.google?.accounts?.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        text: "continue_with",
        shape: "square",
        width: "100%",
        height: 48,
        logo_alignment: "center",
      });
    }
  }, [handleSignInWithGoogle]);
  if (localStorage.getItem("user")) {
    router.push("/");
  }
  return (
    <main className="w-full h-[70vh] flex flex-col gap-8 justify-center items-center">
      <img src="/logo-black.svg" alt="" />
      <Card className="md:w-[20vw]">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div
            id="google-signin-button"
            ref={divRef}
            className="w-full mb-4"
          ></div>
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
      <a href="/login" className="text-muted hover:underline">
        Already have an account?
      </a>
    </main>
  );
};

export default LoginPage;
