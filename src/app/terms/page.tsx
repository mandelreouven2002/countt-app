export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-12 font-sans space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Terms of Service & Privacy</h1>
        <p className="text-lg text-gray-500 font-medium">Last updated: May 2026</p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed bg-white p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-sm">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">1. Data Collection & Privacy</h2>
          <p>
            Transparency and data protection are fundamental to this experiment. When you interact with the counter, we collect minimal data required to maintain the integrity of the platform:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>IP Hashing:</strong> We do not store raw IP addresses. Your IP is immediately hashed using secure cryptographic standards to prevent duplicate free actions while maintaining your anonymity.</li>
            <li><strong>Voluntary Demographics:</strong> Any demographic data provided (such as age group or gender) is strictly voluntary. It is stored alongside your anonymous hash solely for the purpose of analyzing statistical trends in human behavior.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">2. Data Processing & Visibility</h2>
          <p>
            The data we collect is processed in real-time to update the global counter and populate the public activity feed. 
            Only non-identifying information (such as action direction, action type, and country code) is made visible on the public feed. 
            We do not sell, rent, or distribute your behavioral data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">3. Paid Actions & Refund Policy</h2>
          <p>
            Users may choose to participate in "Powerful Impact" actions by paying a designated fee. By submitting a payment, you acknowledge and agree to the following:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All transactions are final. Because payments immediately affect the live global counter and the public feed state, <strong>we cannot issue refunds under any circumstances</strong>.</li>
            <li>You are paying for the immediate digital execution of the action (+1.00 or -1.00) and the visual highlight on the activity feed.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">4. General Usage</h2>
          <p>
            Countt is provided "as-is". We reserve the right to modify the counter's value, block malicious actors, or terminate the experiment if we detect automated botting, abuse, or attempts to compromise the system's security.
          </p>
        </section>

      </div>
    </main>
  );
}
