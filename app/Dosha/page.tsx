"use client";

import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DoshaBlogPage() {
  const doshas = [
    {
      name: "Vata",
      imgSrc: "/images/wind.png",
      intro:
        "Vata is full of energy, creativity, and movement. It governs all bodily motion and communication, including breathing, muscle and tissue activity, and mental processes.",
      details: `Vata is formed by the combination of air and space. The seat of Vata is below the umbilicus .. 
It controls mind, creativity, and impulsive responses. It governs all movements, air flow, all muscle and bone functions, and communication throughout the mind and the nervous system.

When Vata is out of balance, one may feel disconnected from the  body and mind, experiencing anxiety, insomnia, constipation, bloating, joint pain, and dryness. 

Generally, a Vata person is thin, talkative, and restless. They tend to have dry skin, brittle nails, thin hair, and small, slightly sunken eyes. Vata types prefer warm weather and may have difficulty tolerating cold climates.`,
    },
    {
      name: "Pitta",
      imgSrc: "/images/fire.png",
      intro:
        "Pitta types are sharp thinker, intense, and driven by fire. They are focused, organized, and full of ambition.",
      details: `Pitta is formed by the combination of fire and water. Pitta plays a key role in digestion, metabolism, and nutritional absorption. It is located in the small intestine and is the seat of Agni (digestive fire).

Pitta controls hormonal secretions, enzymatic functions, metabolism, skin health, and liver health. It represents intelligence, understanding, emotions, and experience. It also balances body temperature.

When out of balance, Pitta may experience acne, skin sensitivities, inflammation, allergies, and hormonal imbalances. Pitta persons are generally active, perfectionist, dynamic, intelligent, and sometimes short-tempered. They usually have moderate build, sensitive skin, and good leadership qualities.`,
    },
    {
      name: "Kapha",
      imgSrc: "/images/leaf.png",
      intro:
        "Kapha is calm, steady, nurturing, and resilient. They are patient, strong, and emotionally balanced.",
      details: `Kapha is formed by the combination of earth and water. It provides structure, stability, and lubrication to the body. It is located primarily in the chest, throat, head, and joints.

Kapha governs growth, immune response, and healing. It controls water balance, strength, and endurance. Kapha represents calmness, patience, and emotional stability.

When out of balance, Kapha may feel lethargic, gain weight, retain fluids, or experience depression. Kapha types tend to have solid build, smooth skin, thick hair, strong nails, and large, peaceful eyes. They thrive in warm, dry climates.`,
    },
  ];

  const sectionBg = [
    "from-blue-50 via-blue-100 to-blue-200",
    "from-orange-50 via-orange-100 to-red-200",
    "from-green-50 via-green-100 to-emerald-200",
  ];

  return (
    <>
      <Navbar />
      <div className="font-sans">
        {doshas.map((dosha, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <motion.section
              key={dosha.name}
              className={`flex flex-col md:flex-row items-center justify-center gap-12 h-screen px-8 md:px-24 bg-gradient-to-br ${sectionBg[idx]}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              {/* Text: Always left */}
              <div className="md:w-1/2 text-left flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                  {dosha.name}
                </h2>
                <p className="text-lg md:text-xl text-gray-800 mb-6">
                  {dosha.intro}
                </p>
                <p className="text-gray-700 md:text-lg whitespace-pre-line">
                  {dosha.details}
                </p>
              </div>

              {/* Image: Alternates sides */}
              <div
                className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl flex items-center justify-center ${
                  !isEven ? "md:order-0" : "md:order-2"
                }`}
              >
                <Image
                  src={dosha.imgSrc}
                  alt={dosha.name}
                  fill
                  className="object-cover scale-110"
                  priority={idx === 0}
                />
              </div>
            </motion.section>
          );
        })}
      </div>
    </>
  );
}
