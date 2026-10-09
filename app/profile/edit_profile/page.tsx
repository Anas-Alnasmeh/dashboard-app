"use client";

import { inputClasses } from "@/lib/utils/Clsx";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AtSign,
  BriefcaseBusiness,
  Building2,
  Check,
  Globe2,
  Image as ImageIcon,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useTheme } from "@/components/ThemeProvider";
import { current_user as user } from "@/data/mock_dashboard_data.json";
import {
  EditableProfile,
  FieldLabelProps,
  ReadOnlyDetailProps,
} from "@/types/user-profile";
import { clsx } from "clsx";
import { TIMEZONES, LANGUAGE_NAMES } from "@/components/TimeAndLang";

const initialProfile: EditableProfile = {
  name: user.name,
  jobTitle: user.profile.job_title,
  phone: user.profile.phone,
  timezone: user.profile.timezone,
  bio: user.profile.bio,
  language: user.preferences.language,
  avatar: user.avatar,
};

function FieldLabel({
  htmlFor,
  icon,
  children,
  required = false,
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
    >
      {icon}
      {children}
      {required && <span className="text-violet-500">*</span>}
    </label>
  );
}

function ReadOnlyDetail({ label, value, icon }: ReadOnlyDetailProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-2 break-words text-sm font-medium text-slate-800 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export default function EditProfilePage() {
  const { theme } = useTheme();
  const [profile, setProfile] = useState(initialProfile);
  const [isAvatarDragging, setIsAvatarDragging] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const isDark = theme === "dark";

  const dismissToast = useCallback(() => {
    setIsToastVisible(false);
    setTimeout(() => {
      setShowToast(false);
    }, 300);
  }, []);

  const triggerToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    setShowToast(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsToastVisible(true);
      });
    });

    toastTimerRef.current = setTimeout(() => {
      dismissToast();
    }, 4000);
  }, [dismissToast]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const updateField = <K extends keyof EditableProfile>(
    field: K,
    value: EditableProfile[K],
  ) => {
    setProfile((current) => ({ ...current, [field]: value }));
    if (showToast) dismissToast();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    triggerToast();
  };

  const handleAvatarFileSelection = (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        updateField("avatar", result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main
      className={clsx({
        "bg-slate-950 text-slate-100": isDark,
        "bg-slate-50 text-slate-900": !isDark,
      })}
    >
      <div className="mx-auto dashboard-shell">
        <header className="mb-8">
          <Link
            href="/profile"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to profile
          </Link>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-500">
                Account settings
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Edit profile
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                Keep your personal details current across the workspace.
              </p>
            </div>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 lg:grid-cols-[1fr_0.72fr]"
        >
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="mb-7 flex justify-center">
                <div className="flex flex-col items-center">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => avatarInputRef.current?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        avatarInputRef.current?.click();
                      }
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsAvatarDragging(true);
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault();
                      setIsAvatarDragging(false);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsAvatarDragging(false);
                      handleAvatarFileSelection(event.dataTransfer.files);
                    }}
                    className={clsx(
                      "group relative flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-lg ring-4 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                      {
                        "ring-slate-900": isDark,
                        "ring-slate-100": !isDark,
                        "border-violet-400": isAvatarDragging,
                        "border-white": !isAvatarDragging,
                      },
                    )}
                  >
                    <div
                      aria-label="Profile photo preview"
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url("${profile.avatar}")` }}
                    />
                    <div className="absolute inset-0 bg-slate-900/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <ImageIcon className="h-5 w-5" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                        Upload
                      </span>
                    </div>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleAvatarFileSelection(event.target.files)
                    }
                  />
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium">Profile photo</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Drag and drop an image here or click to browse local
                      files.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-7">
                <h2 className="text-base font-semibold">
                  Personal information
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  These details are visible to your workspace members.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel
                    htmlFor="name"
                    icon={<UserRound className="h-3.5 w-3.5" />}
                    required
                  >
                    Full name
                  </FieldLabel>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={profile.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    className={inputClasses(isDark)}
                  />
                </div>

                <div>
                  <FieldLabel
                    htmlFor="job-title"
                    icon={<BriefcaseBusiness className="h-3.5 w-3.5" />}
                  >
                    Job title
                  </FieldLabel>
                  <input
                    id="job-title"
                    name="job-title"
                    type="text"
                    autoComplete="organization-title"
                    value={profile.jobTitle}
                    onChange={(event) =>
                      updateField("jobTitle", event.target.value)
                    }
                    className={inputClasses(isDark)}
                  />
                </div>

                <div>
                  <FieldLabel
                    htmlFor="phone"
                    icon={<Phone className="h-3.5 w-3.5" />}
                  >
                    Phone number
                  </FieldLabel>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={profile.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className={inputClasses(isDark)}
                  />
                </div>

                <div>
                  <FieldLabel
                    htmlFor="timezone"
                    icon={<Globe2 className="h-3.5 w-3.5" />}
                  >
                    Timezone
                  </FieldLabel>
                  <select
                    id="timezone"
                    name="timezone"
                    value={profile.timezone}
                    onChange={(event) =>
                      updateField("timezone", event.target.value)
                    }
                    className={inputClasses(isDark)}
                  >
                    {TIMEZONES.map((timezone) => (
                      <option key={timezone} value={timezone}>
                        {timezone.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel
                    htmlFor="language"
                    icon={<AtSign className="h-3.5 w-3.5" />}
                  >
                    Display language
                  </FieldLabel>
                  <select
                    id="language"
                    name="language"
                    value={profile.language}
                    onChange={(event) =>
                      updateField("language", event.target.value)
                    }
                    className={inputClasses(isDark)}
                  >
                    {Object.entries(LANGUAGE_NAMES).map(([code, label]) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel
                    htmlFor="bio"
                    icon={<UserRound className="h-3.5 w-3.5" />}
                  >
                    Bio
                  </FieldLabel>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    maxLength={240}
                    value={profile.bio}
                    onChange={(event) => updateField("bio", event.target.value)}
                    className={clsx(inputClasses(isDark), "resize-y")}
                  />
                  <p className="mt-1.5 text-right text-xs text-slate-400">
                    {profile.bio.length}/240
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/profile"
                className={clsx(
                  "inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                  {
                    "border-slate-700 text-slate-300 hover:bg-slate-900":
                      isDark,
                    "border-slate-200 text-slate-600 hover:bg-white": !isDark,
                  },
                )}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
              >
                <Save className="h-4 w-4" />
                Save changes
              </button>
            </div>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Account details</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Managed by your workspace.
                  </p>
                </div>
                <LockKeyhole className="h-4 w-4 text-slate-400" />
              </div>
              <div className="space-y-3">
                <ReadOnlyDetail
                  label="Email"
                  value={user.email}
                  icon={<Mail className="h-3.5 w-3.5" />}
                />
                <ReadOnlyDetail
                  label="Access ID"
                  value={user.id}
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                />
                <ReadOnlyDetail
                  label="Role"
                  value={user.role}
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                />
                <ReadOnlyDetail
                  label="Organization"
                  value={user.organization}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                />
                <ReadOnlyDetail
                  label="Plan"
                  value={user.plan}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 sm:p-7">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Safe to explore</h2>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Your privacy is our priority. Your data belongs to you. You
                    can export or delete it at any time
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </form>
      </div>

      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className={clsx(
            "fixed bottom-6 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-emerald-500/20 bg-white p-4 text-sm text-slate-700 shadow-xl dark:bg-slate-900 dark:text-slate-100 sm:right-8",
            "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)",
            {
              "translate-y-0 opacity-100 scale-100": isToastVisible,
              "translate-y-4 opacity-0 scale-95 pointer-events-none":
                !isToastVisible,
            },
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <Check className="h-4 w-4" />
          </div>
          <div className="pr-2">
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              Changes saved
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Your account information has been safely updated.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Close notification"
            className="ml-auto rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </main>
  );
}
