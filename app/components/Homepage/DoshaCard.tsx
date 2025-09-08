"use client";
import { useState } from "react";
import Link from "next/link";

type DoshaCardProps = {
  name: "Vata" | "Pitta" | "Kapha";
  description: string;
  traits: readonly string[];
  color: string;
  icon: React.ReactNode;
};

export default function DoshaCard({
  name,
  description,
  traits,
  color,
  icon,
}: DoshaCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full h-72 perspective"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div
          className={`absolute w-full h-full ${color} rounded-2xl flex flex-col items-center justify-center shadow-lg backface-hidden p-6`}
        >
          <div className="mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
          <p className="mt-2 text-sm text-gray-700">
            Click to learn more about {name}.
          </p>
        </div>

        <div className="absolute w-full h-full bg-white rounded-2xl shadow-lg backface-hidden rotate-y-180 p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-semibold mb-2">{name} Traits</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {traits.map((trait, idx) => (
                <li key={idx}>{trait}</li>
              ))}
            </ul>
            <p className="mt-3 text-gray-600 text-sm">{description}</p>
          </div>
          <Link
            href="/questionnaire"
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            Find out your type →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
          cursor: pointer;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
