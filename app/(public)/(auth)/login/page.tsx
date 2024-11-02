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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleLoginWithEmail, handleSignInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const divRef = useRef<HTMLDivElement>(null);

  // Add wrapper for Google sign-in callback
  const handleGoogleSignIn = async (response: any) => {
    await handleSignInWithGoogle(response);
    const returnUrl = searchParams.get("returnUrl") || "/";
    router.push(returnUrl);
  };

  useEffect(() => {
    if (divRef.current) {
      // ONE TAP prompt
      // window.google?.accounts?.id.prompt();
      window.google?.accounts?.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
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
  }, [handleGoogleSignIn]);

  // Add wrapper for email login
  const handleEmailLogin = async () => {
    await handleLoginWithEmail(email, password);
    const returnUrl = searchParams.get("returnUrl") || "/";
    router.push(returnUrl);
  };

  return (
    <main className="w-full h-[70vh] flex flex-col gap-8 justify-center items-center">
      <img src="/logo-black.svg" alt="Logo" />
      <Card className="md:w-[20vw]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <div
            id="google-signin-button"
            ref={divRef}
            className="w-full mb-4"
          ></div>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full" onClick={handleEmailLogin}>
            Login
          </Button>
        </CardFooter>
      </Card>
      <a href="/signup" className="text-muted hover:underline">
        Create an account
      </a>
    </main>
  );
};

export default LoginPage;

declare global {
  interface Window {
    google: any;
  }
}
