import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white">
      <div
        className="mb-8 md:mb-0 flex justify-center md:hidden"
        data-aos="fade-down"
        data-aos-delay="100"
      >
        <Image
          src="/images/homepage1.svg"
          alt="Ayurvedic Diet Illustration"
          width={280}
          height={280}
          priority
        />
      </div>

      <div
        className="max-w-xl space-y-6 text-center md:text-left"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
          Cloud-based Ayurvedic <br /> Diet Plan Recommendation System
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

      <div
        className="hidden md:flex md:ml-10"
        data-aos="fade-left"
        data-aos-delay="300"
      >
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
