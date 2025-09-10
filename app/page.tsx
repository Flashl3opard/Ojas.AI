import Navbar from "./components/Navbar";
import Hero from "./components/Homepage/Hero";
import HowItWorks from "./components/Homepage/HowItWorks";
import DoshaEducation from "./components/Homepage/DoshaEducation";
import Features from "./components/Homepage/Features";
import Conditions from "./components/Homepage/Conditions";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <Features />
        <DoshaEducation />
        <HowItWorks />
        <Conditions />
      </main>
    </>
  );
}
