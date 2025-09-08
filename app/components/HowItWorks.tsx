import { UserPlus, ClipboardCheck, FileText } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-10 h-10 text-green-600" />,
    title: "Sign up",
    desc: "Create an account with your basic information",
  },
  {
    icon: <ClipboardCheck className="w-10 h-10 text-green-600" />,
    title: "Answer questionnaire",
    desc: "Answer a few questions about your diet and lifestyle",
  },
  {
    icon: <FileText className="w-10 h-10 text-green-600" />,
    title: "Get recommendations",
    desc: "Receive personalized diet plans based on the Ayurvedic principles",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-6 md:px-20 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-12">How it works</h2>
      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-4">
            {step.icon}
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
