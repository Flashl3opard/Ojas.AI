import DoshaCard from "./DoshaCard";
import { Droplet, Flame, Leaf } from "lucide-react";

const doshas = [
  {
    name: "Vata",
    description:
      "Vata is linked to movement, creativity, and quick thinking. Balanced Vata brings energy, but imbalance can cause anxiety and restlessness.",
    traits: [
      "Energetic & creative",
      "Quick learner",
      "Prone to dry skin",
      "Needs routine & warmth",
    ],
    color: "bg-blue-200",
    icon: <Droplet className="w-8 h-8 text-blue-600" />,
  },
  {
    name: "Pitta",
    description:
      "Pitta is linked to metabolism, focus, and digestion. Balanced Pitta makes you confident, but imbalance can cause irritability or overheating.",
    traits: [
      "Strong digestion",
      "Goal-driven",
      "Prone to irritability",
      "Needs cooling foods",
    ],
    color: "bg-red-200",
    icon: <Flame className="w-8 h-8 text-red-600" />,
  },
  {
    name: "Kapha",
    description:
      "Kapha is linked to stability, calmness, and endurance. Balanced Kapha brings patience, but imbalance can cause lethargy or weight gain.",
    traits: [
      "Grounded & calm",
      "Strong immunity",
      "Prone to weight gain",
      "Needs stimulation & activity",
    ],
    color: "bg-green-200",
    icon: <Leaf className="w-8 h-8 text-green-600" />,
  },
] as const;

export default function DoshaEducation() {
  return (
    <section className="py-16 px-6 md:px-20 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Discover Your Dosha
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Ayurveda identifies three main body constitutions (Doshas). Click on a
        card to flip and learn more.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {doshas.map((dosha, idx) => (
          <DoshaCard key={idx} {...dosha} />
        ))}
      </div>
    </section>
  );
}
