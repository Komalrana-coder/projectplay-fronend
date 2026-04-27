"use client";
import Navbar from "../_component/Navbar/page";

export default function AuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen ">
      {/* Main Content */}
      <div className="flex-1">
        <Navbar /> {/* ✅ common navbar */}
        <div className="p-4">
          {children} {/* ✅ all pages render here */}
        </div>
      </div>
    </div>
  );
}