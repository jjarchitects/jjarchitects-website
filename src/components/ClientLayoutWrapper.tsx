"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomCursor from "@/utility/CustomCursor";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="admin-root min-h-screen bg-taupe-100 text-carbon font-sans">
        {children}
      </div>
    );
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <Suspense>
        <div className="mt-[60px]">{children}</div>
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
