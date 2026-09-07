import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";

import Button from "./ui/Button.jsx";
import Card from "./ui/Card.jsx";
import UploadIllustration from "./UploadIllustration.jsx";
import api from "../services/api";

export default function UploadPanel({
    prediction,
    setPrediction,
    loading,
    setLoading,
    selectedImage,
    setSelectedImage
}) {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const selectFile = () => {
        inputRef.current.click();
    };

    const handleFileUpload = async (file) => {
        if (!file) return;

        setSelectedImage(file);
        const formData = new FormData();
        formData.append("image", file);

        try {
            setLoading(true);
            const response = await api.post("/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setPrediction(response.data);
        } catch (err) {
            console.error(err);
            alert(t("upload.predictionFailed"));
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = (event) => {
        const file = event.target.files[0];
        handleFileUpload(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        const file = event.dataTransfer.files[0];
        handleFileUpload(file);
    };

    return (
        <Card className="p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-[var(--text)]">Image</h2>

            <div
                onClick={selectFile}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        selectFile();
                    }
                }}
                className={`mt-5 grid min-h-[300px] place-items-center rounded-lg border-2 border-dashed px-5 py-8 text-center cursor-pointer transition-colors ${
                    dragActive 
                        ? "border-[var(--green)] bg-[var(--surface-2)]" 
                        : "border-[var(--border)] bg-[var(--surface-2)]"
                }`}
            >
                {selectedImage ? (
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt={t("upload.imageAlt")}
                        className="max-h-[280px] rounded-lg object-contain"
                    />
                ) : (
                    <div>
                        <UploadIllustration />
                        <p className="mt-3 text-base font-medium text-[var(--text)]">
                            {t("upload.uploadPrompt")}
                        </p>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            {t("upload.acceptedFormats")}
                        </p>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={uploadImage}
            />

            <Button
                icon={Upload}
                className="mt-6 min-w-52"
                onClick={selectFile}
            >
                {loading ? t("pages.runningPrediction") : t("buttons.uploadImage")}
            </Button>
        </Card>
    );
}