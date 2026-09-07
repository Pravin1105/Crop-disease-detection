import { useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import DiseaseDetails from "../components/DiseaseDetails.jsx";
import PredictionsCard from "../components/PredictionsCard.jsx";
import UploadPanel from "../components/UploadPanel.jsx";

import { isAuthenticated } from "../services/auth";
import Login from "./Login";

export default function Dashboard() {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isAuthenticated()) {
        return <Login />;
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<Header />}
        >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(400px,1.1fr)]">
                <UploadPanel
                    prediction={prediction}
                    setPrediction={setPrediction}
                    loading={loading}
                    setLoading={setLoading}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                />
                <PredictionsCard
                    prediction={prediction}
                    loading={loading}
                />
            </div>
            <DiseaseDetails prediction={prediction} />
        </DashboardLayout>
    );
}