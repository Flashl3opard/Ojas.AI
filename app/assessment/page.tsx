// app/assessment/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Navbar from "../components/Navbar";

const quizQuestions = [
  // ... (quizQuestions array remains the same)
  {
    id: "bodyFrame",
    label: "Body Frame",
    options: [
      { value: "vata", text: "Small/Thin" },
      { value: "pitta", text: "Medium" },
      { value: "kapha", text: "Large/Heavy" },
    ],
  },
  {
    id: "skinType",
    label: "Skin Type",
    options: [
      { value: "vata", text: "Dry" },
      { value: "pitta", text: "Oily & Sensitive" },
      { value: "kapha", text: "Thick & Cool" },
    ],
  },
  {
    id: "hair",
    label: "Hair",
    options: [
      { value: "vata", text: "Dry & Curly" },
      { value: "pitta", text: "Straight & Fine" },
      { value: "kapha", text: "Thick & Lustrous" },
    ],
  },
  {
    id: "eyes",
    label: "Eyes",
    options: [
      { value: "vata", text: "Small & Dry" },
      { value: "pitta", text: "Medium, Intense" },
      { value: "kapha", text: "Large, Attractive" },
    ],
  },
  {
    id: "talkingStyle",
    label: "Talking Style",
    options: [
      { value: "vata", text: "Fast" },
      { value: "pitta", text: "Sharp & Concise" },
      { value: "kapha", text: "Slow & Calm" },
    ],
  },
  {
    id: "favoriteWeather",
    label: "Favorite Weather",
    options: [
      { value: "vata", text: "Warm" },
      { value: "pitta", text: "Cool" },
      { value: "kapha", text: "Cool & Dry" },
    ],
  },
  {
    id: "memory",
    label: "Memory",
    options: [
      { value: "vata", text: "Learns quickly but forgets quickly" },
      { value: "pitta", text: "Great memory" },
      { value: "kapha", text: "Slow but long-lasting" },
    ],
  },
  {
    id: "personality",
    label: "Personality Traits",
    options: [
      { value: "vata", text: "Creative" },
      { value: "pitta", text: "Competitive" },
      { value: "kapha", text: "Nurturing" },
    ],
  },
  {
    id: "stress",
    label: "Stress Response",
    options: [
      { value: "vata", text: "Insomnia / Anxiety" },
      { value: "pitta", text: "Irritability / Anger" },
      { value: "kapha", text: "Calm but Withdrawn" },
    ],
  },
  {
    id: "lifestyle",
    label: "Lifestyle Patterns",
    options: [
      { value: "vata", text: "Erratic Appetite & Light Sleep" },
      { value: "pitta", text: "Strong Appetite & Moderate Sleep" },
      { value: "kapha", text: "Steady Appetite & Deep Sleep" },
    ],
  },
];

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter(); // Initialize router

  const handleAnswer = (id: string, value: string) => {
    setAnswers({ ...answers, [id]: value });
  };

  const calculateDosha = () => {
    let counts = { vata: 0, pitta: 0, kapha: 0 };
    const answeredQuestions = Object.values(answers).length;

    if (answeredQuestions === 0) {
      alert("Please answer at least one question to get a result.");
      return;
    }

    Object.values(answers).forEach((value) => {
      counts[value as keyof typeof counts]++;
    });

    const vataPercent = Math.round((counts.vata / answeredQuestions) * 100);
    const pittaPercent = Math.round((counts.pitta / answeredQuestions) * 100);
    const kaphaPercent = Math.round((counts.kapha / answeredQuestions) * 100);

    router.push(
      `/assessment-result?vata=${vataPercent}&pitta=${pittaPercent}&kapha=${kaphaPercent}`
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-100 flex flex-col items-center py-12 px-4 font-sans">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-8 border border-neutral-200">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Dosha Assessment Quiz
            </h1>
            <p className="text-gray-500 mt-2">
              Answer the questions below to discover your unique mind-body
              constitution (Prakriti).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {quizQuestions.map((q) => (
              <div
                key={q.id}
                className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  {q.label}
                </h3>
                <div className="flex flex-col space-y-3">
                  {q.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                        answers[q.id] === opt.value
                          ? "border border-green-600 bg-green-50 shadow-sm"
                          : "border border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={answers[q.id] === opt.value}
                        onChange={() => handleAnswer(q.id, opt.value)}
                        className="hidden"
                      />

                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                          answers[q.id] === opt.value
                            ? "border-green-600 bg-green-600"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {answers[q.id] === opt.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={calculateDosha}
              className="bg-green-600 text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:bg-green-700 transform hover:scale-105 shadow-lg"
            >
              Calculate Your Dosha
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
