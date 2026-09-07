import { useEffect, useState } from "react";
import { useNavigate } from "../router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, UserCircle2 } from "lucide-react";
import { getProfile } from "../services/profile";
import Header from "../components/layout/Header";

export default function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getProfile();
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        }
        loadProfile();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
                <Header />
                <div className="flex h-[70vh] items-center justify-center">
                    <span className="text-lg font-medium text-[var(--text-muted)]">{t("profile.loading")}</span>
                </div>
            </div>
        );
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

                <h1 className="mb-8 text-3xl font-bold text-[var(--text)]">
                    {t("pages.profile")}
                </h1>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <UserCircle2
                            size={100}
                            className="text-[var(--green)] shrink-0"
                        />
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    {t("profile.name")}
                                </p>
                                <h2 className="text-2xl font-bold text-[var(--text)]">
                                    {user.name || user.user_name || user.username}
                                </h2>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    {t("profile.username")}
                                </p>
                                <p className="text-base font-medium text-[var(--text)]">
                                    {user.user_name || user.username}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    {t("profile.email")}
                                </p>
                                <p className="text-base text-[var(--text)]">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
