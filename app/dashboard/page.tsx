import Home from "@/app/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Get a focused overview of your team's projects, tasks, and workspace performance.",
};

export default function Dashboard() {
  return <Home />;
}
