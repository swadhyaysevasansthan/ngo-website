import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const RegistrationClosed = () => {
  useEffect(() => {
    document.title = "Registration Closed | SNPC 2026";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-2xl">
          {/* Background Decorations */}
          <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-amber-300/20 blur-3xl" />

          <div className="relative px-6 py-12 md:px-14 md:py-16 text-center">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-5xl shadow-sm">
              📸
            </div>

            {/* Badge */}
            <span className="inline-flex items-center rounded-full bg-red-100 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
              Registration Closed
            </span>

            {/* Heading */}
            <h1 className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Registration for
              <span className="block text-emerald-700">
                SNPC 2026 Has Concluded
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              Thank you for the overwhelming response to the
              <strong> Swadhyay National Photography Competition 2026.</strong>
              <br />
              The registration period has officially ended, and we are no longer
              accepting new participants.
            </p>

            {/* Important Notice */}
            <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-left shadow-sm">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📧</div>

                <div>
                  <h2 className="text-xl font-bold text-emerald-800">
                    For Registered Participants
                  </h2>

                  <p className="mt-3 leading-7 text-slate-700">
                    All registered participants have already received an email containing
                    the photograph submission guidelines, submission link, and important
                    instructions.
                  </p>

                  <div className="mt-5 rounded-xl border border-emerald-200 bg-white px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      📅 Photo Submission Deadline
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-emerald-700">
                      7 July 2026
                    </p>

                    <p className="mt-2 text-slate-600">
                      Please submit your photographs before the deadline using the link
                      provided in your registration confirmation email.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Box */}
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-left">
              <h3 className="text-lg font-bold text-amber-800">
                What's Next?
              </h3>

              <ul className="mt-4 space-y-3 text-slate-700">
                <li>
                  • Registration has now closed for all new participants.
                </li>

                <li>
                  • Registered participants may continue submitting entries
                  until <strong>7 July 2026</strong>.
                </li>

                <li>
                  • All photographs will be evaluated by our expert jury after
                  the submission deadline.
                </li>

                <li>
                  • Results and winners will be announced on our official
                  website and social media platforms.
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

              <Link
                to="/photography-competition"
                className="inline-flex min-w-[230px] items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Competition Details
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-12 border-t border-slate-200 pt-8">
              <p className="text-sm leading-7 text-slate-500 md:text-base">
                We sincerely thank every participant for being a part of the
                <strong> Swadhyay National Photography Competition 2026.</strong>
                <br />
                We look forward to receiving your outstanding photographs and
                wish you the very best.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegistrationClosed;