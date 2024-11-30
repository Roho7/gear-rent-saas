import { Toaster } from "@/components/ui/toaster";
import { Urbanist } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "next-themes";
import { LoginModal } from "./_components/_shared/login.modal";
import { AuthProvider } from "./_providers/useAuth";
import { ProductProvider } from "./_providers/useProducts";
import "./globals.css";

export const dynamic = "force-dynamic";
const lato = Urbanist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></Script>
      </head>
      <body
        className={
          lato.className + "overflow-x-hidden flex flex-col min-h-screen "
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ProductProvider>
              {children}
              <Toaster />
              <LoginModal />
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
