"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";

interface User {
  name: string;
  email: string;
  profilePicture: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage for login status on component mount and when storage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoggedIn");
      const userData = localStorage.getItem("userData");

      if (loginStatus === "true" && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData) as User);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    // Check on mount
    checkLoginStatus();

    // Listen for storage changes (when login happens from another tab/page)
    window.addEventListener("storage", checkLoginStatus);

    // Custom event listener for same-page login
    window.addEventListener("loginStateChange", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);

  const linkClasses = "hover:text-green-600 transition";
  const loginButtonClasses =
    "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition";
  const signupButtonClasses =
    "ml-3 border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition bg-white";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUser(null);

    // Dispatch custom event to update other components if needed
    window.dispatchEvent(new Event("loginStateChange"));

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
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

        {/* Desktop Auth Buttons / Profile Icon */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-white">
                <CgProfile size={32} className="text-white" />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={loginButtonClasses}>
                Login
              </Link>
              <Link href="/signup" className={signupButtonClasses}>
                Signup
              </Link>
            </>
          )}
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

          {/* Mobile Auth Buttons / Profile Icon */}
          <div className="px-6 pb-4 space-y-3">
            {isLoggedIn ? (
              <>
                <div className="text-white text-center text-sm mb-2">
                  Welcome!
                </div>
                <Link
                  href="/profile"
                  className="block text-center border border-white text-white px-4 py-2 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <CgProfile size={24} className="text-white" />
                    <span>View Profile</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
