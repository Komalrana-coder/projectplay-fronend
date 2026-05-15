"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-sm px-4 py-3">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <Image
            height={100}
            width={100}
            alt="logo"
            src="/logo.png"
            className="w-12 md:w-14"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 shadow bg-white px-4 py-2 rounded-full text-sm text-gray-600">
          <Link
            href="/home/features#features"
            className="px-4 py-1 rounded-full hover:bg-gray-200"
          >
            Features
          </Link>

          <Link
            href="/home/features#howItWorks"
            className="px-4 py-1 rounded-full hover:bg-gray-200"
          >
            How It Works
          </Link>

          <Link
            href="/home/features#Faq"
            className="px-4 py-1 rounded-full hover:bg-gray-200"
          >
            FAQ
          </Link>

          <Link
            href="/home/cancellation"
            className="px-4 py-1 rounded-full hover:bg-gray-200"
          >
            Cancellation & Refund
          </Link>

        
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 bg-white shadow-md rounded-xl p-4 text-gray-700">
          <Link
            href="/home/features#features"
            onClick={() => setMenuOpen(false)}
            className="hover:text-black"
          >
            Features
          </Link>

          <Link
            href="/home/features#howItWorks"
            onClick={() => setMenuOpen(false)}
            className="hover:text-black"
          >
            How It Works
          </Link>

          <Link
            href="/home/features#Faq"
            onClick={() => setMenuOpen(false)}
            className="hover:text-black"
          >
            FAQ
          </Link>

          <Link
            href="/home/cancellation"
            onClick={() => setMenuOpen(false)}
            className="hover:text-black"
          >
            Cancellation & Refund
          </Link>

         
        </div>
      )}
    </nav>
  );
}