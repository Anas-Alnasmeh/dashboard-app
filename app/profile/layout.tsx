import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your KIN workspace profile and account preferences.",
};

export default function ProfileLayout({
  children,
}: LayoutProps<"/profile">) {
  return children;
}
