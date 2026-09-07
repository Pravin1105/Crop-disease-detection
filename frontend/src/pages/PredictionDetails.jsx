import { useEffect, useState } from "react";
import { useParams, useNavigate } from "../router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

import Header from "../components/layout/Header";
import { getPrediction } from "../services/history";
import { API_BASE_URL } from "../config";

import PredictionsCard from "../components/PredictionsCard";
import DiseaseDetails from "../components/DiseaseDetails";

export default function PredictionDetails() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPrediction() {
            try {
                const data = await getPrediction(id);
                setPrediction(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadPrediction();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
                <Header />
                <div className="flex h-[70vh] items-center justify-center">
                    <h2 className="text-xl font-semibold text-[var(--text)]">Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors">
            <Header />

            <main className="mx-auto max-w-7xl p-8 space-y-6">
                <button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
                >
                    <ArrowLeft size={18} />
                    {t("buttons.backToHistory")}
                </button>

                {/* Uploaded Image Card */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-[var(--text)]">
                        {t("predictionDetails.uploadedImage")}
                    </h2>
                    <img
                        src={`${API_BASE_URL}${prediction.image}`}
                        alt="Leaf"
                        className="mx-auto max-h-[350px] rounded-lg object-contain border border-[var(--border)] bg-[var(--surface-2)]"
                    />
                </div>

                <PredictionsCard prediction={prediction} loading={false} />
                <DiseaseDetails prediction={prediction} />
            </main>
        </div>
    );
}
