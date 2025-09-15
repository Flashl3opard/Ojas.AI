"use client";

import Link from "next/link";
import { FaLeaf, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1A3129] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h2 className="text-lg font-bold text-green-600 mb-3">
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
          <h2 className="text-lg font-bold text-green-600 mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-green-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/assessment"
                className="hover:text-green-600 transition"
              >
                Dosha Assessment
              </Link>
            </li>
            <li>
              <Link href="/diet" className="hover:text-green-600 transition">
                Weekly Diet Plan
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-green-600 transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-bold text-green-600 mb-3">Contact</h2>
          <p className="text-sm">📧 23BME073@IIITDMJ.AC.IN</p>
          <p className="text-sm">📍 Jabalpur, India</p>
          <div className="flex space-x-4 mt-3">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 transition text-lg"
            >
              <FaLeaf />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 transition text-lg"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 transition text-lg"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#1A3129] text-center py-3 text-sm">
        © {new Date().getFullYear()} Ayurvedic Wellness. All rights reserved.
      </div>
    </footer>
  );
}
