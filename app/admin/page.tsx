"use client";

import { BiBox, BiListCheck, BiStore } from "react-icons/bi";
import Spinner from "../_components/_shared/spinner";
import { useProducts } from "../_providers/useProducts";
import DashboardStat from "./_components/dasboard.stat.card";
import { useAdmin } from "./_providers/useAdmin";

type Props = {};

const AdminDashboardPage = (props: Props) => {
  const { allProducts, allStores } = useProducts();
  const { allListings, isLoading } = useAdmin();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-4xl font-bold">Gearyo Admin</h1>
      <div className="grid grid-cols-2 gap-2">
        <DashboardStat
          value={allStores.length.toString()}
          title="Total Stores"
          description="Total number of allStores registered"
          icon={<BiStore />}
        />
        <DashboardStat
          value={allProducts.length.toString()}
          title="Total Products"
          description="Total number of products"
          icon={<BiBox />}
        />
        <DashboardStat
          value={allListings?.length.toString() || "0"}
          title="Total Listings"
          description="Total number of products listed"
          icon={<BiListCheck />}
        />
      </div>
    </main>
  );
};

export default AdminDashboardPage;
