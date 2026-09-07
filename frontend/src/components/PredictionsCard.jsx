import { useTranslation } from "react-i18next";
import Card from "./ui/Card.jsx";

const colorStyles = [
  {
    badge: "from-emerald-400 to-emerald-600",
    bar: "bg-[var(--green)]",
    text: "text-[var(--green)]",
  },
  {
    badge: "from-sky-400 to-blue-600",
    bar: "bg-sky-500",
    text: "text-sky-500",
  },
  {
    badge: "from-violet-400 to-purple-600",
    bar: "bg-violet-500",
    text: "text-violet-500",
  },
];

export default function PredictionsCard({ prediction, loading }) {
  const { t } = useTranslation();
  const predictions = prediction?.top3 || [];

  const settings = (() => {
    try {
      return JSON.parse(localStorage.getItem("app_settings") || "{}") || {};
    } catch {
      return {};
    }
  })();

  const threshold = typeof settings.confidenceThreshold === "number" ? settings.confidenceThreshold : 0.85;
  const thresholdPercent = threshold <= 1 ? threshold * 100 : threshold;
  const highestConfidence = predictions.length ? Math.max(...predictions.map((item) => item.confidence)) : 0;
  const lowConfidence = predictions.length > 0 && highestConfidence < thresholdPercent;

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-normal text-[var(--text)]">
        Top 3 Predictions
      </h2>

      {loading && (
        <div className="mt-10 text-center text-[var(--text-muted)]">
          {t("pages.runningPrediction")}
        </div>
      )}

      {!loading && predictions.length === 0 && (
        <div className="mt-10 text-center text-[var(--text-muted)]">
          {t("pages.noPrediction")}
        </div>
      )}

      {!loading && lowConfidence && (
        <div className="mt-10 text-center text-[var(--text-muted)]">
          {t("pages.lowConfidence")}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {(!lowConfidence ? predictions : []).map((item, index) => {
          const styles = colorStyles[index] || colorStyles[0];

          return (
            <article
              key={index}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-base font-bold text-white shadow-md ${styles.badge}`}
                >
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="truncate text-base font-semibold text-[var(--text)]">
                      {item.class}
                    </h3>

                    <p className={`shrink-0 text-base font-semibold ${styles.text}`}>
                      {item.confidence.toFixed(2)}%
                    </p>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface)] border border-[var(--border)]">
                    <div
                      className={`h-full rounded-full ${styles.bar}`}
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}