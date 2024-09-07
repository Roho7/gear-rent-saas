import Navbar from "../_components/_navbar/navbar";
import Footer from "../_components/footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={"overflow-x-hidden flex flex-col min-h-screen "}>
      <Navbar />
      <main className="flex-grow px-8 py-4">{children}</main>
      <Footer />
    </section>
  );
}
