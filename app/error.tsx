"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen gap-6">
      <h1 className="text-2xl font-bold text-muted">Something went wrong</h1>
      <Button onClick={reset} size={"sm"}>
        Refresh
      </Button>
      <div className="flex flex-col gap-2 items-center">
        <p className="text-muted-foreground p-2 bg-muted rounded-md min-w-32 text-center">
          {error.message}
        </p>
        <p className="text-muted-foreground p-2 bg-muted/20 rounded-md min-w-32 text-center max-w-[50vw] max-h-[20vh] overflow-y-scroll">
          {error.stack}
        </p>
      </div>
    </main>
  );
}
