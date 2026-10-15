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

  const handleNavClick = () =>
    window.innerWidth < 768 ? setIsOpen(false) : undefined;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={clsx(
          "fixed z-30 inset-0 bg-black/20 opacity-0 transition-opacity duration-400",
          {
            "opacity-100": isOpen,
            "pointer-events-none": !isOpen,
          },
        )}
      />
      <section
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={clsx("fixed left-0 top-0 h-screen w-10 z-50", {
          "w-66": isOpen,
        })}
      >
        <CircleChevronRight
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "cursor-pointer duration-400 fill-white dark:fill-slate-900 fixed top-[50dvh] left-1 transform -translate-y-1/2 w-10 h-10",
            {
              "translate-x-64 rotate-180": isOpen,
            },
          )}
        />
        <aside
          className={clsx(
            "relative z-10 transform bg-white dark:bg-slate-900 dark:text-slate-100 -translate-x-full duration-400 w-64 h-screen rounded-r-lg shadow-lg items-center flex justify-between flex-col py-8",
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
              onClick={handleNavClick}
              href="/profile"
              className={clsx("element-of-sidebar", {
                active:
                  pathname === "/profile" ||
                  pathname === "/profile/edit_profile",
              })}
            >
              <UserRound />
              PROFILE
            </Link>
            <Link
              onClick={handleNavClick}
              href="/dashboard"
              className={clsx("element-of-sidebar", {
                active: pathname === "/dashboard" || pathname === "/",
              })}
            >
              <LayoutDashboard />
              DASHBOARD
            </Link>
            <Link
              onClick={handleNavClick}
              href="/customers"
              className={clsx("element-of-sidebar", {
                active: pathname === "/customers",
              })}
            >
              <Users />
              CUSTOMERS
            </Link>
            <Link
              onClick={handleNavClick}
              href="/projects"
              className={clsx("element-of-sidebar", {
                active: pathname === "/projects",
              })}
            >
              <FolderKanban />
              PROJECTS
            </Link>
            <Link
              onClick={handleNavClick}
              href="/tasks"
              className={clsx("element-of-sidebar", {
                active: pathname === "/tasks",
              })}
            >
              <SquareCheckBig />
              TASKS
            </Link>
            <Link
              onClick={handleNavClick}
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
    </>
  );
}
