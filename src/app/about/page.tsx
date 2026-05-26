export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-12 font-sans space-y-8">
      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">About Countt</h1>
        <p className="text-xl text-gray-500 font-medium">A real-time social experiment about collective behavior on the internet.</p>
      </div>

      <section className="space-y-5 text-lg text-gray-700 leading-relaxed bg-white p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-sm">
        <p>
          At its core, Countt is built around one shared global counter. Every participant sees the same number and has the power to move it. A free action allows a small one-time impact, while paid actions allow a stronger effect.
        </p>
        <p>
          The idea is simple, but the question behind it is not:<br/>
          <strong className="text-black text-xl block mt-4 mb-2 font-black">When people are given the power to build or disrupt a shared digital outcome, what do they choose to do?</strong>
        </p>
        <p>
          Some participants may try to push the counter upward. Others may try to pull it down. Over time, Countt creates a live public picture of tension between cooperation and disruption, between impulse and intention, and between free participation and paid influence.
        </p>
        <p>
          Countt is not presented as a formal academic study. It is a public social experiment designed to explore large-scale online behavior through a transparent shared system.
        </p>
      </section>

      <section className="space-y-4 text-lg text-gray-700 leading-relaxed bg-white p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-sm">
        <h2 className="text-2xl font-bold text-black">What Countt Observes</h2>
        <p>Countt is designed to observe broad patterns such as:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>whether people are more likely to add or subtract</li>
          <li>how free actions differ from paid actions</li>
          <li>how activity changes over time</li>
          <li>how public behavior evolves once participants can see the collective result in real time</li>
        </ul>
        <p className="mt-4">
          The platform focuses on aggregate trends rather than personal identity.
        </p>
      </section>

      <section className="space-y-4 text-lg text-gray-700 leading-relaxed bg-white p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-sm">
        <h2 className="text-2xl font-bold text-black">Our Approach to Privacy</h2>
        <p>
          We believe a social experiment should not require intrusive surveillance.
        </p>
        <p>
          For that reason, Countt is designed to minimize personal data collection. We do not store raw IP addresses for counter integrity. Instead, technical measures are used to help prevent abuse of the free action system while limiting unnecessary identification. Optional demographic information, where provided, is used only in aggregate form.
        </p>
      </section>

      <section className="space-y-4 text-lg text-gray-700 leading-relaxed bg-white p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-sm">
        <h2 className="text-2xl font-bold text-black">Our Commitment Beyond the Platform</h2>
        <p>
          Countt is also intended to create value beyond the screen.
        </p>
        <p>
          A designated portion of proceeds from paid actions may be allocated to support cultural initiatives, local communities, and the arts. Our goal is that participation in a digital experiment can also help support real-world creativity, connection, and cultural life.
        </p>
        <p className="font-semibold text-black pt-2">
          Every action changes the shared counter. Some actions may also help support something meaningful outside it.
        </p>
      </section>
    </main>
  );
}
