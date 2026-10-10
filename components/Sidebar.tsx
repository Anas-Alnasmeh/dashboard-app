"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import {
  Settings,
  CircleChevronRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  UserRound,
  Users,
  FolderKanban,
  SquareCheckBig,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className={clsx("group fixed left-0 top-0 hover:w-66 h-dvh w-10 z-1000", {
        "w-66": isOpen,
      })}
    >
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={clsx(
          "fixed inset-0 bg-black/20 opacity-0 transition-opacity duration-400 group-hover:opacity-100",
          {
            "opacity-100": isOpen,
            "pointer-events-none": !isOpen,
          },
        )}
      />
      <CircleChevronRight
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "z-20 duration-400 fill-white dark:fill-slate-900 group-hover:translate-x-64 group-hover:rotate-180 fixed top-[50%] left-1 transform -translate-y-1/2 w-10 h-10",
          {
            "translate-x-64 rotate-180": isOpen,
          },
        )}
      />
      <aside
        className={clsx(
          "relative z-10 transform bg-white dark:bg-slate-900 dark:text-slate-100 -translate-x-full group-hover:translate-x-0 duration-400 w-64 h-dvh rounded-r-lg shadow-lg items-center flex justify-between flex-col py-8",
          {
            "translate-x-0": isOpen,
          },
        )}
      >
        <X
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-2 text-slate-600 dark:text-slate-300 cursor-pointer"
        />

        <section className="flex flex-col gap-5 w-full">
          <h1 className="text-3xl font-bold text-center tracking-wider select-none">
            KIN
          </h1>
          <Link
            href="/profile"
            className={clsx("element-of-sidebar", {
              active:
                pathname === "/profile" || pathname === "/profile/edit_profile",
            })}
          >
            <UserRound />
            PROFILE
          </Link>
          <Link
            href="/dashboard"
            className={clsx("element-of-sidebar", {
              active: pathname === "/dashboard" || pathname === "/",
            })}
          >
            <LayoutDashboard />
            DASHBOARD
          </Link>
          <Link
            href="/customers"
            className={clsx("element-of-sidebar", {
              active: pathname === "/customers",
            })}
          >
            <Users />
            CUSTOMERS
          </Link>
          <Link
            href="/projects"
            className={clsx("element-of-sidebar", {
              active: pathname === "/projects",
            })}
          >
            <FolderKanban />
            PROJECTS
          </Link>
          <Link
            href="/tasks"
            className={clsx("element-of-sidebar", {
              active: pathname === "/tasks",
            })}
          >
            <SquareCheckBig />
            TASKS
          </Link>
          <Link
            href="/analytics"
            className={clsx("element-of-sidebar", {
              active: pathname === "/analytics",
            })}
          >
            <ChartNoAxesCombined />
            ANALYTICS
          </Link>
        </section>
        <button className="p-8 w-[90%] h-8 font-bold cursor-pointer flex justify-center gap-1">
          <Settings />
          Settings
        </button>
      </aside>
    </section>
  );
}
