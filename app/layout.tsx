import { Toaster } from "@/components/ui/toaster";
import { Urbanist } from "next/font/google";
import Script from "next/script";

import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { LoginModal } from "./_components/_shared/login.modal";
import { AuthProvider } from "./_providers/useAuth";
import { ProductProvider } from "./_providers/useProducts";
import "./globals.css";

export const dynamic = "force-dynamic";
const lato = Urbanist({
  // weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const title_input = 'Gearyo';
  const description_input = 'Rent the perfect gear for your next adventure';

  return {
    title: title_input,
    description: description_input,
    openGraph: {
      title: title_input,
      description: description_input,
      images: {
        url: `https://wysxkbvponpkbvsaawmd.supabase.co/storage/v1/object/public/assets/logo_bg_white.png`,
        alt: title_input,
      },
    },
    twitter: {
      images: {
        url: `https://wysxkbvponpkbvsaawmd.supabase.co/storage/v1/object/public/assets/logo_bg_white.png`,
        alt: title_input,
      },
      creator: '@rohosen_',
      card: 'summary_large_image',
      site: '@rohosen_',
      title: title_input,
      description: description_input,
    },
  };
}

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
