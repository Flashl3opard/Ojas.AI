import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  const linkClasses = "hover:text-green-600 transition";
  const loginButtonClasses =
    "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition";

  return (
    <nav className="flex items-center justify-between py-4 px-16 shadow-sm bg-white">
      <Logo />
      {/* Navigation links, hidden on small screens */}
      <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <li>
          <Link href="/" className={linkClasses}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/plans" className={linkClasses}>
            Plans
          </Link>
        </li>
        <li>
          <Link href="/about" className={linkClasses}>
            About
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
