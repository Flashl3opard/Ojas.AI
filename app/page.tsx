import Navbar from "./components/Navbar";
import Hero from "./components/Homepage/Hero";
import HowItWorks from "./components/Homepage/HowItWorks";
import DoshaEducation from "./components/Homepage/DoshaEducation";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <HowItWorks />
        <DoshaEducation />
      </main>
    </>
  );
}
