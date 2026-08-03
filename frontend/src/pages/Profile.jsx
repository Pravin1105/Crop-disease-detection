import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ArrowLeft, UserCircle2 } from "lucide-react";

import { getProfile } from "../services/profile";

export default function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    //------------------------------------------------------

    useEffect(() => {

        async function loadProfile() {

            try {

                const data = await getProfile();

                setUser(data);

            }

            catch (err) {

                console.error(err);

            }

        }

        loadProfile();

    }, []);

    //------------------------------------------------------

    if (!user) {

        return (

            <div className="flex h-[70vh] items-center justify-center">

                {t("profile.loading")}

            </div>

        );

    }

    //------------------------------------------------------

    return (

        <>

            <main className="min-h-screen bg-slate-100">

                <div className="mx-auto max-w-5xl px-8 py-8">

                    <button

                        onClick={() => navigate("/")}

                        className="mb-8 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 shadow-sm transition hover:bg-slate-100"

                    >

                        <ArrowLeft size={18} />

                        {t("buttons.backToDashboard")}

                    </button>

                    <h1 className="mb-8 text-4xl font-bold">

                        {t("pages.profile")}

                    </h1>

                    <div className="rounded-2xl bg-white p-8 shadow">

                        <div className="flex items-center gap-8">

                            <UserCircle2

                                size={120}

                                className="text-blue-600"

                            />

                            <div className="space-y-5">

                                <div>

                                    <p className="text-sm text-slate-500">

                                        {t("profile.name")}

                                    </p>

                                    <h2 className="text-2xl font-semibold">

                                    {user.name || user.user_name || user.username}

                                    </h2>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">

                                        {t("profile.username")}

                                    </p>

                                    <p className="text-lg font-medium">

                                        {user.user_name || user.username}

                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">

                                        {t("profile.email")}

                                    </p>

                                    <p className="text-lg">

                                        {user.email}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </>

    );

}