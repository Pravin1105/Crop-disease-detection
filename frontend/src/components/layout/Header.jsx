import { Bell, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { unreadCount } from "../../data/notifications.js";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";
  return (
    <header className="border-b border-border bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1260px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-brand shadow-[inset_0_-10px_16px_rgba(31,116,255,0.16)]">
            <UserRound aria-hidden="true" className="h-8 w-8" strokeWidth={1.6} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-normal text-slate-950">
              {t("header.greeting", { username })}
            </h1>
            <p className="mt-1 text-base text-muted">{t("header.subtitle")}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4 sm:w-auto">
          <button
            aria-label={t("buttons.notifications")}
            className="relative grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-border bg-white text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            type="button"
            onClick={() => navigate("/notifications")}
          >
            <Bell aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
            {unreadCount() > 0 && (
              <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
