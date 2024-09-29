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
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { handleLoginWithEmail, handleSignInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Ensure Google API is loaded
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleSignInWithGoogle,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
        },
      );
    };
    document.body.appendChild(script);
  }, []);

  return (
    <main className="w-full h-[70vh] flex flex-col gap-8 justify-center items-center">
      <img src="/logo-black.svg" alt="Logo" />
      <Card className="w-[20vw]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <div id="google-signin-button" className="w-full mb-4"></div>
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
