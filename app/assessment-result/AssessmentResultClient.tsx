// app/assessment-result/AssessmentResultClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Your other functions and data
const doshaDescriptions: Record<string, string> = {
  Vata: "This type is full of energy and creativity",
  Pitta: "This type are sharp thinkers",
  Kapha: "This type is warm of heart and steady of mind",
};

const doshaDetails: Record<string, { text: string }> = {
  Vata: {
    text: `Vata is formed by the combination of air and space...`,
  },
  Pitta: {
    text: `Pitta is formed by the combination of fire and water...`,
  },
  Kapha: {
    text: `Kapha is formed by the combination of earth and water...`,
  },
};

function getBmiScale(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 25) return "Healthy Weight";
  if (bmi >= 25 && bmi < 30) return "Overweight";
  return "Obese";
}

// Accordion Component
function Accordion({
  title,
  content,
  defaultOpen = false,
}: {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-5">
      <button
        className="w-full flex justify-between items-center px-6 py-5 bg-[#FBF6EF] border border-[#223A34] rounded-xl shadow transition-colors group"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xl font-semibold text-[#223A34] font-serif">
          {title}
        </span>
        <svg
          className={`w-6 h-6 transform transition-transform ${
            open ? "rotate-180" : ""
          } text-[#223A34]`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 bg-white rounded-b-xl border-x border-b border-[#223A34] ${
          open ? "max-h-[600px] p-6" : "max-h-0 p-0"
        }`}
      >
        {open && (
          <div className="text-gray-700 text-lg whitespace-pre-line font-sans">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

// Main client component
export default function AssessmentResultClient() {
  const searchParams = useSearchParams();
  const [bmi, setBmi] = useState(22.5);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);

  const vata = Number(searchParams.get("vata")) || 0;
  const pitta = Number(searchParams.get("pitta")) || 0;
  const kapha = Number(searchParams.get("kapha")) || 0;

  useEffect(() => {
    const bmiValue = weight / Math.pow(height / 100, 2);
    setBmi(parseFloat(bmiValue.toFixed(2)));
  }, [weight, height]);

  const doshaResult = [
    { name: "Vata", value: vata },
    { name: "Pitta", value: pitta },
    { name: "Kapha", value: kapha },
  ].sort((a, b) => b.value - a.value);

  const primaryDosha = doshaResult[0].name;
  const secondaryDosha = doshaResult[1].name;

  const doshaSymbol =
    primaryDosha === "Vata" ? (
      <span className="w-16 h-16 rounded-full bg-cyan-200 flex items-center justify-center shadow-lg">
        <svg width="38" height="38" fill="none">
          <circle cx="19" cy="19" r="19" fill="#68b7c9" />
          <path
            d="M12 18c2-3 8-3 10 0M12 24c2-3 8-3 10 0"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    ) : primaryDosha === "Pitta" ? (
      <span className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center shadow-lg">
        <svg width="38" height="38" fill="none">
          <circle cx="19" cy="19" r="19" fill="#f9b945" />
          <path
            d="M19 11l3 9h-6l3-9zm0 9v5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    ) : (
      <span className="w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center shadow-lg">
        <svg width="38" height="38" fill="none">
          <circle cx="19" cy="19" r="19" fill="#90d8b6" />
          <ellipse cx="19" cy="24" rx="7" ry="4" fill="#fff" />
        </svg>
      </span>
    );

  const chartData = {
    labels: ["Vata", "Pitta", "Kapha"],
    datasets: [
      {
        label: "Dosha Distribution",
        data: [vata, pitta, kapha],
        backgroundColor: ["#68b7c9", "#f9b945", "#90d8b6"],
        borderColor: ["#3b82f6", "#ca8a04", "#059669"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FBF6EF] flex flex-col items-center py-16 px-4 font-serif">
      <h3 className="text-sm tracking-wide text-[#223A34] uppercase mb-6 text-center font-semibold">
        Dosha Quiz Result
      </h3>
      <h1 className="text-4xl font-light text-[#223A34] mb-8 text-center">
        Your dominant Dosha is
      </h1>
      <div className="flex flex-col items-center justify-center mb-12">
        <div>{doshaSymbol}</div>
        <div className="text-2xl mt-4 font-medium tracking-wide text-[#223A34] font-serif">
          {primaryDosha}
        </div>
        <button className="mt-7 px-6 py-2 border rounded text-[#223A34] border-[#223A34] font-semibold bg-[#FBF6EF] hover:bg-white transition-colors text-base shadow focus:outline-none">
          SAVE RESULT AS PDF
        </button>
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-10">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-center text-2xl font-semibold text-[#223A34] mb-6 font-serif">
            Dosha Distribution
          </h2>
          <Pie data={chartData} options={chartOptions} />
        </div>
        {/* Health scale box */}
        <div className="bg-[#C5DECB] rounded-2xl shadow-lg p-8 flex flex-col gap-5 items-center">
          <div className="text-lg font-medium text-[#223A34]">
            BMI: <span className="font-bold text-[#285C4D]">{bmi}</span>
          </div>
          <div className="text-lg font-medium text-[#223A34]">
            Health Scale:{" "}
            <span className="font-bold text-[#285C4D]">{getBmiScale(bmi)}</span>
          </div>
        </div>
        {/* Dosha Accordions */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mt-7">
          <h2 className="text-3xl font-semibold text-[#223A34] mb-8 text-center font-serif">
            What does it mean for you?
          </h2>
          <Accordion
            title={`You are predominantly ${primaryDosha}`}
            content={doshaDetails[primaryDosha].text}
            defaultOpen={true}
          />
          <Accordion
            title={`Your secondary dosha is ${secondaryDosha}`}
            content={doshaDetails[secondaryDosha].text}
            defaultOpen={false}
          />
        </div>
      </div>
    </div>
  );
}
