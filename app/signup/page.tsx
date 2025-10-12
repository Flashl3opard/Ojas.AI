"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { auth, db } from "../../firebase/ClientApp";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Logo Component
const Logo = () => (
  <Link href="/" className="hidden md:flex items-center space-x-2 group">
    <Leaf className="w-7 h-7 text-green-600 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
    <span className="text-xl md:text-2xl font-extrabold">
      <span className="text-green-600">Ojas</span>
      <span className="text-black">.AI</span>
    </span>
  </Link>
);

const SignupPage = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<"patient" | "doctor" | "admin" | "">(
    ""
  );
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userRole) {
      alert("Please select a role.");
      return;
    }

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 2️⃣ Prepare Firestore user data
      const userData: any = {
        uid,
        name: fullName,
        email,
        phoneNumber,
        role: userRole,
        createdAt: new Date().toISOString(),
        profilePicture: "https://via.placeholder.com/40",
      };

      if (userRole === "doctor") {
        userData.medicalLicenseNumber = medicalLicenseNumber;
        userData.patients = []; // initialize empty array for assigned patients
      }

      // 3️⃣ Choose Firestore collection
      const collectionName =
        userRole === "doctor"
          ? "doctors"
          : userRole === "patient"
          ? "patients"
          : "admins";

      // 4️⃣ Save user in Firestore
      await setDoc(doc(db, collectionName, uid), userData);

      // 5️⃣ Save locally
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userData", JSON.stringify(userData));
      window.dispatchEvent(new Event("loginStateChange"));

      alert("Registered successfully ✅");

      // 6️⃣ Redirect by role
      if (userRole === "doctor") router.push("/Dashboard");
      else if (userRole === "patient") router.push("/Dashboard-patient");
      else router.push("/admin-dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      alert(error.message || "Signup failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl gap-12 lg:gap-16">
        {/* Left image */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <Image
            src="/images/image2.png"
            alt="Ayurvedic Diet Illustration"
            width={400}
            height={400}
            className="rounded-xl"
          />
        </div>

        {/* Signup Form */}
        <div className="flex-1 w-full max-w-md p-6 bg-white rounded-xl shadow-md">
          <Logo />
          <h2 className="text-2xl font-bold text-gray-800 mb-8 mt-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              required
            />

            <select
              value={userRole}
              onChange={(e) =>
                setUserRole(e.target.value as "patient" | "doctor" | "admin")
              }
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              required
            >
              <option value="">Select a role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>

            {userRole === "doctor" && (
              <input
                type="text"
                placeholder="Medical License Number"
                value={medicalLicenseNumber}
                onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                required
              />
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-600 font-medium hover:text-green-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
