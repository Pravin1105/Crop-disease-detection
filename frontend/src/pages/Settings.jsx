import { useEffect, useState } from "react";
import { useNavigate } from "../router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { logout } from "../services/auth";
import Header from "../components/layout/Header";

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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Header />

      <main className="mx-auto max-w-5xl px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
        >
          <ArrowLeft size={18} />
          {t("buttons.backToDashboard")}
        </button>

        <h1 className="mb-6 text-3xl font-bold text-[var(--text)]">{t("pages.settings")}</h1>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm space-y-6">
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={!!settings.notifications}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[var(--green)]"
                />
                <span className="text-sm font-medium text-[var(--text)]">{t("pages.inAppNotifications")}</span>
              </label>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t("pages.notificationsHelp")}</p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={!!settings.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[var(--green)]"
                />
                <span className="text-sm font-medium text-[var(--text)]">{t("pages.emailNotifications")}</span>
              </label>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t("pages.emailNotificationsHelp")}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{t("pages.confidenceThreshold")}</label>
              <input
                type="range"
                name="confidenceThreshold"
                min={0}
                max={1}
                step={0.01}
                value={settings.confidenceThreshold}
                onChange={handleChange}
                className="w-full mt-2 accent-[var(--green)]"
              />
              <div className="mt-1 text-xs text-[var(--text-muted)]">{t("pages.confidenceThresholdHelp", { percent: (settings.confidenceThreshold*100).toFixed(0) })}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{t("pages.language")}</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[var(--surface)] text-[var(--text)]">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="pt-4 border-t border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--text)]">{t("pages.account")}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={onLogout} className="rounded-lg bg-[var(--danger)] px-4 py-2 text-xs font-semibold text-white">{t("buttons.logout")}</button>
              <button onClick={() => alert(t("pages.deleteAccountHelp"))} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:border-[var(--danger)]">{t("buttons.deleteAccount")}</button>
            </div>
          </section>

          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div>
              <button onClick={onSave} className="rounded-lg bg-[var(--green)] px-4 py-2 text-xs font-semibold text-white">{t("buttons.saveSettings")}</button>
              <button onClick={onReset} className="ml-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-xs font-semibold text-[var(--text)]">{t("buttons.resetDefaults")}</button>
            </div>

            <div className="text-xs text-[var(--text-muted)]">{saved ? t("pages.settingsSaved") : t("pages.unsavedChanges")}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
