import { Camera } from "lucide-react";
import { bottomNavItems } from "../data/dashboard.js";

export default function BottomNav() {
  return (
    <nav
      aria-label="Quick actions"
      className="mx-auto grid w-full max-w-5xl grid-cols-2 items-center gap-3 rounded-lg border border-border bg-white p-3 shadow-panel sm:grid-cols-[1fr_1fr_96px_1fr_1fr]"
    >
      {bottomNavItems.slice(0, 2).map(({ label, icon: Icon }) => (
        <ActionLink Icon={Icon} label={label} key={label} />
      ))}

      <button
        aria-label="Open camera"
        className="order-first col-span-2 mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-white shadow-soft ring-[10px] ring-blue-50 transition hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:order-none sm:col-span-1"
        type="button"
      >
        <Camera aria-hidden="true" className="h-9 w-9" strokeWidth={1.8} />
      </button>

      {bottomNavItems.slice(2).map(({ label, icon: Icon }) => (
        <ActionLink Icon={Icon} label={label} key={label} />
      ))}
    </nav>
  );
}

function ActionLink({ Icon, label }) {
  return (
    <a
      className="flex min-h-14 items-center justify-center gap-3 rounded-lg px-3 text-base font-medium text-slate-600 transition hover:bg-blue-50 hover:text-brand"
      href="#"
    >
      <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
      <span className="whitespace-nowrap">{label}</span>
    </a>
  );
}
