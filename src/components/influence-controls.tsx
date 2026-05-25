"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";

type FeedItem = {
  id: string;
  direction: "add" | "sub";
  amount: number;
  kind: "free" | "paid";
  countryCode: string | null;
  createdAt: string;
};

type Props = {
  onLocalAction?: (item: FeedItem, nextCounter: number) => void;
};

export default function InfluenceControls({ onLocalAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  // הוספנו את שלב 3 עבור המחשבון
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [hasClaimed, setHasClaimed] = useState(false);

  // סטייט עבור השלב הראשון (חינם)
  const [direction, setDirection] = useState<"add" | "sub" | null>(null);
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [consent, setConsent] = useState(false);

  // סטייט עבור שלב 3 (המחשבון בתשלום)
  const [usdAmount, setUsdAmount] = useState<number>(1);
  const [paidDirection, setPaidDirection] = useState<"add" | "sub">("add");
  const [paidConsent, setPaidConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const claimed = localStorage.getItem("countt_free_claimed");
      if (claimed === "true") {
        setHasClaimed(true);
      }
    }
  }, []);

  function resetAndOpen() {
    setStep(1);
    setDirection(null);
    setAgeGroup("");
    setGender("");
    setConsent(false);
    setError(null);
    
    setUsdAmount(1);
    setPaidConsent(false);
    
    setIsOpen(true);
  }

  function handleContinue() {
    if (!direction || !consent) {
      setError("Please select a direction and accept the terms.");
      return;
    }
    setError(null);
    setStep(2);
  }

  // הפונקציה המתמטית לחישוב הקליקים
  function calculateClicks(x: number) {
    if (isNaN(x) || x < 1) return 0;
    const clicks = Math.floor(x + 2 * Math.sqrt(x) - 2);
    return clicks > 0 ? clicks : 0;
  }

  const currentClicks = calculateClicks(usdAmount);

  async function executeFreeAction() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/actions/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direction,
          consent: true,
          consentVersion: process.env.NEXT_PUBLIC_CONSENT_VERSION || "v1",
          ageGroup: ageGroup || undefined,
          gender: gender || undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 409 || data.error === "Free click already used") {
        setHasClaimed(true);
        localStorage.setItem("countt_free_claimed", "true");
        setError("You have already used your free action.");
        return;
      }

      if (!res.ok) {
        setError(data.error ?? "Action failed, please try again.");
        return;
      }

      localStorage.setItem("countt_free_claimed", "true");
      window.location.reload();
    });
  }

  // פונקציית דמה לשער התשלום העתידי
  function proceedToCheckout() {
    alert(`Payment Gateway Integration Coming Soon!\n\nYou selected to ${paidDirection} ${currentClicks} clicks for $${usdAmount}.`);
  }

  return (
    <>
      <button
        onClick={resetAndOpen}
        className="w-full rounded-full bg-black text-white text-xl font-bold py-5 px-8 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
      >
        Make an Impact
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* ה-div הזה מתרחב ומתכווץ בהתאם לשלב - transition-all */}
          <div 
            className={`bg-white rounded-[2rem] w-full p-8 shadow-2xl relative transition-all duration-300 ease-in-out ${
              step === 3 ? "max-w-xl" : "max-w-md"
            }`}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors text-xl font-bold z-10"
            >
              ✕
            </button>

            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-center">How do you want to influence?</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDirection("add")}
                    className={`p-4 rounded-2xl border-2 text-lg font-bold transition-all ${
                      direction === "add" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-green-200"
                    }`}
                  >
                    + Add
                  </button>
                  <button
                    onClick={() => setDirection("sub")}
                    className={`p-4 rounded-2xl border-2 text-lg font-bold transition-all ${
                      direction === "sub" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    - Subtract
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Age Group (Optional)</label>
                    <select 
                      value={ageGroup} 
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-black outline-none appearance-none"
                    >
                      <option value="">Select age</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45+">45+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Gender (Optional)</label>
                    <select 
                      value={gender} 
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-black outline-none appearance-none"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <input 
                    type="checkbox" 
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600 leading-tight cursor-pointer">
                    I agree to the <Link href="/terms" target="_blank" className="text-black underline font-medium">Terms & Privacy Policy</Link>, 
                    and consent to my data being used for this experiment.
                  </label>
                </div>

                {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                <button
                  onClick={handleContinue}
                  disabled={!direction || !consent}
                  className="w-full rounded-full bg-black text-white font-bold py-4 mt-2 disabled:opacity-30 transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-center mb-6">Choose Your Path</h2>
                
                <div className="space-y-4">
                  {/* Free Option */}
                  <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col gap-4 ${hasClaimed ? 'border-gray-200 bg-gray-50' : 'border-gray-900 bg-white shadow-sm'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-lg ${hasClaimed ? 'text-gray-400' : 'text-black'}`}>Standard Impact</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-500">Free</span>
                    </div>
                    <p className={`text-sm ${hasClaimed ? 'text-gray-400' : 'text-gray-500'}`}>
                      Change the global counter by {direction === "add" ? "+0.25" : "-0.25"} (One-time action).
                    </p>
                    <button
                      onClick={executeFreeAction}
                      disabled={isPending || hasClaimed}
                      className={`w-full rounded-full font-bold py-3 transition-all ${
                        hasClaimed || isPending 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70' 
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {hasClaimed ? "Already Used" : isPending ? "Applying..." : "Make Impact"}
                    </button>
                  </div>

                  {/* Paid Option */}
                  <div className="p-5 rounded-2xl border-2 border-blue-100 bg-blue-50/30 flex flex-col gap-4 transition-colors hover:border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-blue-900">Powerful Impact</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">Premium</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Want to make a bigger wave? Use the impact calculator to define your exact contribution.
                    </p>
                    <button
                      onClick={() => {
                        setPaidDirection(direction || "add");
                        setStep(3);
                      }}
                      className="w-full rounded-full bg-blue-600 text-white font-bold py-3 hover:bg-blue-700 transition-all shadow-md"
                    >
                      Calculate Impact
                    </button>
                  </div>
                </div>
                
                {error && <p className="text-red-500 text-sm font-bold text-center mt-2">{error}</p>}

                <button 
                  onClick={() => setStep(1)}
                  className="w-full text-sm font-medium text-gray-500 hover:text-black mt-2"
                >
                  &larr; Go back
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="text-center space-y-2 mt-2">
                  <h2 className="text-3xl font-black tracking-tight text-blue-600">Impact Calculator</h2>
                  <p className="text-gray-500 font-medium">Convert your contribution into direct counter action.</p>
                </div>

                {/* המחשבון עצמו */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Amount (USD)</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setUsdAmount(Math.max(1, usdAmount - 1))} 
                        className="w-12 h-12 rounded-full bg-white border border-gray-200 text-2xl font-medium flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                      >-</button>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                        <input 
                          type="number" 
                          min="1" 
                          value={usdAmount || ""} 
                          onChange={(e) => setUsdAmount(parseInt(e.target.value) || 0)} 
                          className="w-28 h-14 text-center text-2xl font-black bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none pl-6 shadow-inner"
                        />
                      </div>
                      <button 
                        onClick={() => setUsdAmount(usdAmount + 1)} 
                        className="w-12 h-12 rounded-full bg-blue-600 text-white text-2xl font-medium flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md"
                      >+</button>
                    </div>
                  </div>

                  <div className="text-4xl text-gray-300 font-light hidden md:block">=</div>

                  <div className="flex flex-col items-center gap-1 min-w-[100px]">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Equivalent</span>
                    <span className="text-5xl font-black text-blue-600">{currentClicks}</span>
                    <span className="text-sm font-bold text-blue-800/60 uppercase tracking-wide">Clicks</span>
                  </div>
                </div>

                {/* בחירת כיוון עבור התשלום */}
                <div className="space-y-4">
                  <h3 className="text-center font-bold text-gray-700">Action Direction</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaidDirection("add")}
                      className={`p-4 rounded-2xl border-2 text-lg font-bold transition-all ${
                        paidDirection === "add" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-green-200"
                      }`}
                    >
                      + Add Clicks
                    </button>
                    <button
                      onClick={() => setPaidDirection("sub")}
                      className={`p-4 rounded-2xl border-2 text-lg font-bold transition-all ${
                        paidDirection === "sub" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 hover:border-red-200"
                      }`}
                    >
                      - Subtract Clicks
                    </button>
                  </div>
                </div>

                {/* צ'קבוקס תנאים חמור לתשלום */}
                <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <input 
                    type="checkbox" 
                    id="paidConsent"
                    checked={paidConsent}
                    onChange={(e) => setPaidConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="paidConsent" className="text-sm text-gray-700 leading-tight cursor-pointer font-medium">
                    I accept the <Link href="/terms" target="_blank" className="text-blue-700 underline">Terms of Service</Link>, confirm that I understand payments are final, and agree to execute the action.
                  </label>
                </div>

                {/* כפתורי פעולה */}
                <div className="grid grid-cols-[1fr_2fr] gap-4 pt-2">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full rounded-full bg-gray-100 text-gray-600 font-bold py-4 hover:bg-gray-200 transition-all text-lg"
                  >
                    &larr; Back
                  </button>
                  <button
                    disabled={!paidConsent || currentClicks <= 0}
                    onClick={proceedToCheckout}
                    className="w-full rounded-full bg-blue-600 text-white font-bold py-4 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg text-lg"
                  >
                    Proceed to Payment (${usdAmount})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
