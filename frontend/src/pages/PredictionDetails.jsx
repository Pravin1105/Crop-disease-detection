import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import { getPrediction } from "../services/history";

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

            }

            catch (err) {

                console.error(err);

            }

            finally {

                setLoading(false);

            }

        }

        loadPrediction();

    }, [id]);

    if (loading) {

        return <h2 className="p-8">Loading...</h2>;

    }

    return (

    <>

        <Header />

        <div className="mx-auto max-w-7xl p-8">

            <button

                onClick={() => navigate("/history")}

                className="mb-6 flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100"

            >

                <ArrowLeft size={18} />

                {t("buttons.backToHistory")}

            </button>

            {/* Uploaded Image */}

            <div className="mb-8 rounded-xl bg-white p-6 shadow">

                <h2 className="mb-4 text-xl font-semibold">

                    {t("predictionDetails.uploadedImage")}

                </h2>

                <img

                    src={`http://127.0.0.1:8000${prediction.image}`}

                    alt="Leaf"

                    className="mx-auto max-h-[350px] rounded-lg object-contain"

                />

            </div>

            <PredictionsCard

                prediction={prediction}

                loading={false}

            />

            <DiseaseDetails

                prediction={prediction}

            />

        </div>

    </>

);

}