import { usePathname, useSearchParams } from "next/navigation";

export function useFullPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullPath =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  return fullPath;
}
