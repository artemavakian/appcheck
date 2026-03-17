export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <a
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          &larr; Back to AppCheck
        </a>

        <h1 className="mt-8 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-400">Last Updated: March 2026</p>

        <div className="mt-10 prose prose-gray max-w-none text-gray-600 text-[15px] leading-relaxed space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Overview</h2>
            <p>AppCheck respects your privacy and is committed to protecting your information.</p>
            <p>This Privacy Policy explains how information is collected, used, and stored when you use the AppCheck service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Information We Collect</h2>

            <h3 className="text-base font-medium text-gray-800 mt-4">Account Information</h3>
            <p>When you sign in using Sign in with Apple, we may receive:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your email address (or Apple private relay email)</li>
              <li>A unique Apple account identifier</li>
            </ul>
            <p>This information is used solely to create and manage your account.</p>

            <h3 className="text-base font-medium text-gray-800 mt-4">App Submission Information</h3>
            <p>When using AppCheck, you may submit information including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>App name</li>
              <li>Questionnaire responses</li>
              <li>App Store description text</li>
              <li>Uploaded screenshots or promotional images</li>
            </ul>
            <p>This information is used only to generate your AppCheck analysis report.</p>

            <h3 className="text-base font-medium text-gray-800 mt-4">Payment Information</h3>
            <p>Payments for AppCheck scan credits are processed by Stripe.</p>
            <p>AppCheck does not collect or store payment card information.</p>
            <p>Stripe may collect payment information according to its own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. How We Use Information</h2>
            <p>Information collected may be used to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide the AppCheck analysis service</li>
              <li>Generate and store analysis reports</li>
              <li>Manage user accounts</li>
              <li>Process purchases of scan credits</li>
              <li>Improve the functionality of the Service</li>
            </ul>
            <p>We do not sell, rent, or trade personal information.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Data Storage</h2>
            <p>User data, including reports and submitted content, may be stored on secure servers in order to provide access to previous reports and account history.</p>
            <p>We take reasonable measures to protect stored information from unauthorized access.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Data Sharing</h2>
            <p>AppCheck does not share personal information with third parties except when necessary to operate the Service, such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payment processing through Stripe</li>
              <li>Infrastructure providers used to host the application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Data Retention</h2>
            <p>Information submitted to the Service may be retained to allow users to access past analysis reports.</p>
            <p>Users may request deletion of their account and associated data by contacting support.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Security</h2>
            <p>AppCheck implements reasonable technical and organizational safeguards designed to protect user data.</p>
            <p>However, no internet transmission or storage system can be guaranteed to be completely secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Children&rsquo;s Privacy</h2>
            <p>AppCheck is not intended for use by individuals under the age of 13.</p>
            <p>We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Changes to this Privacy Policy</h2>
            <p>AppCheck may update this Privacy Policy from time to time.</p>
            <p>Updates will be posted on this page with a revised date.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. Contact</h2>
            <p>If you have questions about this Privacy Policy, please contact:</p>
            <p><a href="mailto:support@appcheck.dev" className="text-apple-blue hover:underline">support@appcheck.dev</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
