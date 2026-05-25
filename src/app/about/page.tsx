export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-12 font-sans space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">About Countt</h1>
        <p className="text-xl text-gray-500 font-medium">A real-time exploration of human behavior.</p>
      </div>

      <section className="space-y-4 text-lg text-gray-700 leading-relaxed bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
        <h2 className="text-2xl font-bold text-black">The Experiment</h2>
        <p>
          Countt is an interactive social experiment sitting at the intersection of technology, society, and ethics. 
          We have created one global number and given the internet the power to move it. 
        </p>
        <p>
          The core question is simple: What will happen? When given the choice to build (+0.25) or dismantle (-0.25), 
          which collective instinct will take over? Will we see organized communities working together to drive the 
          number to unprecedented heights, or will chaotic forces push it into the negative? Countt provides a live, 
          transparent mapping of these digital social dynamics.
        </p>
      </section>

      <section className="space-y-4 text-lg text-gray-700 leading-relaxed bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
        <h2 className="text-2xl font-bold text-black">Our Commitment to Culture</h2>
        <p>
          Beyond the digital experiment, we believe in translating digital actions into real-world value. 
          A dedicated portion of all proceeds generated through paid actions on this platform will be directly 
          donated to support and promote cultural initiatives, local communities, and the arts. 
        </p>
        <p>
          Every click not only shapes the global counter but also contributes to fostering real-world human connection and creativity.
        </p>
      </section>
    </main>
  );
}
