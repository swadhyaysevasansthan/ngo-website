import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';



const DonatePage = () => {

    useEffect(() => {
    document.title = 'Testimonials - Swadhyay Seva Foundation';
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Support Swadhyay Seva Foundation
        </h1>

        <p className="text-2xl sm:text-3xl text-emerald-700 font-extrabold mb-4">
            Online donations – coming soon
            </p>

        <p className="text-gray-700 mb-4">
          Swadhyay Seva Foundation does not charge any registration fees from
          students or schools for participating in our environmental quiz
          initiatives. Every child gets an equal opportunity to learn, without
          financial barriers.
        </p>

        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Why your support matters
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Fund the foundation’s operations so we can stay independent and student‑focused.</li>
            <li>Help us reach more schools and organize additional awareness events across India.</li>
            <li>Enable development of new quizzes, learning material, and follow‑up activities.</li>
            <li>Strengthen our long‑term work for environmental awareness and action among young learners.</li>
          </ul>

          <p className="mt-5 text-sm text-gray-600">
            A secure online donation option will be launched soon. Till then,
            you can write to us for donation and bank details at{' '}
            <a
              href="mailto:swadhyaysevafoundation@gmail.com"
              className="font-semibold text-emerald-700 underline"
            >
              swadhyaysevafoundation@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Thank you for considering a contribution. Your support directly fuels
          our growth, sustains our programmes, and helps us conduct more events
          that nurture environmentally conscious citizens.
        </p>
      </div>
    </main>
  );
};

export default DonatePage;
