import { navItems, support } from "../../data/dashboard.js";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button.jsx";
import Logo from "./Logo.jsx";

export default function Sidebar() {
  const { t } = useTranslation();
  const SupportIcon = support.icon;

  return (
    <aside className="border-b border-border bg-white px-4 py-6 lg:flex lg:min-h-full lg:flex-col lg:border-b-0 lg:border-r lg:px-6">
      <Logo />

      <nav aria-label="Primary navigation" className="mt-8">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-6">
          {navItems.map(({ labelKey, icon: Icon, path }) => (
            <li key={labelKey}>
              <NavLink
                key={labelKey}
                to={path}
                className={({ isActive }) =>
                  `flex min-h-14 items-center gap-3 rounded-lg px-4 text-base font-medium transition sm:gap-4 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand"
                  }`
                }
              >
                <Icon className="h-6 w-6" strokeWidth={1.8} />
                <span>{t(labelKey)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 hidden rounded-lg border border-border bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)] lg:mt-auto lg:block">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-brand ring-1 ring-blue-100">
          <SupportIcon aria-hidden="true" className="h-8 w-8" strokeWidth={1.7} />
        </div>
        <h2 className="text-lg font-bold text-slate-950">{t(support.titleKey)}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{t(support.copyKey)}</p>
        <a href="mailto:support@cdd.app" className="block mt-5 w-full">
          <Button className="w-full" variant="subtle">
            {t("buttons.contactUs")}
          </Button>
        </a>
      </div>
    </aside>
  );
}
