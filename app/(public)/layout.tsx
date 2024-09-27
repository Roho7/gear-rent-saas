"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
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
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}>
      <section
        className={"overflow-x-hidden min-h-screen relative flex flex-col"}
      >
        <Navbar />
        <main className="px-8 py-4 mt-28 h-full flex-1">{children}</main>
        <Footer />
      </section>
    </APIProvider>
  );
}
