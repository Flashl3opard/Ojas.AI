import { HeartPulse, Brain, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <HeartPulse className="w-10 h-10 text-green-600" />,
    title: "Personalized Plans",
    desc: "Tailored diet charts designed to suit your unique constitution.",
  },
  {
    icon: <Brain className="w-10 h-10 text-green-600" />,
    title: "Dosha Assessment",
    desc: "Discover your dominant dosha and maintain balance for wellness.",
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-green-600" />,
    title: "Track Progress",
    desc: "Monitor improvements in your health and lifestyle over time.",
  },
];

export default function Features() {
  return (
    <section className="py-12 px-6 md:px-16 bg-[#ececec] text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-8" data-aos="fade-up">
        Key Features
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center space-y-4 bg-green-50 rounded-2xl shadow-sm p-6 border border-green-100 hover:shadow-md transition"
            data-aos="fade-up"
            data-aos-delay={idx * 200}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
