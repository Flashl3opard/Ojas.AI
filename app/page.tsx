"use client";
import Navbar from "./components/Navbar";
import Hero from "./components/Homepage/Hero";
import HowItWorks from "./components/Homepage/HowItWorks";
import DoshaEducation from "./components/Homepage/DoshaEducation";
import Features from "./components/Homepage/Features";
import Conditions from "./components/Homepage/Conditions";
import Footer from "./components/Footer";

// ✅ Import your ChatBot component
import ChatBot from "./components/ChatBot";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-white relative">
        {/* Main Sections */}
        <Navbar />
        <Hero />
        <Features />
        <DoshaEducation />
        <ChatBot />
        <Conditions />
        <HowItWorks />
        <Footer />
      </main>
    </>
  );
}
