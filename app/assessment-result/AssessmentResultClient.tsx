import { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const doshaDetails: Record<string, { text: string }> = {
  Vata: {
    text: `Vata is formed by the combination of air and space. It governs all movement in the body and mind, including circulation, respiration, and the nervous system. Vata types tend to be creative, energetic, and quick-thinking but may experience anxiety or restlessness when imbalanced.`,
  },
  Pitta: {
    text: `Pitta is formed by the combination of fire and water. It governs digestion, metabolism, and transformation in the body. Pitta types are typically intelligent, focused, and ambitious but may become irritable or overly competitive when out of balance.`,
  },
  Kapha: {
    text: `Kapha is formed by the combination of earth and water. It provides structure, stability, and lubrication to the body. Kapha types are naturally calm, compassionate, and steady but may experience lethargy or attachment when imbalanced.`,
  },
};

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
    <div className="mb-4">
      <button
        // Keeping the button UI as is
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-lg font-medium text-gray-900">{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            open ? "rotate-180" : ""
          } text-gray-600`}
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
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[600px] mt-2" : "max-h-0"
        }`}
      >
        {open && (
          // **UI Change for Accordion Content:**
          // Changed background to bg-emerald-50 and border to border-emerald-300
          <div className="px-6 py-4 bg-emerald-50 border border-emerald-300 rounded-lg text-gray-700 leading-relaxed">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentResultClient() {
  // Sample data for demonstration
  const vata = 35;
  const pitta = 25;
  const kapha = 40;

  const doshaResult = [
    { name: "Vata", value: vata },
    { name: "Pitta", value: pitta },
    { name: "Kapha", value: kapha },
  ].sort((a, b) => b.value - a.value);

  const primaryDosha = doshaResult[0].name;
  const secondaryDosha = doshaResult[1].name;

  const doshaSymbol =
    primaryDosha === "Vata" ? (
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg width="40" height="40" fill="none">
          <circle cx="20" cy="20" r="18" fill="#10b981" />
          <path
            d="M12 18c2-3 8-3 10 0M12 24c2-3 8-3 10 0"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ) : primaryDosha === "Pitta" ? (
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg width="40" height="40" fill="none">
          <circle cx="20" cy="20" r="18" fill="#10b981" />
          <path
            d="M20 12l3 9h-6l3-9zm0 9v5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ) : (
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg width="40" height="40" fill="none">
          <circle cx="20" cy="20" r="18" fill="#10b981" />
          <ellipse cx="20" cy="24" rx="7" ry="4" fill="#fff" />
        </svg>
      </div>
    );

  const chartData = {
    labels: ["Vata", "Pitta", "Kapha"],
    datasets: [
      {
        label: "Dosha Distribution",
        data: [vata, pitta, kapha],
        backgroundColor: ["#EC6B56", "#FFC154", "#47B39C"],
        borderColor: ["#fff", "#fff", "#fff"],
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
            size: 14,
          },
          color: "#374151",
          padding: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
        backgroundColor: "#1f2937",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-sm tracking-wider text-gray-500 uppercase mb-3 font-medium">
            Dosha Quiz Result
          </p>
          <h1 className="text-4xl font-light text-gray-900 mb-10">
            Your dominant Dosha is
          </h1>

          <div className="flex flex-col items-center gap-4 mb-8">
            {doshaSymbol}
            <h2 className="text-3xl font-semibold text-gray-900">
              {primaryDosha}
            </h2>
          </div>

          <button className="px-8 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
            Save Result as PDF
          </button>
        </div>

        {/* Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
          <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
            Dosha Distribution
          </h2>
          <div className="max-w-md mx-auto">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Health scale box */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-8 text-gray-700">
            <div>
              Primary:{" "}
              <span className="font-semibold text-emerald-700">
                {primaryDosha}
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div>
              Secondary:{" "}
              <span className="font-semibold text-emerald-700">
                {secondaryDosha}
              </span>
            </div>
          </div>
        </div>

        {/* Dosha Accordions - Container is green */}
        <div className="bg-white border border-emerald-200 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
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
