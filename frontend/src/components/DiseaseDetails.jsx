import { Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./ui/Card.jsx";

export default function DiseaseDetails({ prediction }) {
  const { t } = useTranslation();

  const settings = (() => {
    try {
      return JSON.parse(localStorage.getItem("app_settings") || "{}") || {};
    } catch {
      return {};
    }
  })();

  const threshold = typeof settings.confidenceThreshold === "number" ? settings.confidenceThreshold : 0.85;
  const thresholdPercent = threshold <= 1 ? threshold * 100 : threshold;
  const predictions = prediction?.top3 || [];
  const highestConfidence = predictions.length ? Math.max(...predictions.map((item) => item.confidence)) : 0;
  const lowConfidence = predictions.length > 0 && highestConfidence < thresholdPercent;
  const details = !lowConfidence ? prediction?.details : null;

  return (
    <Card className="overflow-hidden p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-normal text-[var(--text)]">
        {t("diseaseDetails.diseaseDetails")}
      </h2>

      {!details ? (
        <div className="flex h-64 flex-col items-center justify-center">
          <Leaf
            className="h-20 w-20 text-[var(--green)] opacity-40"
            strokeWidth={1.2}
          />
          <p className="mt-4 text-[var(--text-muted)]">
            {lowConfidence ? t("pages.lowConfidenceDetails") : t("pages.uploadToViewDetails")}
          </p>
        </div>
      ) : (
        <div className="relative mt-5 grid gap-8 lg:grid-cols-[1fr_1fr_260px]">
          {/* LEFT */}
          <div>
            <InfoBlock title={t("diseaseDetails.description")}>
              {details.description}
            </InfoBlock>

            <div className="mt-7">
              <h3 className="text-base font-semibold text-[var(--green)]">
                {t("diseaseDetails.symptoms")}
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {details.symptoms.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT */}
          <div className="border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <div>
              <h3 className="text-base font-semibold text-[var(--green)]">
                {t("diseaseDetails.causes")}
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {details.causes.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold text-[var(--green)]">
                {t("diseaseDetails.treatment")}
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {details.treatment.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold text-[var(--green)]">
                {t("diseaseDetails.prevention")}
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                {details.prevention.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ICON */}
          <div className="hidden items-center justify-center lg:flex">
            <Leaf
              className="h-36 w-36 text-[var(--green)] opacity-20"
              strokeWidth={1.2}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

function InfoBlock({ title, children }) {
  return (
    <section>
      <h3 className="text-base font-semibold text-[var(--green)]">{title}</h3>
      <p className="mt-3 max-w-[34rem] text-sm leading-7 text-[var(--text-muted)]">{children}</p>
    </section>
  );
}