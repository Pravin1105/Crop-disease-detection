import api from "./api";

export async function register(userData) {

    const response = await api.post(

        "/register",

        userData

    );

    return response.data;

}

export async function login(credentials) {

    const response = await api.post(

        "/login",

        credentials

    );

    localStorage.setItem(

        "token",

        response.data.token

    );

    // store username key for compatibility; backend now returns user_name
    localStorage.setItem(

        "username",

        response.data.user_name || response.data.username

    );

    return response.data;

}

export function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("username");

}

export function isAuthenticated() {

    return !!localStorage.getItem("token");

}