"use client";

export default function Footer() {
  return (
    <footer className="bg-green-200 text-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h2 className="text-lg font-bold text-green-700 mb-3">
            Ayurvedic Wellness
          </h2>
          <p className="text-sm">
            Personalized diet plans and lifestyle tips based on ancient
            Ayurvedic principles to balance your doshas and improve overall
            wellbeing.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold text-green-700 mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-green-600 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/assessment" className="hover:text-green-600 transition">
                Dosha Assessment
              </a>
            </li>
            <li>
              <a href="/diet" className="hover:text-green-600 transition">
                Weekly Diet Plan
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-green-600 transition">
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-bold text-green-700 mb-3">Contact</h2>
          <p className="text-sm">📧 23BME073@IIITDMJ.AC.IN</p>
          <p className="text-sm">📍 Jabalpur, India</p>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="hover:text-green-600 transition">
              🌿
            </a>
            <a href="#" className="hover:text-green-600 transition">
              📘
            </a>
            <a href="#" className="hover:text-green-600 transition">
              🐦
            </a>
          </div>
        </div>
      </div>

      <div className="bg-green-200 text-center py-3 text-sm">
        © {new Date().getFullYear()} Ayurvedic Wellness. All rights reserved.
      </div>
    </footer>
  );
}
