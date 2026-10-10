import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Analytics",
  description:
    "Analyze revenue, expenses, and profit trends across your business.",
};

export default function AnalyticsLayout({
  children,
}: LayoutProps<"/analytics">) {
  return children;
}
