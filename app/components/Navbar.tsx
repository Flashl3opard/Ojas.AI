"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClasses = "hover:text-green-600 transition";
  const loginButtonClasses =
    "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition";
  const signupButtonClasses =
    "ml-3 border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition bg-white";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#1A3129] shadow-sm relative z-40">
      <div className="flex items-center justify-between py-4 px-6 md:px-16">
        <Logo />

        {/* Desktop Navigation links */}
        <ul className="hidden md:flex space-x-8 text-white">
          <li>
            <Link href="/" className={linkClasses}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/assessment" className={linkClasses}>
              Dosha Assessment
            </Link>
          </li>
          <li>
            <Link href="/diet-doc" className={linkClasses}>
              Weekly Diet Plan
            </Link>
          </li>
          <li>
            <Link href="/remedies" className={linkClasses}>
              Remedies
            </Link>
          </li>
          <li>
            <Link href="/contact" className={linkClasses}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center">
          <Link href="/login" className={loginButtonClasses}>
            Login
          </Link>
          <Link href="/signup" className={signupButtonClasses}>
            Signup
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-green-600 p-2 rounded"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1A3129] border-t border-green-800 relative z-50 shadow-lg">
          <ul className="py-4 px-6 space-y-4 text-white">
            <li>
              <Link
                href="/"
                className={linkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/assessment"
                className={linkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Dosha Assessment
              </Link>
            </li>
            <li>
              <Link
                href="/diet"
                className={linkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Weekly Diet Plan
              </Link>
            </li>
            <li>
              <Link
                href="/remedies"
                className={linkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Remedies
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={linkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Auth Buttons */}
          <div className="px-6 pb-4 space-y-3">
            <Link
              href="/login"
              className="block text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block text-center border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition bg-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
