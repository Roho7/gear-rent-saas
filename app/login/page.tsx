"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../_providers/useAuth";

type Props = {};

const LoginPage = (props: Props) => {
  const { handleLoginWithEmail, handleSignInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null!);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  if (localStorage.getItem("user")) {
    router.push("/");
  }
  const handleParentClick = () => {
    if (isGoogleLoaded) {
      // Propagate the click event to the child element
      divRef.current.click();
    }
  };

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
        width: 320,
        height: 48,
        logo_alignment: "center",
      });

      setIsGoogleLoaded(true);
    }
  }, [handleSignInWithGoogle]);
  return (
    <main className="w-full h-[70vh] flex flex-col gap-8 justify-center items-center">
      <img src="/logo-black.svg" alt="" />
      <Card className="w-[20vw]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <div
          className={clsx(
            "group relative h-11 w-80 text-white",
            isGoogleLoaded ? "cursor-pointer" : "cursor-wait",
          )}
          onClick={handleParentClick}
        >
          {/* Render google button */}
          <div ref={divRef} />
          {/* Overlay with bg-white */}
        </div>
        <CardContent className="flex flex-col gap-2">
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* <Button variant="outline">Cancel</Button> */}
          <Button
            className="w-full"
            onClick={() => handleLoginWithEmail(email, password)}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
      <a href="/signup">Create an account</a>
    </main>
  );
};

export default LoginPage;

declare global {
  interface Window {
    google: any;
  }
}
