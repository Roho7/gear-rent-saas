"use client";
import React from "react";
import AccountSidebar from "./_components/account.sidebar";

type Props = {
  children: React.ReactNode;
};

const AccountLayout = ({ children }: Props) => {
  return (
    <section className="flex min-h-screen relative">
      <AccountSidebar />
      {children}
    </section>
  );
};

export default AccountLayout;
