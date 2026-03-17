export default function TermsPage() {
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
          Terms of Use
        </h1>
        <p className="mt-2 text-sm text-gray-400">Last Updated: March 2026</p>

        <div className="mt-10 prose prose-gray max-w-none text-gray-600 text-[15px] leading-relaxed space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p>By accessing or using AppCheck (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Use. If you do not agree to these terms, you may not use the Service.</p>
            <p>AppCheck provides automated analysis tools intended to help developers identify potential issues with mobile app submissions before submitting them to the Apple App Store.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Description of Service</h2>
            <p>AppCheck is an automated software tool that analyzes user-submitted information related to mobile app submissions, including questionnaire responses, screenshots, and App Store descriptions.</p>
            <p>The Service generates a report that highlights potential compliance risks based on publicly known App Store guidelines.</p>
            <p>AppCheck does not guarantee approval of any app submission.</p>
            <p>The analysis provided by the Service is informational only and should not be interpreted as legal or professional advice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. User Accounts</h2>
            <p>To use AppCheck, you must create an account using Sign in with Apple.</p>
            <p>You are responsible for maintaining the security of your account and any activity that occurs under your account.</p>
            <p>You agree to provide accurate information when using the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Payments and Credits</h2>
            <p>AppCheck operates on a credit-based system.</p>
            <p>Users receive one free scan upon account creation. Additional scans may be purchased.</p>
            <p>Payments are processed by Stripe, a third-party payment processor. AppCheck does not store or process payment card information directly.</p>
            <p>All purchases are one-time payments for scan credits.</p>
            <p>Unless required by law, all purchases are non-refundable.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. User Content</h2>
            <p>When using the Service, you may submit information including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>App names</li>
              <li>Questionnaire responses</li>
              <li>App Store descriptions</li>
              <li>App screenshots or promotional images</li>
            </ul>
            <p>You retain ownership of your content.</p>
            <p>By submitting content to AppCheck, you grant AppCheck a limited license to process, analyze, and store the content solely for the purpose of providing the Service.</p>
            <p>AppCheck does not claim ownership of any user-submitted content.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Prohibited Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Submit malicious files or harmful content</li>
              <li>Attempt to interfere with or disrupt the Service</li>
              <li>Reverse engineer or attempt to copy the AppCheck system</li>
              <li>Use the Service in violation of applicable laws</li>
            </ul>
            <p>AppCheck reserves the right to suspend accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Accuracy of Results</h2>
            <p>AppCheck analyzes submissions using automated systems based on known App Store guidelines.</p>
            <p>Because App Store policies may change and because review decisions are made by Apple reviewers, AppCheck cannot guarantee:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>App approval</li>
              <li>Accurate prediction of review outcomes</li>
              <li>Detection of every potential issue</li>
            </ul>
            <p>You acknowledge that final approval decisions are made by Apple.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, AppCheck shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of the Service.</p>
            <p>This includes but is not limited to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>App rejection by Apple</li>
              <li>Loss of revenue</li>
              <li>Development delays</li>
              <li>Business interruption</li>
            </ul>
            <p>Your use of the Service is at your own risk.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Service Availability</h2>
            <p>AppCheck may modify, suspend, or discontinue any part of the Service at any time without notice.</p>
            <p>We do not guarantee uninterrupted availability of the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. Changes to Terms</h2>
            <p>AppCheck reserves the right to update these Terms of Use at any time.</p>
            <p>Updated versions will be posted on this page with the revised date.</p>
            <p>Continued use of the Service constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">11. Contact</h2>
            <p>If you have questions about these Terms, you may contact:</p>
            <p><a href="mailto:support@appcheck.dev" className="text-apple-blue hover:underline">support@appcheck.dev</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
