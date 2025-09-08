import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white">
      {/* Text */}
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Cloud-based Ayurvedic Diet Plan Recommendation System
        </h1>
        <p className="text-gray-600 text-lg">
          Get personalized diet recommendations based on your unique body
          constitution
        </p>
        <Link
          href="/get-started"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Image */}
      <div className="mt-10 md:mt-0">
        <Image
          src="/images/homepage1.svg"
          alt="Ayurvedic Diet Illustration"
          width={400}
          height={400}
          priority
        />
      </div>
    </section>
  );
}
