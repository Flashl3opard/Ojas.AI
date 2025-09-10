import React from "react";
import {
  Activity,
  Brain,
  Frown,
  Weight,
  Pill,
  Syringe,
  FileWarning,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";

const conditions = [
  {
    icon: <Weight className="w-10 h-10 text-green-600" />,
    title: "Ayurveda For Obesity",
    subtitle: "Obesity",
    desc: "The modern definition or excessive weight or obesity was medically classed as a disease that affects a considerable amount of the world’s population. 2013 was ...",
  },
  {
    icon: <Syringe className="w-10 h-10 text-green-600" />,
    title: "Use Of Ayurveda In The Treatment Of Type 2 Diabetes Mellitus",
    subtitle: "Diabetes and Ayurveda",
    desc: "Diabetes mellitus (DM), more often just called Diabetes, is a group of metabolic lifestyle disorders and diseases in which a person has high blood sugar ...",
  },
  {
    icon: <Frown className="w-10 h-10 text-green-600" />,
    title: "Bulimia",
    subtitle: "Bulimia",
    desc: "According to Boston Children’s Hospital, 1-5% of adolescents and 1.1 to 4.2% of females in the United States are believed to have bulimia nervosa. The ...",
  },
  {
    icon: <Brain className="w-10 h-10 text-green-600" />,
    title: "Depression",
    subtitle: "Depression",
    desc: "Depression is a common illness all over the world. Most people often pay less attention and seek medical advice for this illness. Depression is ...",
  },
  {
    icon: <Pill className="w-10 h-10 text-green-600" />,
    title: "Piles And Haemorrhoids",
    subtitle: "Piles",
    desc: "Haemorrhoids commonly known as piles are swollen blood vessels in or around the anus and rectum. The haemorrhoidal veins are located in the lowest ...",
  },
  {
    icon: <FileWarning className="w-10 h-10 text-green-600" />,
    title: "Slip Disc Or Herniated Disc Ayurveda And Panchakarma Therapy",
    subtitle: "Disc Herniation",
    desc: "A disc herniation or a prolapsed intervertebral disc is more commonly known as a slipped disc, a common condition that affects the intervertebral discs ...",
  },
  {
    icon: <ShieldAlert className="w-10 h-10 text-green-600" />,
    title: "Constipation",
    subtitle: "Constipation",
    desc: "Constipation is derived from the latin word 'constipare', meaning 'to press, crowd together'. It's a condition of the digestive system due to incorrect lifestyle and ...",
  },
  {
    icon: <AlertCircle className="w-10 h-10 text-green-600" />,
    title: "Psoriasis And Ayurvedic Treatment",
    subtitle: "Psoriasis",
    desc: "Psoriasis is defined as an autoimmune, long lasting, non-contagious skin disorder that results in the hyperproliferation of the skin. Hyperproliferation is defined as an abnormally ...",
  },
];

export default function Conditions() {
  return (
    <section className="px-6 md:px-20 py-16 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        Conditions We Treat With Ayurvedic Healing Solutions
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {conditions.map((cond, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-4 p-6 bg-green-50 rounded-xl shadow hover:shadow-md transition"
          >
            <div>{cond.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {cond.subtitle}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{cond.title}</p>
              <p className="text-gray-600 mt-2">{cond.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
