import { useState } from "react";
import { useTranslation } from "react-i18next";
import { login } from "../services/auth";

export default function Login() {

    const { t } = useTranslation();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {

        e.preventDefault();

        try {

            setLoading(true);

            await login({

                email,

                password

            });

            window.location.href = "/";

        }

        catch (err) {

            alert(

                err.response?.data?.error ||

                t("auth.loginFailed")

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="flex min-h-screen items-center justify-center bg-slate-100">

            <form

                onSubmit={handleLogin}

                className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"

            >

                <h1 className="mb-8 text-3xl font-bold">

                    {t("pages.login")}

                </h1>

                <input

                    className="mb-4 w-full rounded-lg border p-3"

                    placeholder={t("auth.email")}

                    value={email}

                    onChange={(e)=>setEmail(e.target.value)}

                />

                <input

                    type="password"

                    className="mb-6 w-full rounded-lg border p-3"

                    placeholder={t("auth.password")}

                    value={password}

                    onChange={(e)=>setPassword(e.target.value)}

                />

                <button

                    className="w-full rounded-lg bg-blue-600 py-3 text-white"

                    disabled={loading}

                >

                    {

                        loading

                        ?

                        t("buttons.loggingIn")

                        :

                        t("buttons.login")

                    }

                </button>

            </form>

        </div>

    );

}