import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  const linkClasses = "hover:text-green-600 transition";
  const loginButtonClasses =
    "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition";

  return (
    <nav className="flex items-center justify-between py-4 px-6 md:px-16 shadow-sm bg-white">
      <Logo />

      {/* Navigation links, hidden on small screens */}
      <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
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
          <Link href="/diet" className={linkClasses}>
            Weekly Diet Plan
          </Link>
        </li>
        <li>
          <Link href="/remedies" className={linkClasses}>
            Remedies
          </Link>
        </li>
        <li>
          <Link href="/about" className={linkClasses}>
            About Us
          </Link>
        </li>
        <li>
          <Link href="/contact" className={linkClasses}>
            Contact
          </Link>
        </li>
      </ul>

      <Link href="/login" className={loginButtonClasses}>
        Login
      </Link>
    </nav>
  );
}
