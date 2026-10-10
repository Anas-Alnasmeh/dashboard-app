"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  CircleCheck,
  CreditCard,
  FolderKanban,
  ListTodo,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

import { formatLastSeen } from "@/components/DateAndTime";
import type { DashboardData } from "@/types/dashboard";

type Notification = DashboardData["notifications"][number];

const notificationIcons: Record<string, LucideIcon> = {
  task: ListTodo,
  project: FolderKanban,
  billing: CreditCard,
  system: Settings,
} as const;

export function NotificationsMenu({
  notifications: initialNotifications,
}: {
  notifications: Notification[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePanelPosition = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      panel.style.setProperty(
        "--notifications-top",
        `${trigger.getBoundingClientRect().bottom + 8}px`,
      );
    };

    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const markAsRead = (notificationId: Notification["id"]) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className="icon-button"
        aria-label={
          unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        aria-expanded={isOpen}
        aria-controls="notifications-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Bell size={19} aria-hidden="true" />
        {unreadCount > 0 && (
          <span aria-hidden="true" className="notification-dot" />
        )}
      </button>

      {isOpen && (
        <section
          ref={panelRef}
          id="notifications-panel"
          aria-labelledby="notifications-title"
          className="absolute right-0 top-full z-[1001] mt-2 flex max-h-[calc(100dvh-2rem)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/10 max-[640px]:fixed max-[640px]:left-4 max-[640px]:right-4 max-[640px]:top-[var(--notifications-top)] max-[640px]:mt-0 max-[640px]:max-h-[calc(100dvh-var(--notifications-top)-1rem)] max-[640px]:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div>
              <h2 id="notifications-title" className="text-sm font-semibold">
                Notifications
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {unreadCount ? `${unreadCount} unread` : "You’re all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-violet-300 dark:hover:bg-slate-800"
              >
                <CheckCheck size={14} aria-hidden="true" />
                Mark all read
              </button>
            )}
          </header>

          <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
            {notifications.length === 0 ? (
              <li className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No notifications yet.
              </li>
            ) : (
              notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] ?? Bell;
                const content = (
                  <>
                    <span
                      className={clsx(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        notification.read
                          ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          : "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
                      )}
                    >
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={clsx(
                            "truncate text-sm",
                            notification.read
                              ? "font-medium text-slate-700 dark:text-slate-200"
                              : "font-semibold text-slate-900 dark:text-white",
                          )}
                        >
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span
                            aria-label="Unread"
                            className="h-2 w-2 shrink-0 rounded-full bg-violet-500"
                          />
                        )}
                      </span>
                      <span
                        title={notification.message}
                        className="mt-0.5 block text-left overflow-hidden text-xs leading-5 text-slate-500 dark:text-slate-400"
                      >
                        {notification.message}
                      </span>
                      <span className="mt-1 block text-left text-[11px] text-slate-400 dark:text-slate-500">
                        {formatLastSeen(notification.created_at)}
                      </span>
                    </span>
                    {notification.read && (
                      <Check
                        size={15}
                        className="mt-1 shrink-0 text-slate-400"
                        aria-label="Read"
                      />
                    )}
                  </>
                );

                return (
                  <li key={notification.id}>
                    {notification.read ? (
                      <div className="flex gap-3 rounded-lg px-3 py-3">
                        {content}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        aria-label={`Mark ${notification.title} as read`}
                        className="flex w-full gap-3 rounded-lg bg-violet-50/70 px-3 py-3 text-left transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 dark:bg-violet-500/5 dark:hover:bg-violet-500/10"
                      >
                        {content}
                      </button>
                    )}
                  </li>
                );
              })
            )}
          </ul>

          <footer className="flex items-center gap-2 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <CircleCheck size={14} aria-hidden="true" />
            {unreadCount
              ? "Select an unread notification to mark it as read."
              : "You’re up to date"}
          </footer>
        </section>
      )}
    </div>
  );
}
