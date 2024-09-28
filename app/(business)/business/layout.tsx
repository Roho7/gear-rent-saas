"use client";
import SecondaryNavbar from "@/app/_components/_shared/secondary-navbar";
import { useAuth } from "@/app/_providers/useAuth";
import BusinessSidebar from "./_components/business.sidebar";
import RegisterBusinessForm from "./_components/register-business";

const BusinessLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return user?.store_id ? (
    <div className="grid h-screen overflow-hiddenmd:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] max-w-screen">
      <BusinessSidebar />
      <div className="flex flex-col overflow-hidden max-h-screen">
        <SecondaryNavbar />
        <main className="h-full overflow-y-scroll">{children}</main>
      </div>
    </div>
  ) : (
    <RegisterBusinessForm />
  );
};

export default BusinessLayout;
