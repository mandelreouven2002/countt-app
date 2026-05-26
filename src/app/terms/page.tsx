export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 md:p-12 font-sans space-y-8">
      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Terms of Service & Privacy</h1>
        <p className="text-lg text-gray-500 font-medium">Last updated: May 2026</p>
      </div>

      <div className="space-y-10 text-gray-700 leading-relaxed bg-white p-8 md:p-12 rounded-[2rem] border border-black/5 shadow-sm">
        
        <div className="text-lg">
          <p>Welcome to Countt. By accessing or interacting with the platform, you agree to these Terms of Service and Privacy Notice.</p>
          <p className="font-bold text-black mt-2">If you do not agree, do not use the platform.</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">1. What Countt Is</h2>
          <p>Countt is a live online social experiment built around a shared global counter. Users may interact with the counter through free actions and, where available, paid actions.</p>
          <p>The platform is provided for experimental, informational, and entertainment purposes. It is not guaranteed to remain available continuously or permanently.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">2. Eligibility and Acceptable Use</h2>
          <p>You may use Countt only in compliance with applicable law and these terms. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>use bots, scripts, automation, spoofing, or similar methods to manipulate the counter</li>
            <li>interfere with the normal operation or security of the platform</li>
            <li>attempt to bypass limits on free actions</li>
            <li>misuse payment systems, refund mechanisms, or platform vulnerabilities</li>
          </ul>
          <p>We may suspend, restrict, or block access where we detect abuse, manipulation, fraud, security risks, or violations of these terms.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">3. Free Actions</h2>
          <p>Countt may allow a limited free action intended for one-time or restricted participation.</p>
          <p>Free actions are subject to integrity controls intended to prevent duplicate or abusive use. We do not guarantee that every user will be eligible for a free action, and we may deny or invalidate actions where abuse or technical manipulation is suspected.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">4. Paid Actions</h2>
          <p>Where offered, users may purchase paid actions through our payment provider. By submitting a paid action, you understand and agree that:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>the action is intended to be executed promptly in a live system</li>
            <li>the effect of the action may become visible immediately on the counter and public activity feed</li>
            <li>the purchase relates to the execution of a digital action within the experiment</li>
          </ul>
          <p>Prices, limits, and paid action formats may change at any time.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">5. Refunds</h2>
          <p>All paid actions are generally final.</p>
          <p>Because paid actions are digital services that are intended for immediate execution in a live environment, refunds are not normally provided once the action has been processed. Nothing in these terms limits any non-waivable consumer rights that apply under mandatory law.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">6. Data We Collect</h2>
          <p>To operate Countt, protect the integrity of the platform, and analyze aggregate behavior, we may collect limited data including:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>technical identifiers necessary for platform security and abuse prevention</li>
            <li>a hashed or otherwise pseudonymized representation of network information used to limit duplicate free actions</li>
            <li>interaction data, such as whether an action was add or subtract, free or paid, the amount, and the time of the action</li>
            <li>approximate location data such as country code</li>
            <li>optional demographic information, such as age group or gender, if voluntarily submitted</li>
            <li>payment status and transaction metadata required to confirm paid actions</li>
          </ul>
          <p>We do not intentionally publish identifying personal data in the public activity feed.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">7. How We Use Data</h2>
          <p>We use collected data to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>operate the shared counter</li>
            <li>process free and paid actions</li>
            <li>prevent fraud, abuse, duplication, and manipulation</li>
            <li>maintain platform security and reliability</li>
            <li>generate aggregate statistics and public summaries about experiment activity</li>
            <li>analyze broad behavioral patterns related to participation in the experiment</li>
          </ul>
          <p className="font-semibold text-black">We do not sell personal data to advertisers.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">8. Public Visibility</h2>
          <p>Countt includes public, real-time, or near-real-time displays of experiment activity. Publicly displayed data may include limited non-identifying information such as:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>action type</li>
            <li>direction of action</li>
            <li>action amount</li>
            <li>country code or broad region</li>
            <li>time of action</li>
          </ul>
          <p>We do not intend for the public feed to reveal direct personal identity.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">9. Data Minimization and Retention</h2>
          <p>We aim to collect only data reasonably necessary for the operation and analysis of the experiment and to retain it for no longer than necessary for those purposes, subject to legal, security, fraud-prevention, and accounting requirements. EU guidance emphasizes data minimization, storage limitation, and clear retention practices.</p>
          <p>Aggregated and anonymized statistical outputs may be retained longer.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">10. Legal Basis and Consent</h2>
          <p>Where required by applicable law, we rely on user consent and/or other valid legal grounds to process relevant data for operation, security, analytics, and payment handling. Where optional demographic data is requested, submission is voluntary. Where consent is used, users should be able to understand what they are agreeing to, and valid consent under EU guidance must be specific, informed, and freely given.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">11. Your Rights</h2>
          <p>Depending on where you are located, you may have rights regarding your personal data, including the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>request access</li>
            <li>request correction</li>
            <li>request deletion</li>
            <li>request restriction of processing</li>
            <li>object to certain processing</li>
            <li>withdraw consent where consent is the basis for processing</li>
          </ul>
          <p>The GDPR gives individuals rights including access, rectification, erasure, restriction, portability, objection, and the right to be informed. Requests may be submitted using the contact details provided on the platform.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">12. Payments</h2>
          <p>Payments are processed by third-party payment providers. We do not store full payment card details on Countt servers. Payment processing is subject to the relevant provider’s terms and privacy practices.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">13. Security</h2>
          <p>We use reasonable technical and organizational measures intended to protect the platform and the data we process. However, no internet-based service can be guaranteed to be completely secure.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">14. Changes to the Platform</h2>
          <p>We may modify, pause, limit, or end any part of Countt at any time, including the counter logic, pricing, features, public displays, and experiment rules.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">15. Disclaimer</h2>
          <p>Countt is provided on an “as is” and “as available” basis, to the extent permitted by law. We do not guarantee uninterrupted access, error-free operation, or any specific experimental outcome.</p>
        </section>

      </div>
    </main>
  );
}
