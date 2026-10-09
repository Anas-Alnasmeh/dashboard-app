"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Mail,
  Building2,
  Globe,
  Bell,
  Copy,
  Check,
  LogOut,
  Pencil,
} from "lucide-react";

import type {
  ToggleSwitchProps,
  InfoTileProps,
  SegmentedControlProps,
} from "@/types/user-profile.ts";

import { current_user as user } from "@/data/mock_dashboard_data.json";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { clsx } from "clsx";
import { LANGUAGE_NAMES } from "@/components/TimeAndLang";
import data from "@/data/mock_dashboard_data.json";

function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
  description,
  theme,
}: ToggleSwitchProps) {
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label
          htmlFor={id}
          className={clsx(
            {
              "text-slate-100": isDark,
              "text-slate-800": !isDark,
            },
            "text-sm font-medium",
          )}
        >
          {label}
        </label>
        {description && (
          <p
            className={clsx(
              {
                "text-slate-400": isDark,
                "text-slate-500": !isDark,
              },
              "mt-0.5 text-xs",
            )}
          >
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
          {
            "focus-visible:ring-offset-slate-950": isDark,
            "focus-visible:ring-offset-white": !isDark,
            "border-emerald-500/30 bg-emerald-500": checked,
            "border-slate-700 bg-slate-700": !checked && isDark,
            "border-slate-300 bg-slate-200": !checked && !isDark,
          },
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 left-0 h-[18px] w-[18px] rounded-full bg-[#ffffff] shadow transition-transform motion-reduce:transition-none",
            {
              "translate-x-[22px]": checked,
              "translate-x-0.5": !checked,
            },
          )}
        />
      </button>
    </div>
  );
}

function InfoTile({ icon, label, value, copyable, theme }: InfoTileProps) {
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div
      className={clsx(
        {
          "border-slate-800 bg-slate-900/80": isDark,
          "border-slate-200 bg-white": !isDark,
        },
        "rounded-xl border p-4",
      )}
    >
      <div className={"flex items-center gap-2 text-slate-400"}>
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span
          className={clsx("truncate text-sm", {
            "text-slate-100": isDark,
            "text-slate-900": !isDark,
          })}
        >
          {value}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy ${label.toLowerCase()}`}
            className={clsx(
              {
                "hover:bg-slate-800 hover:text-slate-200": isDark,
                "hover:bg-slate-100 hover:text-slate-700": !isDark,
              },
              "shrink-0 rounded-md p-1.5 text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SegmentedControl({
  label,
  options,
  value,
  onChange,
  theme,
}: SegmentedControlProps) {
  const isDark = theme === "dark";

  return (
    <div>
      <span
        className={clsx(
          {
            "text-slate-200": isDark,
            "text-slate-800": !isDark,
          },
          "text-sm font-medium",
        )}
      >
        {label}&nbsp;
      </span>
      <div
        className={clsx(
          {
            "border-slate-700 bg-slate-800": isDark,
            "border-slate-200 bg-slate-50": !isDark,
          },
          "mt-2 inline-flex gap-1 rounded-lg border p-1",
        )}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={clsx(
              "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              {
                "bg-violet-500 text-white": value === opt.value && isDark,
                "bg-slate-900 text-white": value === opt.value && !isDark,
                "text-slate-400 hover:text-slate-200":
                  value !== opt.value && isDark,
                "text-slate-500 hover:text-slate-800":
                  value !== opt.value && !isDark,
              },
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(user.preferences.email_alerts);
  const [twoFactor, setTwoFactor] = useState(user.preferences.two_factor_auth);
  const [copiedId, setCopiedId] = useState(false);
  const notifications = data.notifications ?? [];
  const isDark = theme === "dark";

  const notificationsCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 1500);
    } catch {}
  };
  return (
    <div
      className={clsx(
        {
          "dark bg-slate-950 text-slate-100": isDark,
          "bg-slate-50 text-slate-900": !isDark,
        },
        "dashboard-shell",
      )}
    >
      <div className="mx-auto space-y-4 mt-10">
        <section
          className={clsx(
            {
              "border-slate-800 bg-slate-900": isDark,
              "border-slate-200 bg-white": !isDark,
            },
            "relative overflow-hidden rounded-2xl border p-6 sm:p-8",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 10px)",
            }}
          />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Link href="/profile/edit_profile">
                  <Image
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                    width={80}
                    height={80}
                    loading="eager"
                    className="rounded-full object-cover ring-2 ring-violet-500/30"
                  />
                </Link>
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 motion-safe:animate-pulse motion-reduce:animate-none"
                />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                  Access ID
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h1
                    className={clsx(
                      {
                        "text-slate-100": isDark,
                        "text-slate-900": !isDark,
                      },
                      "text-2xl font-semibold",
                    )}
                  >
                    {user.name}
                  </h1>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className={clsx(
                      {
                        "border-slate-700 text-slate-300 hover:text-slate-100":
                          isDark,
                        "border-slate-200 text-slate-500 hover:text-slate-800":
                          !isDark,
                      },
                      "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                    )}
                  >
                    {user.id}
                    {copiedId ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <div
                  className={clsx(
                    {
                      "text-slate-400": isDark,
                      "text-slate-500": !isDark,
                    },
                    "mt-1.5 flex flex-wrap items-center gap-2 text-sm",
                  )}
                >
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[12px] font-medium text-violet-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {user.role}
                  </span>
                  <span
                    className={clsx({
                      "text-slate-600": isDark,
                      "text-slate-300": !isDark,
                    })}
                  >
                    &middot;
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Building2
                      className={clsx(
                        {
                          "text-slate-500": isDark,
                          "text-slate-400": !isDark,
                        },
                        "h-3.5 w-3.5",
                      )}
                    />
                    {user.organization}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[12px] font-semibold text-amber-400">
                {user.plan}
              </span>
              <div className="flex gap-2">
                <Link
                  href="/profile/edit_profile"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit profile
                </Link>
                <button
                  type="button"
                  className={clsx(
                    {
                      "border-slate-700 text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-slate-950":
                        isDark,
                      "border-slate-200 text-slate-600 hover:bg-slate-100 focus-visible:ring-offset-white":
                        !isDark,
                    },
                    "inline-flex items-center gap-1.5 cursor-pointer rounded-lg border px-3.5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
                  )}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <section
            className={clsx(
              {
                "border-slate-800 bg-slate-900": isDark,
                "border-slate-200 bg-white": !isDark,
              },
              "rounded-2xl border p-6",
            )}
          >
            <h2
              className={clsx(
                {
                  "text-slate-100": isDark,
                  "text-slate-900": !isDark,
                },
                "text-sm font-semibold",
              )}
            >
              Security
            </h2>
            <p
              className={clsx(
                {
                  "text-slate-400": isDark,
                  "text-slate-500": !isDark,
                },
                "mt-0.5 text-xs",
              )}
            >
              Keep this account locked down.
            </p>
            <div className="mt-5 space-y-5">
              <ToggleSwitch
                id="two-factor"
                checked={twoFactor}
                onChange={setTwoFactor}
                label="Two-factor authentication"
                description={
                  twoFactor
                    ? "Enabled — this account is protected."
                    : "Off — turn on for extra security."
                }
                theme={theme}
              />
              <ToggleSwitch
                id="email-alerts"
                checked={emailAlerts}
                onChange={setEmailAlerts}
                label="Email alerts"
                description="Get notified about account and billing activity."
                theme={theme}
              />
            </div>
          </section>

          <section
            className={clsx(
              {
                "border-slate-800 bg-slate-900": isDark,
                "border-slate-200 bg-white": !isDark,
              },
              "rounded-2xl border p-6",
            )}
          >
            <h2
              className={clsx(
                {
                  "text-slate-100": isDark,
                  "text-slate-900": !isDark,
                },
                "text-sm font-semibold",
              )}
            >
              Preferences
            </h2>
            <p
              className={clsx(
                {
                  "text-slate-400": isDark,
                  "text-slate-500": !isDark,
                },
                "mt-0.5 text-xs",
              )}
            >
              Applies across your workspace.
            </p>
            <div className="mt-5 space-y-5">
              <SegmentedControl
                label="Theme"
                value={theme}
                onChange={setTheme}
                options={[
                  { value: "dark", label: "Dark" },
                  { value: "light", label: "Light" },
                ]}
                theme={theme}
              />
              <div>
                <span
                  className={clsx(
                    {
                      "text-slate-200": isDark,
                      "text-slate-800": !isDark,
                    },
                    "text-sm font-medium",
                  )}
                >
                  Language
                </span>
                <div
                  className={clsx(
                    {
                      "border-slate-700 bg-slate-800 text-slate-300": isDark,
                      "border-slate-200 bg-slate-50 text-slate-700": !isDark,
                    },
                    "mt-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                  )}
                >
                  <Globe
                    className={clsx(
                      {
                        "text-slate-500": isDark,
                        "text-slate-400": !isDark,
                      },
                      "h-3.5 w-3.5",
                    )}
                  />
                  {LANGUAGE_NAMES[user.preferences.language] ??
                    user.preferences.language}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section>
          <h2
            className={clsx(
              {
                "text-slate-200": isDark,
                "text-slate-900": !isDark,
              },
              "mb-3 text-sm font-semibold",
            )}
          >
            Account details
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoTile
              icon={<Mail className="h-3.5 w-3.5" />}
              label="Email"
              value={user.email}
              copyable
              theme={theme}
            />
            <InfoTile
              icon={<Building2 className="h-3.5 w-3.5" />}
              label="Organization"
              value={user.organization}
              theme={theme}
            />
            <InfoTile
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              label="Plan"
              value={user.plan}
              theme={theme}
            />
            <InfoTile
              icon={<Bell className="h-3.5 w-3.5" />}
              label="Notifications"
              value={`${
                notificationsCount > 0 ? notificationsCount : "No"
              } unread`}
              theme={theme}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
