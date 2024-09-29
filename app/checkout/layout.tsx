"use client";
import SecondaryNavbar from "../_components/_shared/secondary-navbar";
import { CheckoutProvider } from "./_providers/useCheckout";
const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CheckoutProvider>
      <main>
        <SecondaryNavbar />
        <div className="md:px-8 py-8 min-h-screen">{children}</div>
      </main>
    </CheckoutProvider>
  );
};

export default CheckoutLayout;
