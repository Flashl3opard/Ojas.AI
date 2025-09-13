import { Leaf } from "lucide-react"; // ✅ this gives you the leaf icon
import Link from "next/link"; // ✅ Next.js Link for navigation
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      {/* Icon */}
      <Leaf className="w-7 h-7 text-green-600 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />

      {/* Text */}
      <span className="text-xl md:text-2xl font-extrabold">
        <span className="text-green-600">Ojas</span>
        <span className="text-white">.AI</span>
      </span>
    </Link>
  );
};

export default Logo;
