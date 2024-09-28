"use client";
import React from "react";
import SecondaryNavbar from "../_components/_shared/secondary-navbar";
import AccountSidebar from "./_components/account.sidebar";

type Props = {
  children: React.ReactNode;
};

const AccountLayout = ({ children }: Props) => {
  return (
    <main className="min-h-screen flex">
      <AccountSidebar />
      <section className="flex relative h-full flex-col flex-1">
        <SecondaryNavbar />
        <div className="h-full w-full p-4">{children}</div>
      </section>
    </main>
  );
};

export default AccountLayout;
