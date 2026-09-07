import {
  Camera,
  History,
  Home,
  Info,
  Phone,
  Settings,
  ShieldCheck,
  UserRound
} from "lucide-react";

export const navItems = [
  { labelKey: "nav.home", icon: Home, path: "/" },
  { labelKey: "nav.history", icon: History, path: "/history" },
  { labelKey: "nav.profile", icon: UserRound, path: "/profile" },
  { labelKey: "nav.settings", icon: Settings, path: "/settings" }
];

export const predictions = [
  { id: 1, label: "Disease Name 1", percent: 92.4, color: "emerald" },
  { id: 2, label: "Disease Name 2", percent: 73.6, color: "blue" },
  { id: 3, label: "Disease Name 3", percent: 45.1, color: "violet" }
];

export const bottomNavItems = [
  { label: "Info", icon: Info },
  { label: "Contact", icon: Phone },
  { label: "Photo / Cam", icon: Camera },
  { label: "History", icon: History }
];

export const support = {
  icon: ShieldCheck,
  titleKey: "support.title",
  copyKey: "support.copy"
};
