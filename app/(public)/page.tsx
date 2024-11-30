

import { Metadata, Viewport } from "next";
import MainPublicPage from "./mainpage";

const GEARYO_META_TAGS = {
  title: 'Gearyo - Rent the perfect gear for your next adventure',
  description:
    'Gearyo is a platform to rent the perfect gear for your next adventure',
  icon: 'logo-bg-white.png',
  og_image: `${
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://' + process.env.VERCEL_BRANCH_URL
  }/brand/logo_bg_white.png`,
  theme_color: '#192E37',
};

export const metadata: Metadata = {
  title: {
    template: `${GEARYO_META_TAGS.title}`,
    default: GEARYO_META_TAGS.title, // a default is required when creating a template
  },
  description: `${GEARYO_META_TAGS.description}`,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ||
      'https://' + process.env.VERCEL_BRANCH_URL ||
      'https://gearyo.com'
  ),
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${GEARYO_META_TAGS.title}`,
    description: `${GEARYO_META_TAGS.description}`,
    url:
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://' + process.env.VERCEL_BRANCH_URL,
    siteName: GEARYO_META_TAGS.title,
    images: [
      {
        url: GEARYO_META_TAGS.og_image,
        width: 1200,
        height: 630,
        alt: GEARYO_META_TAGS.title,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${GEARYO_META_TAGS.title}`,
    description: `${GEARYO_META_TAGS.description}`,
    creator: '@rohosen_',
    images: [
      {
        url: GEARYO_META_TAGS.og_image,
        width: 1200,
        height: 630,
        alt: GEARYO_META_TAGS.title,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: `${GEARYO_META_TAGS.theme_color}`,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  initialScale: 1,
};

export default function Home() {
  return (
    <MainPublicPage />
  );
}
