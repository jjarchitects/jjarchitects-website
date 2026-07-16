import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Jatan Joshi Architects",
  description:
    "Explore architecture, interior, and 3D design projects by Jatan Joshi Architects in Bhuj, Gujarat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
