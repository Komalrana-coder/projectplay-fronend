"use client";

import Navbar from "../_component/HomeNavbar/page";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen ">
      {/* Main Content */}
      <div className="flex-1">
        <Navbar/>
        <div className="p-4">
          {children} 
        </div>
      </div>
    </div>
  );
}