"use client";
import { useAuth } from "@/app/_providers/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { BookingsType } from "@/src/entities/models/types";
import { useEffect, useState } from "react";
import { fetchOrders } from "./_actions/orders.actions";
import { OrdersTable } from "./_components/orders.table";

const OrdersSkeleton = () => {
  return (
    <div className="py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<BookingsType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const res = await fetchOrders({ store_id: user?.store_id });
        setAllOrders(res);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message ?? "Error while fetching orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    getAllOrders();
  }, []);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 relative">
      {loading ? <OrdersSkeleton /> : <OrdersTable data={allOrders} />}
    </main>
  );
};

export default OrdersPage;
