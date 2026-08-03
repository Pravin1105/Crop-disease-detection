import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { logout } from "../services/auth";

const DEFAULTS = {
  notifications: true,
  emailNotifications: true,
  confidenceThreshold: 0.85
};

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "hi", label: "हिंदी" },
  { value: "as", label: "অসমীয়া" },
  { value: "bn", label: "বাংলা" },
  { value: "mr", label: "मराठी" },
  { value: "or", label: "ଓଡ଼ିଆ" },
  { value: "ta", label: "தமிழ்" },
  { value: "pa", label: "ਪੰਜਾਬੀ" }
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [language, setLanguage] = useState(i18n.language?.split("-")[0] ?? "en");

  useEffect(() => {
    const raw = localStorage.getItem("app_settings");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSettings(Object.assign({}, DEFAULTS, parsed || {}));
      } catch (e) {
        setSettings(DEFAULTS);
      }
    }
  }, []);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    let val = value;
    if (type === "checkbox") val = checked;
    if (name === "confidenceThreshold") {
      val = parseFloat(value);
      if (Number.isNaN(val)) val = DEFAULTS[name];
      if (val < 0.7 && settings.confidenceThreshold >= 0.7) {
        alert(t("pages.lowConfidenceWarning"));
      }
    }

    const nextSettings = { ...settings, [name]: val };
    setSettings(nextSettings);
    localStorage.setItem("app_settings", JSON.stringify(nextSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLanguageChange(e) {
    const nextLanguage = e.target.value;
    setLanguage(nextLanguage);
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  }

  function onSave() {
    localStorage.setItem("app_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function onReset() {
    setSettings(DEFAULTS);
    localStorage.removeItem("app_settings");
    setSaved(false);
  }

  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 shadow-sm transition hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
          {t("buttons.backToDashboard")}
        </button>

        <h1 className="mb-6 text-4xl font-bold">{t("pages.settings")}</h1>

        <div className="rounded-2xl bg-white p-8 shadow space-y-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={!!settings.notifications}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="ml-2">{t("pages.inAppNotifications")}</span>
              </label>
              <p className="mt-2 text-sm text-slate-500">{t("pages.notificationsHelp")}</p>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={!!settings.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="ml-2">{t("pages.emailNotifications")}</span>
              </label>
              <p className="mt-2 text-sm text-slate-500">{t("pages.emailNotificationsHelp")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">{t("pages.confidenceThreshold")}</label>
              <input
                type="range"
                name="confidenceThreshold"
                min={0}
                max={1}
                step={0.01}
                value={settings.confidenceThreshold}
                onChange={handleChange}
                className="w-full"
              />
              <div className="mt-2 text-sm text-slate-600">{t("pages.confidenceThresholdHelp", { percent: (settings.confidenceThreshold*100).toFixed(0) })}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">{t("pages.language")}</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="mt-2 w-full rounded-lg border p-3"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="pt-4 border-t">
            <h2 className="text-lg font-semibold">{t("pages.account")}</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={onLogout} className="rounded bg-red-600 px-4 py-2 text-white">{t("buttons.logout")}</button>
              <button onClick={() => alert(t("pages.deleteAccountHelp"))} className="rounded border px-4 py-2">{t("buttons.deleteAccount")}</button>
            </div>
          </section>

          <div className="pt-4 border-t flex items-center justify-between">
            <div>
              <button onClick={onSave} className="rounded bg-blue-600 px-4 py-2 text-white">{t("buttons.saveSettings")}</button>
              <button onClick={onReset} className="ml-3 rounded border px-4 py-2">{t("buttons.resetDefaults")}</button>
            </div>

            <div className="text-sm text-slate-600">{saved ? t("pages.settingsSaved") : t("pages.unsavedChanges")}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
