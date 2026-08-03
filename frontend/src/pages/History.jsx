// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { getHistory } from "../services/history";

// export default function History() {
//     const navigate = useNavigate();

//     const [history, setHistory] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const navigate = useNavigate();

//     useEffect(() => {

//         async function loadHistory() {

//             try {

//                 const data = await getHistory();

//                 setHistory(data);

//             }

//             catch (err) {

//                 console.error(err);

//             }

//             finally {

//                 setLoading(false);

//             }

//         }

//         loadHistory();

//     }, []);

//     if (loading) {

//         return <h2 className="p-8">Loading...</h2>;

//     }

//     return (

//         <div className="p-8">

//             <h1 className="mb-6 text-3xl font-bold">

//                 Prediction History

//             </h1>

//             <table className="w-full border-collapse rounded-lg overflow-hidden shadow">

//                 <thead className="bg-blue-600 text-white">

//                     <tr>

//                         <th className="p-4 text-left">Image</th>

//                         <th className="p-4 text-left">Prediction</th>

//                         <th className="p-4 text-left">Confidence</th>

//                         <th className="p-4 text-left">Date</th>

//                     </tr>

//                 </thead>

//                 <tbody>

//                     {

//                         history.map((item) => (

//                             <tr

//                                 key={item.id}

//                                 onClick={() => navigate(`/history/${item.id}`)}

//                                 className="cursor-pointer border-b hover:bg-gray-100"

//                             >

//                                 <td className="p-3">

//                                     <img

//                                         src={`http://127.0.0.1:8000${item.image}`}

//                                         alt="leaf"

//                                         className="h-16 w-16 rounded-lg object-cover"

//                                     />

//                                 </td>

//                                 <td className="p-3">

//                                     {item.prediction}

//                                 </td>

//                                 <td className="p-3">

//                                     {item.confidence.toFixed(2)}%

//                                 </td>

//                                 <td className="p-3">

//                                     {

//                                         new Date(item.created_at)

//                                         .toLocaleString()

//                                     }

//                                 </td>

//                             </tr>

//                         ))

//                     }

//                 </tbody>

//             </table>

//         </div>

//     );

// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import Header from "../components/layout/Header";
import { getHistory } from "../services/history";

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
 
    //------------------------------------------------------

    useEffect(() => {

        async function loadHistory() {

            try {

                const data = await getHistory();

                setHistory(data);

            }

            catch (err) {

                console.error(err);

            }

            finally {

                setLoading(false);

            }

        }

        loadHistory();

    }, []);

    //------------------------------------------------------

    if (loading) {

        return (

            <>

                <Header />

                <div className="flex h-[70vh] items-center justify-center">

                    <h2 className="text-xl font-semibold">

                        {t("profile.loading")}

                    </h2>

                </div>

            </>

        );

    }
    //------------------------------------------------------

    return (

        <>

            <Header />

            <main className="min-h-screen bg-slate-100">

                <div className="mx-auto max-w-7xl px-8 py-8">

                    {/* Back Button */}

                    <button

                        onClick={() => navigate("/")}

                        className="mb-6 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-slate-700 shadow-sm transition hover:bg-slate-100"

                    >

                        <ArrowLeft size={18} />

                        {t("history.backToDashboard")}

                    </button>

                    {/* Title */}

                    <h1 className="mb-8 text-4xl font-bold text-slate-900">

                        {t("pages.predictionHistory")}

                    </h1>

                    {/* Empty History */}

                    {

                        history.length === 0 ? (

                            <div className="rounded-xl bg-white p-12 text-center shadow">

                                <h2 className="text-2xl font-semibold">

                                    {t("pages.noPredictions")}

                                </h2>

                                <p className="mt-2 text-slate-500">

                                    {t("pages.uploadStart")}

                                </p>

                            </div>

                        ) : (

                            <div className="overflow-hidden rounded-2xl border bg-white shadow">

                                <table className="w-full">

                                    <thead className="bg-slate-100">

                                        <tr>

                                            <th className="p-5 text-left font-semibold text-slate-700">

                                                {t("history.image")}

                                            </th>

                                            <th className="p-5 text-left font-semibold text-slate-700">

                                                {t("history.prediction")}

                                            </th>

                                            <th className="p-5 text-left font-semibold text-slate-700">

                                                {t("history.confidence")}

                                            </th>

                                            <th className="p-5 text-left font-semibold text-slate-700">

                                                {t("history.date")}

                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            history.map((item) => (

                                                <tr

                                                    key={item.id}

                                                    onClick={() => navigate(`/history/${item.id}`)}

                                                    className="cursor-pointer border-t transition hover:bg-slate-50"

                                                >

                                                    <td className="p-4">

                                                        <img

                                                            src={`http://127.0.0.1:8000${item.image}`}

                                                            alt="Leaf"

                                                            className="h-20 w-20 rounded-xl object-cover shadow"

                                                        />

                                                    </td>

                                                    <td className="p-4 text-lg font-medium">
 
                                                        {getHistoryLabel(item.prediction, item.confidence)}
 
                                                    </td>

                                                    <td className="p-4 font-semibold text-emerald-600">

                                                        {item.confidence.toFixed(2)}%

                                                    </td>

                                                    <td className="p-4 text-slate-600">

                                                        {

                                                            new Date(item.created_at)

                                                                .toLocaleString()

                                                        }

                                                    </td>

                                                </tr>

                                            ))

                                        }

                                    </tbody>

                                </table>

                            </div>

                        )

                    }

                </div>

            </main>

        </>

    );

}