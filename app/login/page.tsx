"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
// import { CgProfile } from "react-icons/cg";

// Logo Component - Hidden on mobile with md:flex
const Logo = () => (
  <Link href="/" className="hidden md:flex items-center space-x-2 group">
    <Leaf className="w-7 h-7 text-green-600 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
    <span className="text-xl md:text-2xl font-extrabold">
      <span className="text-green-600">Ojas</span>
      <span className="text-black">.AI</span>
    </span>
  </Link>
);

const Page = () => {
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<"patient" | "doctor" | "admin" | "">(
    ""
  );

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userRole) {
      alert("Please select a role.");
      return;
    }

    if (isRegistering) {
      // Registration logic
      const userData = {
        name: fullName,
        email: email,
        role: userRole,
        phoneNumber: phoneNumber,
        profilePicture: "https://via.placeholder.com/40",
        ...(userRole === "doctor" && { medicalLicenseNumber }),
      };

      // Set login status in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify(userData));

      // Dispatch custom event to notify navbar
      window.dispatchEvent(new Event("loginStateChange"));

      console.log(`Registering as ${userRole}:`, {
        fullName,
        email,
        password,
        phoneNumber,
        medicalLicenseNumber:
          userRole === "doctor" ? medicalLicenseNumber : undefined,
      });
      alert("Registered successfully ✅");
      router.push("/Dashboard"); // redirect after registration
    } else {
      // Login logic
      let userData;

      // DEMO LOGIN CHECK
      if (email === "id-1111" && password === "1111") {
        userData = {
          name: "Demo User",
          email: "demo@ojas.ai",
          role: userRole,
          profilePicture: "https://via.placeholder.com/40",
        };

        console.log("Logged in as demo user:", {
          email,
          password,
          role: userRole,
        });
      } else {
        // Regular login (accept any credentials for demo)
        userData = {
          name: email.split("@")[0] || email, // Use email prefix as name
          email: email,
          role: userRole,
          profilePicture: "https://via.placeholder.com/40",
        };

        console.log(`Logging in as ${userRole}:`, { email, password });
      }

      // Set login status in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify(userData));

      // Dispatch custom event to notify navbar
      window.dispatchEvent(new Event("loginStateChange"));

      alert("Logged in successfully ✅");
      router.push("/Dashboard"); // redirect after login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl gap-12 lg:gap-16">
        {/* Left section: Image (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <div className="relative">
            <Image
              src="/images/image2.png"
              alt="Ayurvedic Diet Illustration"
              width={400}
              height={400}
              priority
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Right section: Login/Registration Form */}
        <div className="flex-1 w-full max-w-md">
          <div className="p-6">
            {/* Logo - hidden on mobile */}
            <div className="hidden md:flex">
              <Logo />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-8 mt-6">
              {isRegistering ? "Create Your Account" : "Welcome Back"}
            </h2>

            {/* Demo Hint Box (only in login mode) */}
            {!isRegistering && (
              <div className="mb-6 p-4 border border-green-300 bg-green-50 rounded-lg text-sm text-green-800">
                <p className="font-semibold">Demo Credentials</p>
                <p>
                  Email: <span className="font-mono">id-1111</span>
                </p>
                <p>
                  Password: <span className="font-mono">1111</span>
                </p>
                <p className="mt-2 text-xs text-green-700">
                  Or enter any email/password to login
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>
              )}

              {/* Email input */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="you@example.com or id-1111"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-green-500 transition-colors duration-200"
                  required
                />
              </div>

              {/* Password input */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-green-500 transition-colors duration-200"
                  required
                />
              </div>

              {isRegistering && (
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>
              )}

              {/* Role selection dropdown */}
              <div>
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="userRole"
                >
                  Role
                </label>
                <div className="relative">
                  <select
                    id="userRole"
                    value={userRole}
                    onChange={(e) =>
                      setUserRole(
                        e.target.value as "patient" | "doctor" | "admin"
                      )
                    }
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-green-500 transition-colors duration-200 appearance-none bg-white"
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {isRegistering && userRole === "doctor" && (
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="medicalLicenseNumber"
                  >
                    Medical License Number
                  </label>
                  <input
                    id="medicalLicenseNumber"
                    type="text"
                    placeholder="Enter your medical license number"
                    value={medicalLicenseNumber}
                    onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {isRegistering ? "Create Account" : "Sign In"}
              </button>
            </form>

            {/* Toggle register/login */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-green-600 hover:text-green-700 font-medium ml-2 transition-colors duration-200"
                >
                  {isRegistering ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
