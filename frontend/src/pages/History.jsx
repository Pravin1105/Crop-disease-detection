import { useEffect, useState } from "react";
import { useNavigate } from "../router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import Header from "../components/layout/Header";
import { getHistory } from "../services/history";
import { API_BASE_URL } from "../config";

export default function History() {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const settings = (() => {
        try {
            return JSON.parse(localStorage.getItem("app_settings") || "{}") || {};
        } catch {
            return {};
        }
    })();

    const threshold = typeof settings.confidenceThreshold === "number" ? settings.confidenceThreshold : 0.85;
    const thresholdPercent = threshold <= 1 ? threshold * 100 : threshold;

    const getHistoryLabel = (prediction, confidence) => {
        if (confidence < thresholdPercent) {
            return t("history.diseaseNotDetected", { prediction });
        }
        return prediction;
    };

    useEffect(() => {
        async function loadHistory() {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
                <Header />
                <div className="flex h-[70vh] items-center justify-center">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                        {t("profile.loading")}
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
            <Header />

            <main className="mx-auto max-w-7xl px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                >
                    <ArrowLeft size={18} />
                    {t("history.backToDashboard")}
                </button>

                {/* Title */}
                <h1 className="mb-8 text-3xl font-bold text-[var(--text)]">
                    {t("pages.predictionHistory")}
                </h1>

                {/* Empty History */}
                {history.length === 0 ? (
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center shadow-sm">
                        <h2 className="text-2xl font-semibold text-[var(--text)]">
                            {t("pages.noPredictions")}
                        </h2>
                        <p className="mt-2 text-[var(--text-muted)]">
                            {t("pages.uploadStart")}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                        <table className="w-full border-collapse">
                            <thead className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-[var(--text)]">
                                        {t("history.image")}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-[var(--text)]">
                                        {t("history.prediction")}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-[var(--text)]">
                                        {t("history.confidence")}
                                    </th>
                                    <th className="p-4 text-left font-semibold text-[var(--text)]">
                                        {t("history.date")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {history.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => navigate(`/history/${item.id}`)}
                                        className="cursor-pointer transition hover:bg-[var(--surface-2)]"
                                    >
                                        <td className="p-4">
                                            <img
                                                src={`${API_BASE_URL}${item.image}`}
                                                alt="Leaf"
                                                className="h-16 w-16 rounded-xl object-cover border border-[var(--border)]"
                                            />
                                        </td>
                                        <td className="p-4 text-base font-semibold text-[var(--text)]">
                                            {getHistoryLabel(item.prediction, item.confidence)}
                                        </td>
                                        <td className="p-4 font-bold text-[var(--green)]">
                                            {item.confidence.toFixed(2)}%
                                        </td>
                                        <td className="p-4 text-sm text-[var(--text-muted)]">
                                            {new Date(item.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
