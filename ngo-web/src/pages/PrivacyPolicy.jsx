import React, {useEffect} from "react";
import PolicyHero from "../components/PolicyHero";

const PrivacyPolicy = () => {

  useEffect(() => {
    document.title = 'Privacy Policy';
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
        <PolicyHero
        type="privacy"
        title="Privacy Policy"
        subtitle="How Swadhyay Seva Foundation collects, uses, and protects your information."
      />
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <p className="text-sm text-slate-500 mb-8">
          Last updated: 17 February 2026
        </p>

        <div className="space-y-6 text-sm md:text-base text-slate-800 leading-relaxed">
          <p>
            Swadhyay Seva Foundation (“we”, “us”, “our”) is a charitable trust
            registered in India and operates the website{" "}
            <a
              href="https://www.swadhyayseva.org"
              className="text-emerald-700 underline"
            >
              https://www.swadhyayseva.org
            </a>
            . This Privacy Policy explains how we collect, use, store, and
            protect personal information of donors, members, quiz participants,
            and visitors to our websites.
          </p>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">1. Scope</h2>
            <p>
              This Policy applies to information collected through our website
              and online forms on{" "}
              <a
                href="https://www.swadhyayseva.org"
                className="text-emerald-700 underline"
              >
                https://www.swadhyayseva.org
              </a>
              , donation and membership payments processed via our payment
              gateway partner Razorpay, and communication channels such as email
              and SMS related to our programmes and donations.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              2. Information we collect
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Identity details: name, title, gender (if provided).
              </li>
              <li>
                Contact details: address, email address, mobile number.
              </li>
              <li>
                Donation and membership details: donation amount, date and time,
                payment method, transaction ID, membership plan and duration.
              </li>
              <li>
                Tax‑related details: PAN, Aadhaar (if provided for 80G
                receipts), and any details required under applicable Indian tax
                laws.
              </li>
              <li>
                Technical data: IP address, browser type, device information,
                and usage data collected via cookies and Google Analytics.
              </li>
            </ul>
            <p className="mt-2">
              We do not intentionally collect personal data from children below
              18 years except through their parent/guardian or school
              authorities for quiz registration.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              3. How we collect information
            </h2>
            <p>
              We collect information when you make a donation or membership
              payment, register for quizzes or initiatives, subscribe to
              updates, contact us by email or phone, or interact with our
              websites where limited technical data is collected via cookies and
              analytics tools such as Google Analytics.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              4. Use of information
            </h2>
            <p className="mb-2">
              We use personal information to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Process and acknowledge donations and membership payments.</li>
              <li>Issue donation receipts, including 80G receipts as applicable.</li>
              <li>
                Register and manage participation in quizzes and other
                programmes.
              </li>
              <li>
                Communicate confirmations, updates, impact stories, and
                programme information via email/SMS.
              </li>
              <li>
                Comply with legal, regulatory, and accounting obligations.
              </li>
              <li>
                Improve our websites and user experience using aggregated
                analytics data.
              </li>
            </ul>
            <p className="mt-2">
              We do not sell or rent your personal data to any third parties.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              5. Sharing of information
            </h2>
            <p className="mb-2">
              We may share personal information only as necessary with:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Razorpay for securely processing online payments.</li>
              <li>
                Email and communication service providers used to send
                confirmations and updates.
              </li>
              <li>
                Government authorities or regulators where required by law or to
                comply with legal obligations.
              </li>
            </ul>
            <p className="mt-2">
              Online payments are processed on Razorpay’s secure, PCI DSS
              compliant platforms. Your card, bank, and UPI details are
              collected and processed directly by Razorpay and are not stored on
              our servers.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              6. Data retention
            </h2>
            <p>
              We retain donor, membership, and transaction records for as long
              as required by applicable laws in India, including tax and
              regulatory requirements. After the retention period, data may be
              securely deleted, anonymised, or archived as per our internal
              policies.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">7. Your rights</h2>
            <p className="mb-2">
              Subject to applicable law, you may request access, correction or
              updating, deletion where legally permissible, and opt out of
              non‑essential emails or SMS communications.
            </p>
            <p>
              To exercise these rights, please email us at{" "}
              <a
                href="mailto:swadhyaysevafoundation@gmail.com"
                className="text-emerald-700 underline"
              >
                swadhyaysevafoundation@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              8. Cookies and analytics
            </h2>
            <p>
              We use Google Analytics and similar tools to understand how
              visitors use our websites. This information is collected in
              aggregated form and does not directly identify you. You can
              control cookies through your browser settings, though disabling
              cookies may impact some website features.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">9. Security</h2>
            <p>
              We implement reasonable technical and organisational measures to
              protect your personal information from unauthorised access, loss,
              misuse, or alteration. However, no system is fully secure, and we
              cannot guarantee absolute security of data transmitted over the
              internet.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              10. Third‑party links
            </h2>
            <p>
              Our websites may contain links to third‑party websites, including
              payment gateways and partner platforms. We are not responsible for
              the privacy practices or content of those websites and encourage
              you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              11. Grievance and contact
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or
              our handling of personal data, please contact:
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

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              12. Changes to this Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. The updated Policy
              will be posted on our websites with a revised “Last updated” date.
              Continued use of our websites after such changes constitutes your
              acceptance of the updated Policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
