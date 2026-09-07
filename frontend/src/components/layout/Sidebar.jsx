import { navItems, support } from "../../data/dashboard.js";
import { NavLink } from "../../router";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button.jsx";
import Logo from "./Logo.jsx";

export default function Sidebar() {
  const { t } = useTranslation();
  const SupportIcon = support.icon;

  return (
    <aside className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-6 lg:flex lg:min-h-full lg:flex-col lg:border-b-0 lg:border-r lg:px-6 transition-colors">
      <Logo />

      <nav aria-label="Primary navigation" className="mt-8">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-3">
          {navItems.map(({ labelKey, icon: Icon, path }) => (
            <li key={labelKey}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--surface-2)] text-[var(--green)] border border-[var(--border)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                  }`
                }
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} />
                <span>{t(labelKey)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 lg:mt-auto lg:block">
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-[var(--surface)] text-[var(--green)] border border-[var(--border)]">
          <SupportIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h2 className="text-sm font-bold text-[var(--text)]">{t(support.titleKey)}</h2>
        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{t(support.copyKey)}</p>
        <a href="mailto:support@cdd.app" className="block mt-4 w-full">
          <Button className="w-full text-xs py-2" variant="subtle">
            {t("buttons.contactUs")}
          </Button>
        </a>
      </div>
    </aside>
  );
}
