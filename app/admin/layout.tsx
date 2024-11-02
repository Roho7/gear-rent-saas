"use client";

import SecondaryNavbar from "../_components/_shared/secondary-navbar";
import Spinner from "../_components/_shared/spinner";
import { useAuth } from "../_providers/useAuth";
import AdminSidebar from "./_components/admin.sidebar";
import { AdminProvider } from "./_providers/useAdmin";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AdminProvider>
      <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="flex flex-col h-screen max-h-screen">
          <SecondaryNavbar />
          <div className="overflow-y-auto flex-1 min-h-0">{children}</div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
