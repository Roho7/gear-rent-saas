"use client";

import Spinner from "../_components/_shared/spinner";
import { useAuth } from "../_providers/useAuth";
import AdminHeader from "./_components/admin.header";
import AdminSidebar from "./_components/admin.sidebar";
import { AdminProvider } from "./_providers/useAdmin";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AdminProvider>
      <div className="grid h-screen overflow-y-hidden w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] max-w-screen">
        <AdminSidebar />
        <div className="flex flex-col">
          <AdminHeader />
          {children}
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
