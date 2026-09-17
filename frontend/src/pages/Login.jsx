import { useState } from "react";
import { useTranslation } from "react-i18next";
import { login } from "../services/auth";
import { useNavigate } from "../router";
import { Mail, Lock, Sprout, ArrowRight } from "lucide-react";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login({
        email: email.trim().toLowerCase(),
        password
      });

      window.location.href = "/";
    } catch (err) {
      let errMsg = err.response?.data?.error || err.response?.data?.message;
      if (!errMsg && typeof err.response?.data === "string" && err.response.data.trim()) {
        errMsg = err.response.data.length < 150 ? err.response.data : `Server error (${err.response.status})`;
      }
      if (!errMsg && err.message) {
        errMsg = err.message;
      }
      setError(
        typeof errMsg === "string" && errMsg.trim()
          ? errMsg 
          : t("auth.loginFailed", "Invalid email or password.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-12 text-[var(--text)] transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--green)] border border-[var(--border)] mb-3">
            <Sprout className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Crop-Disease-Detection
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Crop Disease Diagnostic System
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          {/* Toggle Switcher */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-[var(--surface-2)] p-1 border border-[var(--border)]">
            <button
              type="button"
              className="rounded-lg bg-[var(--green)] py-2 text-sm font-semibold text-white shadow-sm"
            >
              {t("auth.login", "Login")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-lg py-2 text-sm font-medium text-[var(--text-muted)] transition-all hover:text-[var(--text)]"
            >
              {t("auth.register", "Register")}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t("auth.email", "Email Address")}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-muted)]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--green)] focus:outline-none focus:ring-1 focus:ring-[var(--green)]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t("auth.password", "Password")}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-muted)]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--green)] focus:outline-none focus:ring-1 focus:ring-[var(--green)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center space-x-2 rounded-xl bg-[var(--green)] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--green-dark)] focus:outline-none disabled:opacity-50"
            >
              <span>{loading ? t("buttons.loggingIn", "Logging in...") : t("auth.login", "Login")}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Toggle link at bottom */}
          <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
            {t("auth.dontHaveAccount", "Don't have an account?")}{" "}
            <button
              type="button"
              className="font-semibold text-[var(--green)] hover:underline focus:outline-none"
              onClick={() => navigate("/register")}
            >
              {t("auth.register", "Register")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}