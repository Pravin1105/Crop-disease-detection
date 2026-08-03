// import { HeartPulse } from "lucide-react";
// import Card from "./ui/Card.jsx";

// export default function DiseaseDetails() {
//   return (
//     <Card className="overflow-hidden p-5 sm:p-6">
//       <h2 className="text-xl font-semibold tracking-normal text-slate-950">
//         Details of the Disease
//       </h2>

//       <div className="relative mt-5 grid gap-8 lg:grid-cols-[1fr_1fr_260px]">
//         <div>
//           <InfoBlock title="Overview">
//             This disease affects the body in various ways and may lead to serious
//             complications if not treated early.
//           </InfoBlock>

//           <div className="mt-7">
//             <h3 className="text-base font-semibold text-blue-700">Symptoms</h3>
//             <ul className="mt-3 space-y-2 text-base text-muted">
//               <li className="flex gap-3">
//                 <span aria-hidden="true">•</span>
//                 <span>Symptom 1</span>
//               </li>
//               <li className="flex gap-3">
//                 <span aria-hidden="true">•</span>
//                 <span>Symptom 2</span>
//               </li>
//               <li className="flex gap-3">
//                 <span aria-hidden="true">•</span>
//                 <span>Symptom 3</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
//           <InfoBlock title="Causes">
//             The exact cause is unknown but it may be related to genetics,
//             environmental factors, or lifestyle.
//           </InfoBlock>

//           <div className="mt-5">
//             <InfoBlock title="Prevention">
//               Maintain a healthy lifestyle, eat balanced diet, exercise regularly
//               and avoid stress.
//             </InfoBlock>
//           </div>
//         </div>

//         <div className="hidden items-center justify-center lg:flex">
//           <HeartPulse
//             aria-hidden="true"
//             className="h-40 w-40 text-blue-100"
//             strokeWidth={1.3}
//           />
//         </div>
//       </div>
//     </Card>
//   );
// }

// function InfoBlock({ title, children }) {
//   return (
//     <section>
//       <h3 className="text-base font-semibold text-blue-700">{title}</h3>
//       <p className="mt-3 max-w-[34rem] text-base leading-7 text-muted">{children}</p>
//     </section>
//   );
// }


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

            <h2 className="text-xl font-semibold tracking-normal text-slate-950">

                {t("diseaseDetails.diseaseDetails")}

            </h2>

            {

                !details ?

                (

                    <div className="flex h-72 flex-col items-center justify-center">

                        <Leaf

                            className="h-24 w-24 text-green-200"

                            strokeWidth={1.2}

                        />

                        <p className="mt-4 text-slate-400">
 
                            {lowConfidence ? t("pages.lowConfidenceDetails") : t("pages.uploadToViewDetails")}
 
                        </p>

                    </div>

                )

                :

                (

                    <div className="relative mt-5 grid gap-8 lg:grid-cols-[1fr_1fr_260px]">

                        {/* LEFT */}

                        <div>

                            <InfoBlock title={t("diseaseDetails.description")}> 

                                {details.description}

                            </InfoBlock>

                            <div className="mt-7">

                                <h3 className="text-base font-semibold text-green-700">

                                    {t("diseaseDetails.symptoms")}

                                </h3>

                                <ul className="mt-3 space-y-2 text-base text-muted">

                                    {

                                        details.symptoms.map((item,index)=>(

                                            <li

                                                key={index}

                                                className="flex gap-3"

                                            >

                                                <span>•</span>

                                                <span>{item}</span>

                                            </li>

                                        ))

                                    }

                                </ul>

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">

                            <div>
 
                                <h3 className="text-base font-semibold text-green-700">
 
                                    {t("diseaseDetails.causes")}
 
                                </h3>

                                <ul className="mt-3 space-y-2 text-base text-muted">

                                    {

                                        details.causes.map((item,index)=>(

                                            <li

                                                key={index}

                                                className="flex gap-3"

                                            >

                                                <span>•</span>

                                                <span>{item}</span>

                                            </li>

                                        ))

                                    }

                                </ul>

                            </div>

                            <div className="mt-6">
 
                                <h3 className="text-base font-semibold text-green-700">
 
                                    {t("diseaseDetails.treatment")}
 
                                </h3>

                                <ul className="mt-3 space-y-2 text-base text-muted">

                                    {

                                        details.treatment.map((item,index)=>(

                                            <li

                                                key={index}

                                                className="flex gap-3"

                                            >

                                                <span>•</span>

                                                <span>{item}</span>

                                            </li>

                                        ))

                                    }

                                </ul>

                            </div>

                            <div className="mt-6">
 
                                <h3 className="text-base font-semibold text-green-700">
 
                                    {t("diseaseDetails.prevention")}
 
                                </h3>

                                <ul className="mt-3 space-y-2 text-base text-muted">

                                    {

                                        details.prevention.map((item,index)=>(

                                            <li

                                                key={index}

                                                className="flex gap-3"

                                            >

                                                <span>•</span>

                                                <span>{item}</span>

                                            </li>

                                        ))

                                    }

                                </ul>

                            </div>

                        </div>

                        {/* ICON */}

                        <div className="hidden items-center justify-center lg:flex">

                            <Leaf

                                className="h-40 w-40 text-green-100"

                                strokeWidth={1.2}

                            />

                        </div>

                    </div>

                )

            }

        </Card>

    );

}

function InfoBlock({ title, children }) {

    return (

        <section>

            <h3 className="text-base font-semibold text-green-700">

                {title}

            </h3>

            <p className="mt-3 max-w-[34rem] text-base leading-7 text-muted">

                {children}

            </p>

        </section>

    );

}