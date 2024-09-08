"use client";

import { useState } from "react";
import Spinner from "../_components/_shared/spinner";
import { useAuth } from "../_providers/useAuth";
import AdminHeader from "./_components/admin.header";
import AdminSidebar from "./_components/admin.sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (user === null) {
  //     // User state has been initialized, but user is not logged in
  //     router.push("/home");
  //   } else if (user && !user.is_admin) {
  //     // User is logged in but not an admin
  //     router.push("/home");
  //   } else if (user && user.is_admin) {
  //     // User is logged in and is an admin
  //     setIsLoading(false);
  //   }
  // }, [router, user]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid min-h-screen overflow-hidden w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] max-w-screen">
      <AdminSidebar />
      <div className="flex flex-col">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
