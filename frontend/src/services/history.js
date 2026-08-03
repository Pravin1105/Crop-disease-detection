import api from "./api";

export async function getHistory() {

    const response = await api.get("/history");

    return response.data;

}

export async function getPrediction(id) {

    const response = await api.get(`/history/${id}`);

    return response.data;

}