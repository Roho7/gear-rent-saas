import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function GearyoBreadcrumb() {
  const pathName = usePathname();
  const paths = pathName.split("/").map((item, index) => {
    if (item === "") {
      return null;
    }
    return item;
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          return (
            <>
              <BreadcrumbItem key={index} className="capitalize">
                <BreadcrumbLink href={`/${path}`}>{path}</BreadcrumbLink>
              </BreadcrumbItem>
              {index > 0 && index !== paths.length - 1 && (
                <BreadcrumbSeparator />
              )}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
