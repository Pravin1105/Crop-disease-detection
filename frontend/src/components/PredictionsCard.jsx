// import { ChevronRight } from "lucide-react";
// import { predictions } from "../data/dashboard.js";
// import Button from "./ui/Button.jsx";
// import Card from "./ui/Card.jsx";

// const colorStyles = {
//   emerald: {
//     badge: "from-emerald-300 to-emerald-600",
//     bar: "bg-emerald-500",
//     text: "text-emerald-600"
//   },
//   blue: {
//     badge: "from-sky-300 to-blue-600",
//     bar: "bg-blue-600",
//     text: "text-blue-600"
//   },
//   violet: {
//     badge: "from-violet-300 to-violet-600",
//     bar: "bg-violet-500",
//     text: "text-violet-600"
//   }
// };

// export default function PredictionsCard() {
//   return (
//     <Card className="p-5 sm:p-6">
//       <h2 className="text-xl font-semibold tracking-normal text-slate-950">
//         Top 3 Predictions
//       </h2>

//       <div className="mt-6 space-y-3">
//         {predictions.map((prediction) => {
//           const styles = colorStyles[prediction.color];

//           return (
//             <article
//               className="rounded-lg border border-slate-200 bg-white px-4 py-5"
//               key={prediction.id}
//             >
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-base font-bold text-white shadow-md ${styles.badge}`}
//                 >
//                   {prediction.id}
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <div className="flex items-center justify-between gap-4">
//                     <h3 className="truncate text-base font-semibold text-slate-950">
//                       {prediction.label}
//                     </h3>
//                     <p className={`shrink-0 text-base font-semibold ${styles.text}`}>
//                       {prediction.percent.toFixed(1)}%
//                     </p>
//                   </div>
//                   <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
//                     <div
//                       className={`h-full rounded-full ${styles.bar}`}
//                       style={{ width: `${prediction.percent}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </article>
//           );
//         })}
//       </div>

//       <div className="mt-4 flex justify-center">
//         <Button
//           className="min-h-10 min-w-60 px-4"
//           icon={ChevronRight}
//           iconPosition="right"
//           variant="subtle"
//         >
//           View Full Prediction
//         </Button>
//       </div>
//     </Card>
//   );
// }

import { useTranslation } from "react-i18next";
import Card from "./ui/Card.jsx";

const colorStyles = [
  {
    badge: "from-emerald-300 to-emerald-600",
    bar: "bg-emerald-500",
    text: "text-emerald-600",
  },
  {
    badge: "from-sky-300 to-blue-600",
    bar: "bg-blue-600",
    text: "text-blue-600",
  },
  {
    badge: "from-violet-300 to-violet-600",
    bar: "bg-violet-500",
    text: "text-violet-600",
  },
];

export default function PredictionsCard({
 
    prediction,
 
    loading
 
}) {
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

            <h2 className="text-xl font-semibold tracking-normal text-slate-950">

                Top 3 Predictions

            </h2>

            {
 
                loading && (
 
                    <div className="mt-10 text-center text-slate-500">
 
                        {t("pages.runningPrediction")}
 
                    </div>
 
                )
 
            }
 
            {
 
                !loading && predictions.length === 0 && (
 
                    <div className="mt-10 text-center text-slate-400">
 
                        {t("pages.noPrediction")}
 
                    </div>
 
                )
 
            }
 
            {
 
                !loading && lowConfidence && (
 
                    <div className="mt-10 text-center text-slate-500">
 
                        {t("pages.lowConfidence")}
 
                    </div>
 
                )
 
            }

            <div className="mt-6 space-y-3">

                {

                (!lowConfidence ? predictions : []).map((item,index)=>{

                        const styles = colorStyles[index];

                        return(

                            <article

                                key={index}

                                className="rounded-lg border border-slate-200 bg-white px-4 py-5"

                            >

                                <div className="flex items-center gap-4">

                                    <div

                                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-base font-bold text-white shadow-md ${styles.badge}`}

                                    >

                                        {index+1}

                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-center justify-between gap-4">

                                            <h3 className="truncate text-base font-semibold text-slate-950">

                                                {item.class}

                                            </h3>

                                            <p className={`shrink-0 text-base font-semibold ${styles.text}`}>

                                                {item.confidence.toFixed(2)}%

                                            </p>

                                        </div>

                                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">

                                            <div

                                                className={`h-full rounded-full ${styles.bar}`}

                                                style={{

                                                    width:`${item.confidence}%`

                                                }}

                                            />

                                        </div>

                                    </div>

                                </div>

                            </article>

                        );

                    })

                }

            </div>

            {/* <div className="mt-4 flex justify-center">

                <Button

                    className="min-h-10 min-w-60 px-4"

                    icon={ChevronRight}

                    iconPosition="right"

                    variant="subtle"

                >

                    View Full Prediction

                </Button>

            </div> */}

        </Card>

    );

}