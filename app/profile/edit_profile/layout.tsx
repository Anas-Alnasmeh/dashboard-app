import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Edit Profile | KIN" },
  description: "Update your KIN workspace profile and account details.",
};

export default function EditProfileLayout({
  children,
}: LayoutProps<"/profile/edit_profile">) {
  return children;
}
