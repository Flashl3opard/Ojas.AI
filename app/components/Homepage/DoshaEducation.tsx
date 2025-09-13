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
    info: "Balanced Vata gives inspiration and flexibility. Imbalance may cause anxiety, irregular digestion, or sleep issues.",
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
    info: "Balanced Pitta builds confidence and sharp intellect. Imbalance may show as anger, skin rashes, or overheating.",
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
    info: "Balanced Kapha provides compassion and resilience. Imbalance may cause sluggishness, excessive sleep, or congestion.",
  },
] as const;

export default function DoshaEducation() {
  return (
    <section className="py-16 px-6 pb-28 md:px-20 bg-[#F6FBE9]">
      {/* Section Heading */}
      <h2
        className="text-3xl font-bold text-center text-gray-900 mb-12"
        data-aos="fade-up"
      >
        Discover Your Dosha
      </h2>

      {/* Section Description */}
      <p
        className="text-center text-gray-600 max-w-2xl mx-auto mb-12"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        Ayurveda identifies three main body constitutions (Doshas). Click on a
        card to flip and learn more.
      </p>

      {/* Dosha Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {doshas.map((dosha, idx) => (
          <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 150}>
            <DoshaCard {...dosha} />
          </div>
        ))}
      </div>
    </section>
  );
}
