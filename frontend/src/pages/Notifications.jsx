import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { notifications } from "../data/notifications.js";

export default function Notifications() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            {t("buttons.back")}
          </button>

              <div className="mb-6">
            <h1 className="text-4xl font-bold text-slate-900">{t("pages.notifications")}</h1>
            <p className="mt-2 text-slate-600">{t("notifications.subtitle")}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-white shadow">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">{t("pages.notificationsTitle")}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">{t("pages.notificationsMessage")}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">{t("pages.notificationsDate")}</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification.id} className="border-t transition hover:bg-slate-50">
                    <td className="px-6 py-5 align-top">
                      <div className={`text-base text-slate-900 ${notification.unread ? "font-semibold" : "font-normal"}`}>
                        {t(notification.titleKey)}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top text-slate-600">{t(notification.messageKey)}</td>
                    <td className="px-6 py-5 align-top text-slate-500">{notification.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
  );
}
