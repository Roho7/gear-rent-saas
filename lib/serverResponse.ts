import { GearyoServerActionResponse } from "@/src/entities/models/types";

export function createServerResponse<T>(
  { success, message, data }: { success: boolean; message: string; data?: T },
): GearyoServerActionResponse<T> {
  return { success, message, data };
}
