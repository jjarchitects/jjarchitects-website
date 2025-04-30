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

// color 1
// 218
// 214
// 203

// color 2

// 163
// 88
// 56
