import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import Script from "next/script";

import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./_providers/useAuth";
import { ProductProvider } from "./_providers/useProducts";
import "./globals.css";

export const dynamic = "force-dynamic";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gearyo",
  description: "An open marketplace for renting adventure gear",
};

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
          inter.className + "overflow-x-hidden flex flex-col min-h-screen "
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
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
