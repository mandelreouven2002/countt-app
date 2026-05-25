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
  const [step, setStep] = useState<1 | 2>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // משתנה חדש שבודק האם המשתמש כבר ניצל את הפעולה שלו
  const [hasClaimed, setHasClaimed] = useState(false);

  // Form state
  const [direction, setDirection] = useState<"add" | "sub" | null>(null);
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [consent, setConsent] = useState(false);

  // בדיקה מול זיכרון הדפדפן ברגע שהקומפוננטה נטענת
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

      // טיפול במצב שבו השרת מזהה שהמשתמש כבר הצביע (למשל ממכשיר אחר באותה רשת)
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

      // הצלחה! שומרים בזיכרון המקומי ומרעננים את העמוד
      localStorage.setItem("countt_free_claimed", "true");
      window.location.reload();
    });
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
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors text-xl font-bold"
            >
              ✕
            </button>

            {step === 1 ? (
              <div className="space-y-6">
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
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
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
            ) : (
              <div className="space-y-6">
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
                  <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col gap-4 opacity-75">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-700">Powerful Impact</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">$1.00</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Change the global counter by {direction === "add" ? "+1.00" : "-1.00"} and get a highlighted feed mention.
                    </p>
                    <button
                      disabled
                      className="w-full rounded-full bg-gray-200 text-gray-500 font-bold py-3 cursor-not-allowed"
                    >
                      Coming Soon
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
          </div>
        </div>
      )}
    </>
  );
}
