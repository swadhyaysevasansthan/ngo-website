import React, {useEffect} from "react";
import PolicyHero from "../components/PolicyHero";

const RefundPolicy = () => {

    useEffect(() => {
        document.title = 'Refunds & Cancellation Policy';
      }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
        <PolicyHero
        type="refund"
        title="Refund & Cancellation Policy"
        subtitle="Our rules for refunds, cancellations, and correcting payment errors."
      />
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <p className="text-sm text-slate-500 mb-8">
          Last updated: 17 February 2026
        </p>

        <div className="space-y-6 text-sm md:text-base text-slate-800 leading-relaxed">
          <p>
            At Swadhyay Seva Foundation, we deeply appreciate your support
            through donations and memberships. This Refund and Cancellation
            Policy explains the conditions under which refunds may be considered
            for online payments made through our websites.
          </p>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">1. Donations</h2>
            <p className="mb-2">
              All donations made to Swadhyay Seva Foundation are non‑refundable,
              as they are applied towards our charitable activities and
              programmes.
            </p>
            <p className="mb-2">
              An exception may be made in cases of genuine technical error or
              accidental duplicate transaction (for example, the same amount
              charged twice).
            </p>
            <p>
              If you believe a donation was made in error or you notice a
              duplicate transaction, please contact us within 7 days of the
              transaction date with details of the payment.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">2. Memberships</h2>
            <p className="mb-2">
              Membership contributions are generally collected on a monthly
              basis. Once a membership payment for a particular month is
              successfully processed, it cannot be cancelled or refunded for
              that month.
            </p>
            <p>
              You may request that future recurring membership payments be
              stopped or that your membership be discontinued. Such changes will
              apply prospectively and will not affect payments already made.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              3. Payment processing fees
            </h2>
            <p className="mb-2">
              Where any payment processing or convenience fees are charged by
              the payment gateway or bank, such fees may be non‑refundable.
            </p>
            <p>
              In case a refund is approved, the refunded amount may exclude such
              fees, subject to the policies of the payment gateway and banking
              partners.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              4. Refund request process
            </h2>
            <p className="mb-2">
              To request a refund in the limited situations described above,
              please email us with the following details:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Full name</li>
              <li>Date and approximate time of transaction</li>
              <li>Amount donated/paid</li>
              <li>Transaction ID or payment reference (if available)</li>
              <li>Reason for the refund request</li>
            </ul>
            <p className="mt-2">
              Send your request to{" "}
              <a
                href="mailto:swadhyaysevafoundation@gmail.com"
                className="text-emerald-700 underline"
              >
                swadhyaysevafoundation@gmail.com
              </a>
              . We may ask for additional information or documentation as needed
              to verify the request.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              5. Refund timeline and method
            </h2>
            <p className="mb-2">
              Approved refunds will normally be processed within 5–7 business
              days from the date we confirm approval of the refund request.
            </p>
            <p>
              The refunded amount will, as far as possible, be credited to the
              original payment method used during the donation or membership
              payment. The time taken for the amount to reflect in your account
              may vary depending on your bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              6. No cash or third‑party refunds
            </h2>
            <p>
              Refunds, where approved, will not be made in cash or to any person
              or account other than the original payer’s account used for the
              transaction, except where specifically required by law or banking
              rules.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">7. Contact us</h2>
            <p>
              For any questions or concerns regarding this Refund and
              Cancellation Policy, or to raise a refund request, please contact:
            </p>
            <p className="mt-1">
              Swadhyay Seva Foundation<br />
              B‑3/2, 1st Floor, Sector 16, Rohini, Delhi – 110089, India<br />
              Phone: +91 95992 24323<br />
              Email:{" "}
              <a
                href="mailto:swadhyaysevafoundation@gmail.com"
                className="text-emerald-700 underline"
              >
                swadhyaysevafoundation@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default RefundPolicy;
