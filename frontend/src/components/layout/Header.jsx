import { useEffect, useState } from "react";
import { Bell, Moon, Sun, UserRound } from "lucide-react";
import { useNavigate } from "../../router";
import { useTranslation } from "react-i18next";
import { unreadCount } from "../../data/notifications.js";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto flex max-w-[1260px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--surface-2)] text-[var(--green)]">
            <UserRound aria-hidden="true" className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-normal text-[var(--text)]">
              {t("header.greeting", { username })}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{t("header.subtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:w-auto">
          {/* Theme Toggle Button */}
          <button
            aria-label="Toggle Theme"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--green)] transition"
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? (
              <Sun aria-hidden="true" className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon aria-hidden="true" className="h-5 w-5 text-slate-700" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            aria-label={t("buttons.notifications")}
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--green)] transition"
            type="button"
            onClick={() => navigate("/notifications")}
          >
            <Bell aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            {unreadCount() > 0 && (
              <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-[var(--danger)]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
