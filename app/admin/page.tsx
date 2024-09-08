"use client";
import { InventoryType } from "@/packages/types";
import { useEffect, useState } from "react";
import { BiBox, BiListCheck, BiStore } from "react-icons/bi";
import { useProducts } from "../_providers/useProducts";
import { getInventory } from "./_actions/admin.actions";
import DashboardStat from "./_components/dasboard.stat.card";

type Props = {};

const AdminDashboardPage = (props: Props) => {
  const { stores, products } = useProducts();
  const [allInventory, setAllInventory] = useState<InventoryType[]>();

  useEffect(() => {
    const fetchInventory = async () => {
      const inventory = await getInventory();
      setAllInventory(inventory as InventoryType[]);
    };
    fetchInventory();
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-4xl font-bold">Gearyo Admin</h1>
      <div className="flex gap-2">
        <DashboardStat
          value={stores.length.toString()}
          title="Total Stores"
          description="Total number of stores registered"
          icon={<BiStore />}
        />
        <DashboardStat
          value={products.length.toString()}
          title="Total Products"
          description="Total number of products"
          icon={<BiBox />}
        />
        <DashboardStat
          value={allInventory?.length.toString() || "0"}
          title="Total Listings"
          description="Total number of products listed"
          icon={<BiListCheck />}
        />
      </div>
    </main>
  );
};

export default AdminDashboardPage;
