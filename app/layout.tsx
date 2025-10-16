import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { StructuredData } from "@/components/seo/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lotus Product Dashboard",
    template: "%s | Lotus Product Dashboard"
  },
  description: "Professional product management dashboard for browsing, searching, and managing products with advanced filtering and analytics.",
  keywords: ["products", "dashboard", "e-commerce", "analytics", "product management"],
  authors: [{ name: "Lotus Beta Analytics" }],
  creator: "Lotus Beta Analytics",
  publisher: "Lotus Beta Analytics",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://lotus-dashboard.com',
    siteName: 'Lotus Product Dashboard',
    title: 'Lotus Product Dashboard',
    description: 'Professional product management dashboard for browsing, searching, and managing products with advanced filtering and analytics.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lotus Product Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lotus Product Dashboard',
    description: 'Professional product management dashboard for browsing, searching, and managing products with advanced filtering and analytics.',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
