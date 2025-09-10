export type Dosha = "Vata" | "Pitta" | "Kapha";

export interface Question {
  id: string;
  text: string;
  options: { label: string; dosha: Dosha }[];
}

export const questions: Question[] = [
  {
    id: "frame",
    text: "Body Frame",
    options: [
      { label: "Small/Thin", dosha: "Vata" },
      { label: "Medium/Muscular", dosha: "Pitta" },
      { label: "Large/Heavy", dosha: "Kapha" },
    ],
  },
  {
    id: "skin",
    text: "Skin Type",
    options: [
      { label: "Dry/Rough", dosha: "Vata" },
      { label: "Oily/Sensitive", dosha: "Pitta" },
      { label: "Smooth/Cool", dosha: "Kapha" },
    ],
  },
  {
    id: "hair",
    text: "Hair Type",
    options: [
      { label: "Dry/Curly", dosha: "Vata" },
      { label: "Straight/Fine", dosha: "Pitta" },
      { label: "Thick/Lustrous", dosha: "Kapha" },
    ],
  },
  {
    id: "memory",
    text: "Memory",
    options: [
      { label: "Learns quick, forgets quick", dosha: "Vata" },
      { label: "Sharp, clear memory", dosha: "Pitta" },
      { label: "Slow to learn, retains long", dosha: "Kapha" },
    ],
  },
  {
    id: "personality",
    text: "Personality Traits",
    options: [
      { label: "Creative, restless", dosha: "Vata" },
      { label: "Competitive, ambitious", dosha: "Pitta" },
      { label: "Nurturing, calm", dosha: "Kapha" },
    ],
  },
];
