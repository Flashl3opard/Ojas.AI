import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 shadow-sm bg-white">
      <Logo />
      <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/plans">Plans</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>

      <Link
        href="/login"
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Login
      </Link>
    </nav>
  );
}
