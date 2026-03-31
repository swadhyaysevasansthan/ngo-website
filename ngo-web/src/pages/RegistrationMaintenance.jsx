import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const RegistrationMaintenance = () => {
  useEffect(() => {
    document.title = "Registration Under Maintenance | SNPC 2026";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-2xl">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />

          <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl shadow-sm">
              🚧
            </div>

            <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-800">
              SNPC 2026 Registration
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Registration Page is
              <span className="block text-emerald-700">Under Maintenance</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              We are making a few updates to improve the registration experience.
              Please check back shortly. We apologize for the inconvenience.
            </p>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 md:text-base">
              Registration is temporarily unavailable. Other pages of the website
              are working normally.
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
              >
                Back to Home
              </Link>

              <Link
                to="/photography-competition"
                className="inline-flex min-w-[180px] items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Competition Details
              </Link>
            </div>

            <p className="mt-8 text-xs text-slate-500 md:text-sm">
              Thank you for your patience.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegistrationMaintenance;