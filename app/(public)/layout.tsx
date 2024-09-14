"use client";

import Navbar from "../_components/_navbar/navbar";
import Spinner from "../_components/_shared/spinner";
import Footer from "../_components/footer";
import { useAuth } from "../_providers/useAuth";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <section className={"overflow-x-hidden min-h-screen relative"}>
      <Navbar />
      <main className="flex-grow px-8 py-4 mt-28">{children}</main>
      <Footer />
    </section>
  );
}
