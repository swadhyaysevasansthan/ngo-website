import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const DonatePage = () => {
  useEffect(() => {
    document.title = 'Donate - Swadhyay Seva Foundation';
  }, []);

  // TODO: Replace this with your actual Razorpay integration
  const handleDonateClick = () => {
    // Example placeholder – integrate Razorpay Checkout or Payment Button here.
    // window.location.href = 'https://rzp.io/l/your-donation-page-slug';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Donate to Swadhyay Seva Foundation
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Your contribution supports free environmental quizzes, awareness programmes,
            and learning resources for school students across India.
          </p>
        </header>

        {/* Main content layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Impact + About */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-emerald-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Why your support matters
              </h2>
              <p className="text-gray-700 mb-4">
                Swadhyay Seva Foundation does not charge any registration fees from
                students or schools for participating in our environmental quiz initiatives.
                Every child gets an equal opportunity to learn, without financial barriers.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Fund the foundation’s operations so we can stay independent and student‑focused.</li>
                <li>Help us reach more schools and organize additional awareness events across India.</li>
                <li>Enable development of new quizzes, learning material, and follow‑up activities.</li>
                <li>Strengthen our long‑term work for environmental awareness and action among young learners.</li>
              </ul>
            </div>


            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-sm text-gray-700">
              <h3 className="text-sm font-semibold text-emerald-800 mb-2">
                Transparency and acknowledgements
              </h3>
              <p className="mb-2">
                All donations are received through a secure payment gateway and are used solely
                for the charitable activities of Swadhyay Seva Foundation in line with our
                objectives.
              </p>
              <p className="mb-1">
                You will receive a confirmation email for every successful donation. If you
                require an 80G receipt (subject to eligibility and registration), please
                share your PAN and contact details along with the donation.
              </p>
              <p>
                For any queries related to donations or receipts, please write to us at{' '}
                <a
                  href="mailto:swadhyaysevafoundation@gmail.com"
                  className="font-semibold text-emerald-700 underline"
                >
                  swadhyaysevafoundation@gmail.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* Right: Donation Box */}
          <aside className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-emerald-100 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Make a donation
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Secure online payment powered by a PCI DSS compliant payment gateway.
              </p>

              {/* Preset amounts */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Choose an amount (₹)
                </p>
                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2500, 5000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className="px-3 py-2 rounded-full border border-emerald-200 text-sm text-emerald-800 hover:bg-emerald-50 focus:outline-none"
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="px-3 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Other amount
                  </button>
                </div>
              </div>

              {/* Donor details note – keep minimal, main collection should happen in Razorpay form */}
              <div className="mb-4 text-xs text-gray-600">
                Final amount and donor details (name, email, phone, PAN if needed)
                will be captured securely on the payment page before you complete
                the donation.
              </div>

              {/* Razorpay Button placeholder */}
              {/* 
                Option 1: Embed a Razorpay "Donations Button" HTML snippet here.
                Option 2: Use a normal button and call Razorpay Checkout in handleDonateClick.
              */}
              <button
                type="button"
                onClick={handleDonateClick}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
              >
                Donate securely
              </button>

              <p className="mt-3 text-[11px] text-gray-500">
                By proceeding, you agree to our{' '}
                <Link
                  to="/terms"
                  className="underline hover:text-gray-700"
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy-policy"
                  className="underline hover:text-gray-700"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              <p className="mt-3 text-[11px] text-gray-500">
                Payments are processed securely by our payment partner; your card,
                UPI, and bank details are handled on their PCI DSS compliant systems.
              </p>
            </div>
          </aside>
        </div>

        {/* Footer text */}
        <p className="mt-10 text-xs text-gray-500 text-center">
          Thank you for considering a contribution. Your support directly fuels
          our growth, sustains our programmes, and helps us conduct more events
          that nurture environmentally conscious citizens.
        </p>
      </div>
    </main>
  );
};

export default DonatePage;
