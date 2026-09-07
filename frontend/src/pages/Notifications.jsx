import { useNavigate } from "../router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { notifications } from "../data/notifications.js";
import Header from "../components/layout/Header";

export default function Notifications() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Header />

      <main className="mx-auto max-w-7xl px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
        >
          <ArrowLeft size={18} />
          {t("buttons.back")}
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--text)]">{t("pages.notifications")}</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{t("notifications.subtitle")}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] text-[var(--text)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">{t("pages.notificationsTitle")}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">{t("pages.notificationsMessage")}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">{t("pages.notificationsDate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {notifications.map((notification) => (
                <tr key={notification.id} className="transition hover:bg-[var(--surface-2)]">
                  <td className="px-6 py-5 align-top">
                    <div className={`text-sm text-[var(--text)] ${notification.unread ? "font-semibold text-[var(--green)]" : "font-normal"}`}>
                      {t(notification.titleKey)}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top text-sm text-[var(--text-muted)]">{t(notification.messageKey)}</td>
                  <td className="px-6 py-5 align-top text-xs text-[var(--text-muted)]">{notification.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
