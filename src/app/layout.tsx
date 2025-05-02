import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomCursor from "@/utility/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jatan Joshi Architects",
  description:
    "Jatan Joshi Architects – Leading architecture and interior design firm in Bhuj, offering expert services in architecture, interior design, and turnkey projects. Elevate your spaces with innovative and functional designs. Contact us today!",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Jatan Joshi Architects",
    description:
      "Leading architecture and interior design firm in Bhuj. Elevate your spaces with innovative, sustainable designs.",
    url: "https://jatanjoshiarchitects.com",
    siteName: "Jatan Joshi Architects",
    images: [
      {
        url: "https://jatanjoshiarchitects.com/og-image.jpg", // TODO: Add OG URL after deployment
        width: 1200,
        height: 630,
        alt: "Modern architecture by Jatan Joshi Architects",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jatan Joshi Architects",
    description:
      "Architecture and interior design studio in Bhuj. We create elegant, functional spaces.",
    images: ["https://jatanjoshiarchitects/og-image.jpg"], // TODO: Add OG URL after deployment
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased !cursor-none`}
      >
        <CustomCursor />
        <Navbar />
        <div className="mt-[60px]">{children}</div>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
