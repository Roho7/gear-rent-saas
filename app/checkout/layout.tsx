type Props = {};

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <nav className=" bg-muted/30 w-screen px-8 py-4">
        <a href="/" className="text-white font-bold">
          <img src="/logo-short.png" alt="" className="w-8" />
        </a>
      </nav>
      <div className="md:px-8 py-8 min-h-screen">{children}</div>
    </main>
  );
};

export default CheckoutLayout;
