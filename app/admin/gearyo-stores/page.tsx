"use client";
import StoreRow from "@/app/(public)/(store)/store/_components/store.row";
import Spinner from "@/app/_components/_shared/spinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAdmin } from "../_providers/useAdmin";

const GearyoStoresPage = () => {
  const { gearyoStores, isLoading } = useAdmin();
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 ">
      <Button
        size="sm"
        onClick={() => router.push("/admin/gearyo-stores/add")}
        className="ml-auto"
      >
        Add Gearyo Store
      </Button>
      {isLoading ? (
        <Spinner />
      ) : gearyoStores?.length ? (
        gearyoStores?.map((store) => {
          return (
            <StoreRow
              key={store.store_id}
              store={store}
              callback={() => {
                router.push(`/admin/gearyo-stores/${store.store_id}`);
              }}
            />
          );
        })
      ) : (
        <div className="text-muted justify-center bg-muted/10 h-full flex items-center rounded-md">
          Coming soon for this location
        </div>
      )}
    </main>
  );
};

export default GearyoStoresPage;
