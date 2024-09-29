"use client";
import { useAuth } from "@/app/_providers/useAuth";
import { useFullPath } from "@/app/_utils/useFullPath";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef } from "react";

export function LoginModal() {
  const {
    handleSignInWithGoogle,
    handleLoginWithEmail,
    isLoginModalOpen,
    setIsLoginModalOpen,
  } = useAuth();
  const pathname = useFullPath();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (isLoginModalOpen) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isLoginModalOpen]);

  const initializeGoogleSignIn = () => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) {
            handleSignInWithGoogle(
              { credential: response.credential },
              pathname,
            );
            setIsLoginModalOpen(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
      });
    }
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogContent className="md:max-w-[400px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>Login to Gearyo</DialogTitle>
        </DialogHeader>
        <div ref={googleButtonRef} className="w-full mb-4"></div>
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
        <Button
          className="w-full"
          onClick={() => {
            handleLoginWithEmail(email, password, pathname);
            setIsLoginModalOpen(false);
          }}
        >
          Login
        </Button>

        <a href="/signup">Create an account</a>
      </DialogContent>
    </Dialog>
  );
}
