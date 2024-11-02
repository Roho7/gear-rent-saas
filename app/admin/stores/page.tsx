"use client";
import StoreRow from "@/app/(public)/(store)/store/_components/store.row";
import { useProducts } from "@/app/_providers/useProducts";
import { useRouter } from "next/navigation";

const AdminStoresPage = () => {
  const { allStores } = useProducts();
  const router = useRouter();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex flex-col gap-4 overflow-y-scroll">
        {allStores?.length ? (
          allStores?.map((store) => {
            return (
              <StoreRow
                key={store.store_id}
                store={store}
                callback={() => {
                  router.push(`/admin/stores/${store.store_id}`);
                }}
              />
            );
          })
        ) : (
          <div className="text-muted justify-center bg-muted/10 h-full flex items-center rounded-md">
            Coming soon for this location
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminStoresPage;
