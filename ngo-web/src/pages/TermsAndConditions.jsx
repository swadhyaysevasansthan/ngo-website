import React, {useEffect} from "react";
import PolicyHero from "../components/PolicyHero";

const TermsAndConditions = () => {

    useEffect(() => {
        document.title = 'Terms & Conditions';
      }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
        <PolicyHero
        type="terms"
        title="Terms & Conditions"
        subtitle="Guidelines for using our website, donations, quizzes, and programmes."
      />
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <p className="text-sm text-slate-500 mb-8">
          Last updated: 17 February 2026
        </p>

        <div className="space-y-6 text-sm md:text-base text-slate-800 leading-relaxed">
          <p>
            These Terms and Conditions (“Terms”) govern your use of the website{" "}
            <a
              href="https://www.swadhyayseva.org"
              className="text-emerald-700 underline"
            >
              https://www.swadhyayseva.org
            </a>{" "}
            (“Website”) operated by Swadhyay Seva Foundation, a charitable trust
            registered in India. By accessing or using the Website, you agree to
            these Terms. If you do not agree, please do not use the Website.
          </p>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              1. About the Organisation
            </h2>
            <p>
              Swadhyay Seva Foundation is a registered trust working in the
              areas of education, environment, and social welfare.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              2. Use of the Website
            </h2>
            <p className="mb-2">
              You may use the Website to learn about our work, participate in
              quizzes and programmes, and make donations or membership payments.
            </p>
            <p className="mb-2">
              You agree not to misuse the Website, including by attempting
              unauthorised access, introducing malicious code, or engaging in
              any activity that disrupts or harms the Website or other users.
            </p>
            <p>
              You agree to provide accurate and complete information when
              submitting forms, making donations, or registering for quizzes or
              membership.
            </p>
            <p className="mt-3 font-semibold text-slate-900">
              Use by minors
            </p>
            <p>
              If you are under 18 years of age, you may use the Website only
              with the involvement and consent of a parent or legal guardian, in
              line with Indian contract principles regarding minors.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              3. Donations and memberships
            </h2>
            <p className="mb-2">
              All donations and membership contributions made through the
              Website are voluntary and are used to support the objectives and
              activities of Swadhyay Seva Foundation.
            </p>
            <p className="mb-2">
              Once a donation or membership payment is successfully completed,
              it is treated as final and non‑refundable, except in the limited
              cases described in our Refund and Cancellation Policy.
            </p>
            <p>
              We reserve the right to reject or cancel any transaction in case
              of suspected fraud, unauthorised activity, or errors, and to
              refund such amounts if appropriate.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              4. Online payments
            </h2>
            <p className="mb-2">
              Online payments on the Website are processed through Razorpay, a
              third‑party payment gateway service. By proceeding to make a
              payment, you also agree to be bound by Razorpay’s applicable terms
              and policies, in addition to these Terms.
            </p>
            <p className="mb-2">
              Razorpay is a PCI DSS‑compliant payment gateway. Your card, UPI,
              and bank details are processed on Razorpay’s secure servers and
              are not stored by Swadhyay Seva Foundation.
            </p>
            <p>
              We are not responsible for any technical issues, downtime, or
              failures on the part of Razorpay or your bank, though we will make
              reasonable efforts to support resolution of payment issues.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              5. 80G receipts and documentation
            </h2>
            <p className="mb-2">
              Swadhyay Seva Foundation issues donation receipts for all
              successful donations. For donors who provide the required
              information, we will issue 80G‑eligible receipts as per applicable
              registration and income‑tax rules.
            </p>
            <p>
              Receipts may be generated automatically and sent to your
              registered email address. If you do not receive your receipt,
              please contact us with transaction details.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              6. Intellectual property
            </h2>
            <p className="mb-2">
              Unless otherwise stated, all content on the Website, including
              text, graphics, logos, images, quiz content, and other material,
              is owned or licensed by Swadhyay Seva Foundation.
            </p>
            <p>
              You may view, download, and print content for personal,
              non‑commercial use related to learning and awareness. You may not
              copy, reproduce, modify, distribute, or publish any content from
              the Website for commercial purposes without our prior written
              consent.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              7. Quiz participation and content
            </h2>
            <p className="mb-2">
              Quiz questions, learning materials, and related content are
              provided for educational and awareness purposes. We reserve the
              right to modify quiz rules, schedules, and content at any time.
            </p>
            <p>
              Any misuse of quiz platforms, such as cheating, unauthorised
              sharing of questions, or impersonation, may lead to
              disqualification.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              8. Educational content and no professional advice
            </h2>
            <p>
              The information and resources on the Website are provided for
              general educational and awareness purposes only and do not
              constitute professional advice. You should exercise your own
              judgment and, where appropriate, seek independent advice from
              qualified professionals. Swadhyay Seva Foundation shall not be
              responsible for any decisions made or actions taken based on the
              information available on the Website.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">9. Communications</h2>
            <p>
              By providing your email address and mobile number, you consent to
              receive transactional messages as well as important updates about
              our programmes. You may opt out of non‑essential communications by
              following unsubscribe instructions or by writing to us. Necessary
              transactional messages will continue.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              10. Website availability
            </h2>
            <p>
              We aim to keep the Website available and functioning smoothly;
              however, we do not guarantee uninterrupted or error‑free access.
              Access may be suspended or restricted temporarily without notice
              for maintenance, upgrades, security updates, or circumstances
              beyond our control.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              11. Disclaimer and limitation of liability
            </h2>
            <p className="mb-2">
              While we try to keep information on the Website accurate and up to
              date, we do not warrant that all content is complete, error‑free,
              or current. Programmes, events, and content may change without
              prior notice.
            </p>
            <p>
              The Website and its content are provided on an “as is” and “as
              available” basis without warranties of any kind. Swadhyay Seva
              Foundation shall not be liable for any loss or damage arising from
              your use of the Website, donations, or participation in
              programmes, except to the extent that such liability cannot be
              excluded under applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">12. Force majeure</h2>
            <p>
              We shall not be liable for any delay or failure in performing our
              obligations under these Terms that results from events beyond our
              reasonable control, including natural disasters, pandemics,
              strikes, government restrictions, internet failures, or payment‑
              gateway disruptions.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">13. Indemnity</h2>
            <p>
              You agree to indemnify and hold harmless Swadhyay Seva
              Foundation, its trustees, employees, and volunteers from and
              against any claims, damages, losses, or expenses arising out of
              your misuse of the Website, violation of these Terms, or
              infringement of any rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              14. Governing law and jurisdiction
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of India. Any disputes shall be subject to the exclusive
              jurisdiction of the courts in Delhi, India.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              15. Changes to these Terms
            </h2>
            <p>
              We may update or modify these Terms from time to time. The updated
              Terms will be posted on the Website with a revised “Last updated”
              date. Continued use of the Website after such changes constitutes
              your acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-1">
              16. Contact information
            </h2>
            <p>
              For any questions about these Terms, donations, memberships, or
              our policies, please contact:
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

export default TermsAndConditions;
