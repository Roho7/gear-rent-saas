import { toast } from "@/components/ui/use-toast";
import * as Sentry from "@sentry/nextjs";

export function handleError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  Sentry.captureException(error, { tags: { context } });

  const errorMessage = error instanceof Error
    ? error.message
    : "An unexpected error occurred";

  toast({
    title: `Error in ${context}`,
    description: errorMessage,
    variant: "destructive",
  });
}
